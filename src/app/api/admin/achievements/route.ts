import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'
import { achievementSchema, slugify } from '@/lib/validation/schemas'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const year = searchParams.get('year')

    const where: Record<string, unknown> = {}
    if (published !== undefined) where.published = published === 'true'
    if (year) where.year = parseInt(year)

    const achievements = await prisma.achievement.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { displayOrder: 'asc' },
      ],
    })

    return NextResponse.json({ achievements })
  } catch (error) {
    console.error('Error fetching admin achievements:', error)
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = achievementSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const data = validation.data
    let slug = data.slug || slugify(data.title)

    let existing = await prisma.achievement.findUnique({ where: { slug } })
    let counter = 1
    while (existing) {
      slug = `${slugify(data.title)}-${counter}`
      existing = await prisma.achievement.findUnique({ where: { slug } })
      counter++
    }

    const achievement = await prisma.achievement.create({
      data: { ...data, slug },
    })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'CREATE_ACHIEVEMENT',
        targetType: 'Achievement',
        targetId: achievement.id,
        metadata: { title: achievement.title },
      },
    })

    return NextResponse.json(achievement, { status: 201 })
  } catch (error) {
    console.error('Error creating achievement:', error)
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 })
  }
}