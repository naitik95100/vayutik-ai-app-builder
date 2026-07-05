import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, createSession, generateUserId } from '@/lib/auth-utils'
import { userStore } from '@/lib/user-store'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase()

    // Check if user exists
    if (userStore.emailExists(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      )
    }

    // Create user
    const userId = generateUserId()
    const hashedPassword = await hashPassword(password)

    userStore.create({
      id: userId,
      name,
      email: normalizedEmail,
      passwordHash: hashedPassword,
    })

    // Create session
    await createSession(userId)

    console.log('[Auth] User signup successful:', userId)

    return NextResponse.json(
      { success: true, userId },
      { status: 201 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[Auth] Signup error:', errorMessage)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
