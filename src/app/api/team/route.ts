import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const division = searchParams.get('division')
    const active = searchParams.get('active')
    const featured = searchParams.get('featured')

    const where: Record<string, unknown> = {}

    if (division && division !== 'all') {
      where.division = division
    }
    if (active !== 'false') {
      where.active = true
    }
    if (featured === 'true') {
      where.featured = true
    }

    const members = await prisma.teamMember.findMany({
      where,
      orderBy: [
        { division: 'asc' },
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    })

    // Group by division
    const grouped = members.reduce((acc, member) => {
      if (!acc[member.division]) {
        acc[member.division] = []
      }
      acc[member.division].push(member)
      return acc
    }, {} as Record<string, typeof members>)

    return NextResponse.json({ members, grouped })
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}