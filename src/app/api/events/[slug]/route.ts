import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        coordinators: { orderBy: { order: 'asc' } },
        scheduleItems: { orderBy: { order: 'asc' } },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Calculate derived status based on dates
    const now = new Date()
    let derivedStatus = event.status

    if (event.status !== 'CANCELLED' && event.status !== 'DRAFT') {
      if (event.endDate && now > event.endDate) {
        derivedStatus = 'COMPLETED'
      } else if (now >= event.startDate && (!event.endDate || now <= event.endDate)) {
        derivedStatus = 'ONGOING'
      } else if (event.registrationOpenDate && event.registrationDeadline &&
                 now >= event.registrationOpenDate && now <= event.registrationDeadline &&
                 event.internalRegistrationEnabled) {
        derivedStatus = 'REGISTRATION_OPEN'
      } else if (event.registrationDeadline && now > event.registrationDeadline) {
        derivedStatus = 'COMPLETED'
      } else {
        derivedStatus = 'UPCOMING'
      }
    }

    // Get registration count
    const registrationCount = await prisma.eventRegistration.count({
      where: {
        eventId: event.id,
        status: { in: ['PENDING', 'CONFIRMED', 'WAITLISTED'] },
      },
    })

    const teamRegistrationCount = await prisma.teamRegistration.count({
      where: {
        eventId: event.id,
        status: { in: ['PENDING', 'CONFIRMED', 'WAITLISTED'] },
      },
    })

    const totalRegistrations = registrationCount + teamRegistrationCount

    return NextResponse.json({
      ...event,
      derivedStatus,
      registrationCount: totalRegistrations,
      isRegistrationOpen: derivedStatus === 'REGISTRATION_OPEN' && 
        (!event.participantLimit || totalRegistrations < event.participantLimit),
      isFull: event.participantLimit ? totalRegistrations >= event.participantLimit : false,
    })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}