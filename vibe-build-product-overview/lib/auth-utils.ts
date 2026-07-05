import { hash, compare } from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET || 'dev-secret-key-change-in-production-min-32-chars!!'
  return new TextEncoder().encode(secret)
}

const JWT_SECRET = getJWTSecret()

const SESSION_COOKIE_NAME = 'vibebuild-session'
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 // 7 days

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash)
}

export async function createSession(userId: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const expiresAt = now + SESSION_MAX_AGE

  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(expiresAt)
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  return token
}

export async function verifySession(token?: string): Promise<{ userId: string } | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = token || cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!sessionToken) {
      return null
    }

    const verified = await jwtVerify(sessionToken, JWT_SECRET)
    return verified.payload as { userId: string }
  } catch (error) {
    console.error('[Auth] Session verification failed:', error)
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
