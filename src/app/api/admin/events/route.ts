import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'
import { createEventSchema, slugify } from '@/lib/validation/schemas'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}
    if (status && status !== 'all') where.status = status
    if (category && category !== 'all') where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          _count: { select: { registrations: true, teamRegistrations: true } },
        },
        orderBy: [
          { status: 'asc' },
          { startDate: 'desc' },
        ],
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({
      events,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Error fetching admin events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = createEventSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const data = validation.data
    let slug = slugify(data.title)

    // Ensure unique slug
    let existingEvent = await prisma.event.findUnique({ where: { slug } })
    let counter = 1
    while (existingEvent) {
      slug = `${slugify(data.title)}-${counter}`
      existingEvent = await prisma.event.findUnique({ where: { slug } })
      counter++
    }

    const event = await prisma.event.create({
      data: {
        ...data,
        slug,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        registrationOpenDate: data.registrationOpenDate ? new Date(data.registrationOpenDate) : null,
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : null,
        coordinators: data.coordinators ? {
          create: data.coordinators.map((c, i) => ({ ...c, order: c.order ?? i })),
        } : undefined,
        scheduleItems: data.scheduleItems ? {
          create: data.scheduleItems.map((s, i) => ({
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
        action: 'CREATE_EVENT',
        targetType: 'Event',
        targetId: event.id,
        metadata: { title: event.title },
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}