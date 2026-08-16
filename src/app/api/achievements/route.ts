import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const year = searchParams.get('year')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: Record<string, unknown> = {}

    if (published !== 'false') {
      where.published = true
    }
    if (featured === 'true') {
      where.featured = true
    }
    if (year) {
      where.year = parseInt(year)
    }

    const achievements = await prisma.achievement.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { displayOrder: 'asc' },
      ],
      take: limit,
    })

    return NextResponse.json({ achievements })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}