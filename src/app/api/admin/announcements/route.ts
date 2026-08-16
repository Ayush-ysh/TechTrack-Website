import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'
import { announcementSchema } from '@/lib/validation/schemas'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ announcements })
  } catch (error) {
    console.error('Error fetching admin announcements:', error)
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = announcementSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const announcement = await prisma.announcement.create({
      data: {
        ...validation.data,
        startDate: validation.data.startDate ? new Date(validation.data.startDate) : null,
        endDate: validation.data.endDate ? new Date(validation.data.endDate) : null,
      },
    })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'CREATE_ANNOUNCEMENT',
        targetType: 'Announcement',
        targetId: announcement.id,
        metadata: { title: announcement.title },
      },
    })

    return NextResponse.json(announcement, { status: 201 })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
  }
}