'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, ArrowRight, Sparkles } from 'lucide-react'
import { CreateProjectDialog } from '@/components/create-project-dialog'
import { getProjects } from '@/app/actions/projects'

interface Project {
  id: number
  name: string
  description: string | null
  status: string
  createdAt: Date
}

export default function StudioPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error('[v0] Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold">VibeBuild</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
              Home
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings">Settings</Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Projects</h1>
            <p className="text-muted-foreground">Create and manage your AI-generated applications</p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            size="lg"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first project to start generating production-ready applications with AI.
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Plus className="w-4 h-4" />
              Create First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.id} href={`/studio/${project.id}`}>
                <div className="h-full p-6 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 hover:border-accent/50 transition group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-accent transition">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {project.description || 'No description'}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <CreateProjectDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
    </main>
  )
}
