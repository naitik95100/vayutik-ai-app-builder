'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { and, eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createProject(input: { name: string; description?: string } | string, description?: string) {
  const userId = await getUserId()
  
  // Support both old and new signatures
  let projectName: string
  let projectDescription: string | undefined
  
  if (typeof input === 'object') {
    projectName = input.name
    projectDescription = input.description
  } else {
    projectName = input
    projectDescription = description
  }
  
  const [project] = await db
    .insert(projects)
    .values({
      userId,
      name: projectName,
      description: projectDescription,
      status: 'draft',
    })
    .returning()
  
  revalidatePath('/studio')
  return project
}

export async function getProjects() {
  const userId = await getUserId()
  
  return db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.createdAt))
}

export async function getProject(projectId: number) {
  const userId = await getUserId()
  
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
  
  if (!project) throw new Error('Project not found')
  return project
}

export async function updateProject(projectId: number, updates: {
  name?: string
  description?: string
  generatedCode?: string
  status?: string
  deploymentUrl?: string
}) {
  const userId = await getUserId()
  
  const [project] = await db
    .update(projects)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .returning()
  
  if (!project) throw new Error('Project not found')
  
  revalidatePath('/studio')
  revalidatePath(`/studio/${projectId}`)
  return project
}

export async function deleteProject(projectId: number) {
  const userId = await getUserId()
  
  await db
    .delete(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
  
  revalidatePath('/studio')
}
