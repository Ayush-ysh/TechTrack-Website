import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const type = searchParams.get('type')

    const where: Record<string, unknown> = {}

    if (active !== 'false') {
      where.active = true
      const now = new Date()
      where.AND = [
        { OR: [{ startDate: null }, { startDate: { lte: now } }] },
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      ]
    }
    if (type) {
      where.type = type
    }

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ announcements })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
  }
}