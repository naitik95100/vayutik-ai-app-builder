'use client'

import { useState } from 'react'
import { Code, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PreviewPanelProps {
  code: string | null
}

export function PreviewPanel({ code }: PreviewPanelProps) {
  const [view, setView] = useState<'preview' | 'code'>('preview')

  return (
    <div className="w-full md:w-1/2 flex flex-col bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h3 className="font-bold">Preview</h3>
        <div className="flex gap-2">
          <Button
            variant={view === 'preview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('preview')}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button
            variant={view === 'code' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('code')}
            className="gap-2"
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">Code</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {!code ? (
          <div className="h-full flex items-center justify-center bg-secondary/30">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Eye className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold">No Preview Yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Start chatting to generate your first component
              </p>
            </div>
          </div>
        ) : view === 'preview' ? (
          <iframe
            srcDoc={generatePreviewHTML(code)}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <pre className="h-full overflow-auto p-4 bg-secondary text-foreground text-sm font-mono">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  )
}

function generatePreviewHTML(code: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script crossorigin src="https://unpkg.com/react@19/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@19/umd/react-dom.production.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #0a0a0a;
            color: #f5f5f5;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          try {
            ${code}
            const rootElement = document.getElementById('root');
            if (rootElement && typeof App !== 'undefined') {
              const root = ReactDOM.createRoot(rootElement);
              root.render(<App />);
            }
          } catch (error) {
            console.error('Error rendering preview:', error);
            document.getElementById('root').innerHTML = '<div style="padding: 20px; color: #ff6b6b;"><strong>Error rendering preview:</strong><br/>' + error.message + '</div>';
          }
        </script>
      </body>
    </html>
  `
}
