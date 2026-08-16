import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validation/schemas'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = registerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, password, college, course, branch, year, redirect } = validation.data

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        college,
        course,
        branch,
        year,
        role: 'STUDENT',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user,
      redirect: redirect || '/profile',
    })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}