'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ChatPanel } from '@/components/chat-panel'
import { PreviewPanel } from '@/components/preview-panel'
import { StudioHeader } from '@/components/studio-header'
import { getProject } from '@/app/actions/projects'

interface Project {
  id: number
  name: string
  description: string | null
  status: string
  generatedCode: string | null
  deploymentUrl: string | null
}

export default function ProjectEditor() {
  const params = useParams()
  const projectId = parseInt(params.projectId as string)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProject()
  }, [projectId])

  const loadProject = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProject(projectId)
      setProject(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project')
      console.error('[v0] Error loading project:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Project</h2>
          <p className="text-muted-foreground">{error || 'Project not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <StudioHeader project={project} onProjectUpdate={setProject} />
      
      <div className="flex-1 flex overflow-hidden gap-px bg-border">
        <ChatPanel projectId={projectId} />
        <PreviewPanel code={project.generatedCode} />
      </div>
    </div>
  )
}
