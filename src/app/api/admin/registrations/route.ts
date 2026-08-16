import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const exportCsv = searchParams.get('export') === 'csv'

    const where: Record<string, unknown> = {}
    if (eventId) where.eventId = eventId
    if (status && status !== 'all') where.status = status
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { registrationNumber: { contains: search, mode: 'insensitive' } },
        { teamName: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [registrations, total] = await Promise.all([
      prisma.eventRegistration.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, college: true, course: true, branch: true, year: true } },
          event: { select: { id: true, title: true, slug: true, startDate: true } },
          teamMembers: true,
        },
        orderBy: { createdAt: 'desc' },
        take: exportCsv ? undefined : limit,
        skip: exportCsv ? undefined : (page - 1) * limit,
      }),
      prisma.eventRegistration.count({ where }),
    ])

    if (exportCsv) {
      const headers = [
        'Registration Number',
        'Event',
        'Name',
        'Email',
        'College',
        'Course',
        'Branch',
        'Year',
        'Participant Type',
        'Team Name',
        'Status',
        'Registered At',
      ]

      const rows = registrations.map(r => [
        r.registrationNumber,
        r.event.title,
        r.user.name,
        r.user.email,
        r.user.college || '',
        r.user.course || '',
        r.user.branch || '',
        r.user.year || '',
        r.participantType,
        r.teamName || '',
        r.status,
        r.createdAt.toISOString(),
      ])

      const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="registrations-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    return NextResponse.json({
      registrations,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Error fetching admin registrations:', error)
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { registrationId, status, action } = body

    if (!registrationId || !status) {
      return NextResponse.json({ error: 'Registration ID and status are required' }, { status: 400 })
    }

    const registration = await prisma.eventRegistration.update({
      where: { id: registrationId },
      data: { status },
      include: { event: true, user: true },
    })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: `UPDATE_REGISTRATION_${status.toUpperCase()}`,
        targetType: 'EventRegistration',
        targetId: registrationId,
        metadata: { eventTitle: registration.event.title, userName: registration.user.name },
      },
    })

    return NextResponse.json({ success: true, registration })
  } catch (error) {
    console.error('Error updating registration:', error)
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 })
  }
}