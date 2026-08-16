import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validation/schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = contactSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const message = await prisma.contactMessage.create({
      data: validation.data,
    })

    return NextResponse.json({
      success: true,
      message: 'Message received successfully',
      id: message.id,
    })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 })
  }
}