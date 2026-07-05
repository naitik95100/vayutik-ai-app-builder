'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { messages } from '@/lib/db/schema'
import { and, eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getMessages(projectId: number) {
  const userId = await getUserId()
  
  return db
    .select()
    .from(messages)
    .where(and(eq(messages.projectId, projectId), eq(messages.userId, userId)))
    .orderBy(messages.createdAt)
}

export async function addMessage(projectId: number, role: 'user' | 'assistant', content: string, codeBlocks?: any) {
  const userId = await getUserId()
  
  const [message] = await db
    .insert(messages)
    .values({
      projectId,
      userId,
      role,
      content,
      codeBlocks: codeBlocks || null,
    })
    .returning()
  
  return message
}

export async function clearMessages(projectId: number) {
  const userId = await getUserId()
  
  await db
    .delete(messages)
    .where(and(eq(messages.projectId, projectId), eq(messages.userId, userId)))
}
