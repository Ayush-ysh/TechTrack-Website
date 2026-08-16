import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'
import { recruitmentApplicationSchema } from '@/lib/validation/schemas'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const open = searchParams.get('open')

    const where: Record<string, unknown> = {}
    if (open === 'true') {
      where.open = true
    }

    const drives = await prisma.recruitmentDrive.findMany({
      where,
      include: {
        applications: {
          where: { userId: searchParams.get('userId') || undefined },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ drives })
  } catch (error) {
    console.error('Error fetching recruitment drives:', error)
    return NextResponse.json({ error: 'Failed to fetch recruitment drives' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const validation = recruitmentApplicationSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { driveId, ...data } = validation.data

    const drive = await prisma.recruitmentDrive.findUnique({ where: { id: driveId } })
    if (!drive) {
      return NextResponse.json({ error: 'Recruitment drive not found' }, { status: 404 })
    }

    if (!drive.open) {
      return NextResponse.json({ error: 'Recruitment is not open' }, { status: 400 })
    }

    if (drive.deadline && new Date() > drive.deadline) {
      return NextResponse.json({ error: 'Recruitment deadline has passed' }, { status: 400 })
    }

    const existingApplication = await prisma.recruitmentApplication.findUnique({
      where: { driveId_userId: { driveId, userId: session.user.id } },
    })

    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied for this drive' }, { status: 400 })
    }

    const application = await prisma.recruitmentApplication.create({
      data: {
        driveId,
        userId: session.user.id,
        ...data,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application,
    })
  } catch (error) {
    console.error('Error submitting recruitment application:', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}