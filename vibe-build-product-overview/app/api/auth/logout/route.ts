import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('vibebuild-session')
    
    console.log('[Auth] User logout successful')

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Auth] Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
