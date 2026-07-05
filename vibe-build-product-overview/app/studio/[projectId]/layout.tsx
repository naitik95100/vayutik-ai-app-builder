import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Project - VibeBuild Studio',
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/sign-in')
  }

  return <>{children}</>
}
