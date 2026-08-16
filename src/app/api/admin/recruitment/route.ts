import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'
import { recruitmentDriveSchema } from '@/lib/validation/schemas'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const driveId = searchParams.get('driveId')

    if (driveId) {
      const drive = await prisma.recruitmentDrive.findUnique({
        where: { id: driveId },
        include: {
          applications: {
            include: {
              user: { select: { id: true, name: true, email: true, college: true, course: true, branch: true, year: true } },
            },
            orderBy: { submittedAt: 'desc' },
          },
        },
      })
      return NextResponse.json({ drive })
    }

    const drives = await prisma.recruitmentDrive.findMany({
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ drives })
  } catch (error) {
    console.error('Error fetching admin recruitment:', error)
    return NextResponse.json({ error: 'Failed to fetch recruitment' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = recruitmentDriveSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const drive = await prisma.recruitmentDrive.create({
      data: {
        ...validation.data,
        startDate: validation.data.startDate ? new Date(validation.data.startDate) : null,
        deadline: validation.data.deadline ? new Date(validation.data.deadline) : null,
      },
    })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'CREATE_RECRUITMENT_DRIVE',
        targetType: 'RecruitmentDrive',
        targetId: drive.id,
        metadata: { title: drive.title },
      },
    })

    return NextResponse.json(drive, { status: 201 })
  } catch (error) {
    console.error('Error creating recruitment drive:', error)
    return NextResponse.json({ error: 'Failed to create recruitment drive' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { driveId, ...data } = body

    if (!driveId) {
      return NextResponse.json({ error: 'Drive ID is required' }, { status: 400 })
    }

    const drive = await prisma.recruitmentDrive.update({
      where: { id: driveId },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      },
    })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'UPDATE_RECRUITMENT_DRIVE',
        targetType: 'RecruitmentDrive',
        targetId: driveId,
        metadata: { title: drive.title },
      },
    })

    return NextResponse.json(drive)
  } catch (error) {
    console.error('Error updating recruitment drive:', error)
    return NextResponse.json({ error: 'Failed to update recruitment drive' }, { status: 500 })
  }
}