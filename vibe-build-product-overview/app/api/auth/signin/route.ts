import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createSession } from '@/lib/auth-utils'
import { userStore } from '@/lib/user-store'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase()

    // Find user
    const foundUser = userStore.findByEmail(normalizedEmail)

    if (!foundUser) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, foundUser.passwordHash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create session
    await createSession(foundUser.id)

    console.log('[Auth] User signin successful:', foundUser.id)

    return NextResponse.json(
      { success: true, userId: foundUser.id },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[Auth] Signin error:', errorMessage)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
