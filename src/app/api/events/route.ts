import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const published = searchParams.get('published')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (status && status !== 'all') {
      where.status = status
    }
    if (category && category !== 'all') {
      where.category = category
    }
    if (featured === 'true') {
      where.featured = true
    }
    if (published !== 'false') {
      where.published = true
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          coordinators: { orderBy: { order: 'asc' } },
          scheduleItems: { orderBy: { order: 'asc' } },
        },
        orderBy: [
          { featured: 'desc' },
          { startDate: 'asc' },
        ],
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching events:', error)
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
    const slug = body.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const existingEvent = await prisma.event.findUnique({ where: { slug } })
    const finalSlug = existingEvent ? `${slug}-${Date.now()}` : slug

    const event = await prisma.event.create({
      data: {
        ...body,
        slug: finalSlug,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        registrationOpenDate: body.registrationOpenDate ? new Date(body.registrationOpenDate) : null,
        registrationDeadline: body.registrationDeadline ? new Date(body.registrationDeadline) : null,
        coordinators: body.coordinators ? {
          create: body.coordinators.map((c: Record<string, unknown>, i: number) => ({
            ...c,
            order: c.order ?? i,
          })),
        } : undefined,
        scheduleItems: body.scheduleItems ? {
          create: body.scheduleItems.map((s: Record<string, unknown>, i: number) => ({
            ...s,
            startTime: new Date(s.startTime as string),
            endTime: s.endTime ? new Date(s.endTime as string) : null,
            order: s.order ?? i,
          })),
        } : undefined,
      },
      include: {
        coordinators: true,
        scheduleItems: true,
      },
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