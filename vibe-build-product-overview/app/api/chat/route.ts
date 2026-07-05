import { streamText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth-utils'

const systemPrompt = `You are VibeBuild, an expert AI assistant that generates production-ready React and Next.js applications.

Your responsibilities:
1. Generate clean, type-safe React/Next.js code with Tailwind CSS styling
2. Ask clarifying questions about the user's requirements
3. Provide complete, runnable code components
4. Explain architectural decisions and best practices
5. Suggest improvements and optimizations

When generating code:
- Use Next.js 16 with App Router
- Use React 19 with proper hooks
- Include TypeScript with strict mode
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states and animations
- Ensure accessibility (WCAG AA)
- Make responsive designs mobile-first
- Use semantic HTML elements

Code format: When generating code, wrap it in \`\`\`tsx or \`\`\`typescript blocks with clear section comments.

Always ask for clarification on:
- Specific design preferences
- Target audience
- Performance requirements
- Data persistence needs
- Authentication requirements

Be concise but thorough. Focus on delivering working, maintainable code.`

export async function POST(req: NextRequest) {
  try {
    const session = await verifySession()
    if (!session) {
      console.warn('[API] Chat: Unauthorized request')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      console.warn('[API] Chat: Invalid messages format')
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    console.log('[API] Chat: Processing', messages.length, 'messages for user', session.userId)

    const result = await streamText({
      model: 'gpt-4-turbo',
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 4096,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('[API] Chat error:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
