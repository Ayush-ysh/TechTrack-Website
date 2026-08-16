import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resetPasswordSchema } from '@/lib/validation/schemas'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, ...passwordData } = body

    if (!token) {
      return NextResponse.json({ error: 'Reset token is required' }, { status: 400 })
    }

    const validation = resetPasswordSchema.safeParse(passwordData)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!resetToken) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
    }

    if (resetToken.used) {
      return NextResponse.json({ error: 'This reset token has already been used' }, { status: 400 })
    }

    if (resetToken.expires < new Date()) {
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(validation.data.password, 12)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
  }
}