import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { forgotPasswordSchema } from '@/lib/validation/schemas'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = forgotPasswordSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { email } = validation.data

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists, a password reset link has been sent',
      })
    }

    // Generate secure token
    const token = nanoid(32)
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    })

    // TODO: Send email with reset link
    // For development, log the token
    console.log(`Password reset token for ${email}: ${token}`)
    console.log(`Reset URL: ${process.env.AUTH_URL}/reset-password/${token}`)

    return NextResponse.json({
      success: true,
      message: 'If an account exists, a password reset link has been sent',
      // Include token in development for testing
      ...(process.env.NODE_ENV === 'development' && { devToken: token }),
    })
  } catch (error) {
    console.error('Error requesting password reset:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}