'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { X, Sparkles } from 'lucide-react'
import { createProject } from '@/app/actions/projects'

interface CreateProjectDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateProjectDialog({ isOpen, onClose }: CreateProjectDialogProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Project name is required')
      return
    }

    try {
      setLoading(true)
      const project = await createProject({
        name: name.trim(),
        description: description.trim() || undefined,
      })
      setName('')
      setDescription('')
      onClose()
      router.push(`/studio/${project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-background border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Create New Project</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded text-muted-foreground"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="name" className="text-foreground font-medium">
              Project Name
            </Label>
            <Input
              id="name"
              placeholder="My Awesome App"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 bg-secondary border-border placeholder:text-muted-foreground"
              disabled={loading}
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-1">Give your project a meaningful name</p>
          </div>

          <div>
            <Label htmlFor="description" className="text-foreground font-medium">
              Description (Optional)
            </Label>
            <Input
              id="description"
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 bg-secondary border-border placeholder:text-muted-foreground"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">Help you remember the purpose of this project</p>
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-border text-foreground hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !name.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
