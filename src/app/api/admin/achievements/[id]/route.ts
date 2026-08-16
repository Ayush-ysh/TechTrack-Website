import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'
import { achievementSchema } from '@/lib/validation/schemas'

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
    const achievement = await prisma.achievement.findUnique({ where: { id } })

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }

    return NextResponse.json({ achievement })
  } catch (error) {
    console.error('Error fetching achievement:', error)
    return NextResponse.json({ error: 'Failed to fetch achievement' }, { status: 500 })
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
    const validation = achievementSchema.partial().safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const achievement = await prisma.achievement.update({
      where: { id },
      data: validation.data,
    })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'UPDATE_ACHIEVEMENT',
        targetType: 'Achievement',
        targetId: id,
        metadata: { title: achievement.title },
      },
    })

    return NextResponse.json(achievement)
  } catch (error) {
    console.error('Error updating achievement:', error)
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 })
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
    const achievement = await prisma.achievement.findUnique({ where: { id } })

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }

    await prisma.achievement.delete({ where: { id } })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'DELETE_ACHIEVEMENT',
        targetType: 'Achievement',
        targetId: id,
        metadata: { title: achievement.title },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting achievement:', error)
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 })
  }
}