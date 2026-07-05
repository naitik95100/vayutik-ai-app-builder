import { verifySession } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'
import { ErrorBoundary } from '@/components/error-boundary'

export const metadata = {
  title: 'Studio - VibeBuild',
  description: 'Create your next app with AI',
}

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const session = await verifySession()
    
    if (!session) {
      redirect('/sign-in')
    }
  } catch (error) {
    console.error('[Studio] Layout error:', error)
    redirect('/sign-in')
  }

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}
