import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'
import { eventRegistrationSchema } from '@/lib/validation/schemas'
import { nanoid } from 'nanoid'

function generateRegistrationNumber(eventSlug: string): string {
  const prefix = eventSlug
    .split('-')
    .map(s => s[0])
    .join('')
    .toUpperCase()
  const random = nanoid(6).toUpperCase()
  const year = new Date().getFullYear().toString().slice(-2)
  return `TT-${prefix}-${year}-${random}`
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', redirect: '/login' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const body = await request.json()

    const validation = eventRegistrationSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const data = validation.data

    // Fetch event with all details
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        coordinators: true,
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (!event.published) {
      return NextResponse.json({ error: 'Event is not published' }, { status: 400 })
    }

    if (event.status === 'CANCELLED') {
      return NextResponse.json({ error: 'Event has been cancelled' }, { status: 400 })
    }

    if (event.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Event has already completed' }, { status: 400 })
    }

    const now = new Date()
    if (event.registrationDeadline && now > event.registrationDeadline) {
      return NextResponse.json({ error: 'Registration deadline has passed' }, { status: 400 })
    }

    if (event.registrationOpenDate && now < event.registrationOpenDate) {
      return NextResponse.json({ error: 'Registration has not opened yet' }, { status: 400 })
    }

    if (!event.internalRegistrationEnabled) {
      return NextResponse.json(
        { error: 'Internal registration is not enabled for this event', externalUrl: event.registrationUrl },
        { status: 400 }
      )
    }

    // Check for existing registration
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId: event.id,
          userId: session.user.id,
        },
      },
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You are already registered for this event', registrationId: existingRegistration.registrationNumber },
        { status: 400 }
      )
    }

    // Check capacity
    const currentRegistrations = await prisma.eventRegistration.count({
      where: {
        eventId: event.id,
        status: { in: ['PENDING', 'CONFIRMED', 'WAITLISTED'] },
      },
    })

    const currentTeamRegistrations = await prisma.teamRegistration.count({
      where: {
        eventId: event.id,
        status: { in: ['PENDING', 'CONFIRMED', 'WAITLISTED'] },
      },
    })

    const totalRegistrations = currentRegistrations + currentTeamRegistrations

    if (event.participantLimit && totalRegistrations >= event.participantLimit) {
      if (!event.allowWaitlist) {
        return NextResponse.json({ error: 'Event has reached maximum capacity' }, { status: 400 })
      }
    }

    // Validate team size
    if (data.participantType === 'TEAM') {
      const memberCount = data.members?.length || 0
      if (memberCount < (event.teamMinSize || 1)) {
        return NextResponse.json(
          { error: `Minimum team size is ${event.teamMinSize || 1}` },
          { status: 400 }
        )
      }
      if (memberCount > (event.teamMaxSize || 1)) {
        return NextResponse.json(
          { error: `Maximum team size is ${event.teamMaxSize || 1}` },
          { status: 400 }
        )
      }
    }

    const registrationNumber = generateRegistrationNumber(event.slug)

    // Use transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      if (data.participantType === 'TEAM' && data.members && data.members.length > 0) {
        // Create team registration
        const teamReg = await tx.teamRegistration.create({
          data: {
            eventId: event.id,
            teamName: data.teamName || `${session.user.name}'s Team`,
            leaderId: session.user.id,
            status: 'PENDING',
            members: {
              create: [
                // Leader
                {
                  memberName: session.user.name,
                  email: session.user.email,
                  phone: session.user.phone || undefined,
                  college: session.user.college || undefined,
                  role: 'Team Leader',
                  userId: session.user.id,
                },
                // Other members
                ...data.members.map((m, i) => ({
                  memberName: m.memberName,
                  email: m.email,
                  phone: m.phone,
                  college: m.college,
                  role: m.role || `Member ${i + 2}`,
                  userId: undefined,
                })),
              ],
            },
          },
        })

        // Also create individual registration for the leader
        const individualReg = await tx.eventRegistration.create({
          data: {
            registrationNumber,
            eventId: event.id,
            userId: session.user.id,
            participantType: 'TEAM',
            teamName: data.teamName || `${session.user.name}'s Team`,
            status: 'PENDING',
            teamMembers: {
              create: [
                {
                  memberName: session.user.name,
                  email: session.user.email,
                  phone: session.user.phone || undefined,
                  college: session.user.college || undefined,
                  role: 'Team Leader',
                  userId: session.user.id,
                },
                ...data.members.map((m) => ({
                  memberName: m.memberName,
                  email: m.email,
                  phone: m.phone,
                  college: m.college,
                  role: m.role,
                  userId: undefined,
                })),
              ],
            },
          },
        })

        return { registration: individualReg, teamRegistration: teamReg }
      } else {
        // Individual registration
        const registration = await tx.eventRegistration.create({
          data: {
            registrationNumber,
            eventId: event.id,
            userId: session.user.id,
            participantType: 'INDIVIDUAL',
            status: 'PENDING',
            teamMembers: {
              create: [
                {
                  memberName: session.user.name,
                  email: session.user.email,
                  phone: session.user.phone || undefined,
                  college: session.user.college || undefined,
                  role: 'Participant',
                  userId: session.user.id,
                },
              ],
            },
          },
        })

        return { registration }
      }
    })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'EVENT_REGISTRATION',
        targetType: 'EventRegistration',
        targetId: result.registration.id,
        metadata: { eventId: event.id, eventTitle: event.title, teamName: data.teamName },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully',
      registrationId: result.registration.registrationNumber,
      registration: result.registration,
    })
  } catch (error) {
    console.error('Error registering for event:', error)
    return NextResponse.json({ error: 'Failed to register for event' }, { status: 500 })
  }
}