import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Code, Zap, GitBranch } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold">VibeBuild</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#how" className="hover:text-foreground transition">How It Works</a>
            <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border/50 bg-secondary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Code Generation</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Build Apps in <span className="text-primary">Natural Language</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into production-ready React and Next.js applications. VibeBuild generates clean, type-safe code with real-time preview.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                Start Building <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-secondary">
              Watch Demo
            </Button>
          </div>

          <div className="pt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Production Ready</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">10x</div>
              <div className="text-sm text-muted-foreground">Faster Development</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Configuration Needed</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground">Everything you need to build amazing apps</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition">
            <Code className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">Smart Code Generation</h3>
            <p className="text-muted-foreground">
              Generates clean, production-ready React and Next.js code with TypeScript, Tailwind CSS, and proper error handling.
            </p>
          </div>

          <div className="p-8 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition">
            <Zap className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">Real-Time Preview</h3>
            <p className="text-muted-foreground">
              See your changes instantly with a live preview panel. Iterate on your design in real-time as you describe it.
            </p>
          </div>

          <div className="p-8 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition">
            <GitBranch className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">Version History</h3>
            <p className="text-muted-foreground">
              Keep track of all code generations with full version history. Roll back to any previous version anytime.
            </p>
          </div>

          <div className="p-8 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition">
            <Sparkles className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">One-Click Deploy</h3>
            <p className="text-muted-foreground">
              Deploy your generated apps directly to Vercel with a single click. No configuration or DevOps knowledge needed.
            </p>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="font-bold">VibeBuild</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 VibeBuild. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
