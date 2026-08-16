import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/auth/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, redirect } = body

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({ success: true, redirect: redirect || "/profile" })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}