import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'
import { updateEventSchema } from '@/lib/validation/schemas'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        coordinators: { orderBy: { order: 'asc' } },
        scheduleItems: { orderBy: { order: 'asc' } },
        _count: { select: { registrations: true, teamRegistrations: true } },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validation = updateEventSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const data = validation.data

    // Handle slug update
    let updateData = { ...data }
    if (data.title && data.title !== (await prisma.event.findUnique({ where: { id }, select: { title: true } }))?.title) {
      let slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

      let existingEvent = await prisma.event.findUnique({ where: { slug } })
      let counter = 1
      while (existingEvent && existingEvent.id !== id) {
        slug = `${slug}-${counter}`
        existingEvent = await prisma.event.findUnique({ where: { slug } })
        counter++
      }
      updateData = { ...updateData, slug }
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...updateData,
        startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
        endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
        registrationOpenDate: updateData.registrationOpenDate ? new Date(updateData.registrationOpenDate) : undefined,
        registrationDeadline: updateData.registrationDeadline ? new Date(updateData.registrationDeadline) : undefined,
        coordinators: updateData.coordinators ? {
          deleteMany: {},
          create: updateData.coordinators.map((c, i) => ({ ...c, order: c.order ?? i })),
        } : undefined,
        scheduleItems: updateData.scheduleItems ? {
          deleteMany: {},
          create: updateData.scheduleItems.map((s, i) => ({
            ...s,
            startTime: new Date(s.startTime),
            endTime: s.endTime ? new Date(s.endTime) : null,
            order: s.order ?? i,
          })),
        } : undefined,
      },
      include: { coordinators: true, scheduleItems: true },
    })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'UPDATE_EVENT',
        targetType: 'Event',
        targetId: event.id,
        metadata: { title: event.title },
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const event = await prisma.event.findUnique({ where: { id } })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Soft delete - mark as cancelled instead of actual deletion
    await prisma.event.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledReason: 'Deleted by admin',
        published: false,
      },
    })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'DELETE_EVENT',
        targetType: 'Event',
        targetId: id,
        metadata: { title: event.title },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}