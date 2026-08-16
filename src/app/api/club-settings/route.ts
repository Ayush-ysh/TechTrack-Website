import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let settings = await prisma.clubSettings.findFirst()

    if (!settings) {
      settings = await prisma.clubSettings.create({
        data: { id: 'default' },
      })
    }

    // Calculate dynamic statistics
    const eventsCount = await prisma.event.count({ where: { published: true } })
    const individualRegistrations = await prisma.eventRegistration.count({ where: { status: { in: ['CONFIRMED', 'ATTENDED'] } } })
    const teamRegistrations = await prisma.teamRegistration.count({ where: { status: { in: ['CONFIRMED'] } } })
    const participantsCount = individualRegistrations + teamRegistrations
    const achievementsCount = await prisma.achievement.count({ where: { published: true } })

    return NextResponse.json({
      ...settings,
      statistics: {
        eventsCount,
        participantsCount,
        projectsCount: eventsCount * 3, // Estimate
        achievementsCount,
      },
    })
  } catch (error) {
    console.error('Error fetching club settings:', error)
    return NextResponse.json({ error: 'Failed to fetch club settings' }, { status: 500 })
  }
}