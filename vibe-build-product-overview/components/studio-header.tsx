'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Download, Upload, Settings } from 'lucide-react'
import { updateProject } from '@/app/actions/projects'

interface Project {
  id: number
  name: string
  description: string | null
  status: string
  deploymentUrl: string | null
}

interface StudioHeaderProps {
  project: Project
  onProjectUpdate: (project: Project) => void
}

export function StudioHeader({ project, onProjectUpdate }: StudioHeaderProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(project.name)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)
      const updated = await updateProject(project.id, { name })
      onProjectUpdate(updated)
      setEditing(false)
    } catch (error) {
      console.error('[v0] Error updating project:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/studio" className="flex items-center gap-2 text-foreground hover:text-accent transition">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-lg font-bold">VibeBuild</span>
            </Link>

            <div className="flex items-center gap-3">
              {editing ? (
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  onBlur={handleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave()
                    if (e.key === 'Escape') setEditing(false)
                  }}
                />
              ) : (
                <h1
                  onClick={() => setEditing(true)}
                  className="text-xl font-bold cursor-pointer hover:text-accent transition"
                >
                  {name}
                </h1>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
                {project.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {project.deploymentUrl && (
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href={project.deploymentUrl} target="_blank" rel="noopener noreferrer">
                  <Upload className="w-4 h-4 mr-2" />
                  View Live
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              asChild
            >
              <Link href="/settings">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
