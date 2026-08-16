import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'
import { teamMemberSchema } from '@/lib/validation/schemas'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const member = await prisma.teamMember.findUnique({ where: { id } })

    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validation = teamMemberSchema.partial().safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: validation.data,
    })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'UPDATE_TEAM_MEMBER',
        targetType: 'TeamMember',
        targetId: id,
        metadata: { name: member.name },
      },
    })

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const member = await prisma.teamMember.findUnique({ where: { id } })

    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    await prisma.teamMember.update({
      where: { id },
      data: { active: false },
    })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'ARCHIVE_TEAM_MEMBER',
        targetType: 'TeamMember',
        targetId: id,
        metadata: { name: member.name },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error archiving team member:', error)
    return NextResponse.json({ error: 'Failed to archive team member' }, { status: 500 })
  }
}