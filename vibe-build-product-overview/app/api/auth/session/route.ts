import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { verifySession } from '@/lib/auth-utils'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const session = await verifySession()

    if (!session) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      )
    }

    // Fetch user details
    const foundUser = await db
      .select()
      .from(user)
      .where(eq(user.id, session.userId))
      .limit(1)

    if (foundUser.length === 0) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        user: {
          id: foundUser[0].id,
          name: foundUser[0].name,
          email: foundUser[0].email,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Auth] Session check error:', error)
    return NextResponse.json(
      { user: null },
      { status: 200 }
    )
  }
}
