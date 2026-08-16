import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'
import { teamMemberSchema, slugify } from '@/lib/validation/schemas'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const division = searchParams.get('division')
    const active = searchParams.get('active')

    const where: Record<string, unknown> = {}
    if (division && division !== 'all') where.division = division
    if (active === 'false') where.active = false
    else if (active === 'true') where.active = true

    const members = await prisma.teamMember.findMany({
      where,
      orderBy: [
        { division: 'asc' },
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Error fetching admin team members:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = teamMemberSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const data = validation.data
    let slug = data.slug || slugify(data.name)

    let existingMember = await prisma.teamMember.findUnique({ where: { slug } })
    let counter = 1
    while (existingMember) {
      slug = `${slugify(data.name)}-${counter}`
      existingMember = await prisma.teamMember.findUnique({ where: { slug } })
      counter++
    }

    const member = await prisma.teamMember.create({
      data: { ...data, slug },
    })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'CREATE_TEAM_MEMBER',
        targetType: 'TeamMember',
        targetId: member.id,
        metadata: { name: member.name, division: member.division },
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}