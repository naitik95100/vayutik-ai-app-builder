'use client'

import React, { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[v0] Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md text-center space-y-6">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="text-muted-foreground">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.href = '/studio'
              }}
              className="w-full bg-accent hover:bg-accent/90"
            >
              Return to Studio
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
