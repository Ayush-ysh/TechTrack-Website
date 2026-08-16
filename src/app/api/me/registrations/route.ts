import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const registrations = await prisma.eventRegistration.findMany({
      where: { userId: session.user.id },
      include: {
        event: {
          include: {
            coordinators: { orderBy: { order: 'asc' } },
          },
        },
        teamMembers: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const teamRegistrations = await prisma.teamRegistrationMember.findMany({
      where: { userId: session.user.id },
      include: {
        teamRegistration: {
          include: {
            event: {
              include: {
                coordinators: { orderBy: { order: 'asc' } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Combine and deduplicate
    const allRegistrations = [
      ...registrations.map(r => ({
        ...r,
        type: 'individual' as const,
        teamName: r.teamName,
      })),
      ...teamRegistrations
        .filter(tr => tr.teamRegistration.leaderId !== session.user.id) // Avoid duplicates for leader
        .map(tr => ({
          ...tr.teamRegistration,
          type: 'team' as const,
          teamName: tr.teamRegistration.teamName,
          memberRole: tr.role,
        })),
    ]

    // Sort by event date
    allRegistrations.sort((a, b) => new Date(a.event.startDate).getTime() - new Date(b.event.startDate).getTime())

    return NextResponse.json({ registrations: allRegistrations })
  } catch (error) {
    console.error('Error fetching user registrations:', error)
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
  }
}