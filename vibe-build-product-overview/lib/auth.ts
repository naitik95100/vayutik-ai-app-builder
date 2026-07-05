import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) 
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) 
    return `https://${process.env.VERCEL_URL}`
  return process.env.V0_RUNTIME_URL || 'http://localhost:3000'
}

const getTrustedOrigins = () => {
  const origins = new Set<string>()
  
  // Add all configured URLs
  if (process.env.V0_RUNTIME_URL) origins.add(process.env.V0_RUNTIME_URL)
  if (process.env.VERCEL_URL) origins.add(`https://${process.env.VERCEL_URL}`)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) 
    origins.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  if (process.env.BETTER_AUTH_URL) origins.add(process.env.BETTER_AUTH_URL)
  
  // Always add localhost for development
  origins.add('http://localhost:3000')
  origins.add('http://localhost:3001')
  
  return Array.from(origins)
}

export const auth = betterAuth({
  database: pool,
  baseURL: getBaseURL(),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: getTrustedOrigins(),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
        advanced: {
          // In dev (v0 preview iframe), force cross-site cookies so the
          // session cookie is stored by the browser.
          defaultCookieAttributes: {
            sameSite: 'none' as const,
            secure: true,
          },
        },
      }
    : {}),
})
