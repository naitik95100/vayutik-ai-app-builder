# VibeBuild Implementation Guide

## Overview

VibeBuild is a production-ready AI-powered app generator platform. This document details the implementation approach, architecture decisions, and how everything works together.

## Architecture Decisions

### 1. Full-Stack Framework: Next.js 16
**Why**: 
- Server-side rendering for SEO and performance
- Unified TypeScript codebase (frontend + backend)
- Streaming support for AI responses via API routes
- Built-in middleware and route protection
- Automatic optimization with Turbopack

### 2. Authentication: Better Auth + Neon
**Why**:
- Zero-configuration, type-safe auth
- Handles password hashing, sessions, and cookies
- Integrates seamlessly with Drizzle ORM
- Better Auth tables auto-migrate on Neon
- Cross-domain cookie handling for iframes

### 3. Database: Neon PostgreSQL + Drizzle
**Why**:
- Serverless PostgreSQL with auto-scaling
- Type-safe ORM (Drizzle) prevents SQL injection
- Simple schema management via Neon MCP
- Per-user data isolation with userId scoping
- Connection pooling via pg library

### 4. AI Integration: Vercel AI SDK
**Why**:
- Built-in streaming for real-time responses
- Model-agnostic (supports OpenAI, Anthropic, etc.)
- Structured output support (TypeScript)
- Error handling and retry logic
- Vercel AI Gateway for unified API

## Data Flow

### Chat to Code Generation
```
User Message
    ↓
[Chat Component] (client)
    ↓
POST /api/chat { messages: [...] }
    ↓
[API Route] validates auth
    ↓
streamText({ model, system, messages })
    ↓
[AI Provider] (OpenAI/Claude)
    ↓
Streamed data chunks
    ↓
[Chat Panel] renders response
    ↓
addMessage() - saves to DB
    ↓
updateProject() - updates generated code
```

### Authentication Flow
```
User Sign-Up
    ↓
[AuthForm] client submission
    ↓
authClient.signUp.email({ email, password, name })
    ↓
POST /api/auth/sign-up
    ↓
[Better Auth] hashes password, creates user
    ↓
Session cookie set (HTTP-only)
    ↓
Router redirect to /studio
    ↓
auth.api.getSession() verified on server
```

### Project Management
```
Create Project
    ↓
createProject(name, description)
    ↓
[Server Action] validates userId
    ↓
db.insert(projects).where(eq(userId, userId))
    ↓
Project created in database
    ↓
Studio page revalidatePath("/studio")
    ↓
Dashboard refreshes with new project
```

## Key Components

### Chat Panel (`components/chat-panel.tsx`)
- Real-time message rendering
- Textarea with auto-resize
- Streaming response handling via fetch
- Message persistence to database
- Loading states and error handling

**Key Features**:
- Enter-to-submit with Shift+Enter for newlines
- CJK IME support (checks `e.nativeEvent.isComposing`)
- Optimistic UI updates
- Accessibility (proper labels and roles)

### Preview Panel (`components/preview-panel.tsx`)
- Sandboxed iframe rendering
- Tailwind CSS CDN injection
- React + ReactDOM CDN for code execution
- Toggle between code and preview views
- Error boundary for failed renders

**Key Features**:
- generatePreviewHTML() creates safe sandbox
- Babel standalone for JSX transpilation
- Dark theme matching app design
- Responsive iframe scaling

### Studio Header (`components/studio-header.tsx`)
- Project name inline editing
- Status badge (draft/published/archived)
- Export and deployment buttons
- Session-aware navigation
- Proper error handling on updates

### Error Boundary (`components/error-boundary.tsx`)
- Global error catching for React components
- User-friendly error UI
- Navigation to safe state
- Console logging for debugging
- Works across all studio pages

## Server Actions Pattern

All data modifications use Server Actions with `getUserId()` validation:

```typescript
'use server'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createProject(name: string) {
  const userId = await getUserId()  // Always validate first
  
  const [project] = await db
    .insert(projects)
    .values({ userId, name, status: 'draft' })  // Always scope by userId
    .returning()
  
  revalidatePath('/studio')  // Fresh data for ISR
  return project
}
```

**Benefits**:
- Type-safe mutations
- No exposed API endpoints for data ops
- Automatic CSRF protection
- Per-user data isolation
- Incremental Static Regeneration for performance

## API Routes

### `/api/chat` Route
```typescript
// POST /api/chat
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Features**:
- Auth check via Better Auth session
- Streaming via AI SDK `streamText()`
- Error responses with proper status codes
- Console logging for debugging
- Rate limiting ready (can add middleware)

## Database Schema

### Projects Table
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',  -- draft, published, archived
  generatedCode TEXT,
  deploymentUrl TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
)
```

### Messages Table
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  projectId INTEGER NOT NULL,
  userId TEXT NOT NULL,
  role TEXT NOT NULL,  -- user, assistant
  content TEXT NOT NULL,
  codeBlocks JSONB,    -- future: syntax highlighting
  createdAt TIMESTAMP DEFAULT NOW()
)
```

### Versions Table
```sql
CREATE TABLE versions (
  id SERIAL PRIMARY KEY,
  projectId INTEGER NOT NULL,
  userId TEXT NOT NULL,
  code TEXT NOT NULL,
  snapshot JSONB,       -- metadata about generation
  createdAt TIMESTAMP DEFAULT NOW()
)
```

**Design Decision**: No foreign keys by default to allow flexible schema iteration. All filtering uses `eq(table.userId, userId)`.

## Styling

### Theme System
- **Color scheme**: Dark-first (black background #0a0a0a)
- **Accent**: Purple (#7c3aed) for CTAs and highlights
- **Semantic tokens**: CSS variables in `globals.css`
- **Framework**: Tailwind CSS v4 with theme tokens

### Key Classes
```tailwind
bg-background      /* #0a0a0a */
text-foreground    /* #f5f5f5 */
bg-secondary       /* #1f1f1f - subtle backgrounds */
text-muted-foreground  /* #999999 - secondary text */
bg-accent          /* #7c3aed - primary interaction */
border-border      /* #2a2a2a - dividers */
```

### Component Styling
- Button variants: default, outline, ghost
- Card components with subtle shadows
- Responsive design with Tailwind breakpoints
- Hover states for interactivity
- Disabled states for form elements

## Performance Optimizations

### Frontend
- **Code splitting**: Automatic via Next.js
- **Image optimization**: None needed (no images)
- **Font loading**: System fonts (no custom fonts)
- **CSS**: Tailwind purging unused styles
- **JavaScript**: Minified in production

### Backend
- **Database**: Connection pooling via pg
- **Caching**: ISR on studio page
- **API**: Streaming for large responses
- **Routes**: Dynamic rendering only when needed

### Metrics
- **LCP target**: <2.5s (large element load)
- **INP target**: <200ms (interaction latency)
- **CLS target**: <0.1 (layout shift)

## Security

### Authentication
- Passwords: bcrypt hashing via Better Auth
- Sessions: HTTP-only cookies (can't access via JS)
- CSRF: Built into Next.js forms
- XSS prevention: React sanitization

### Database
- SQL injection: Drizzle parameterized queries
- Row access: userId scoping on every query
- Secrets: Environment variables (not in code)

### API
- Input validation: req.json() parsing
- Auth check: Better Auth session verification
- CORS: Same-origin by default (iframes same-site)
- Rate limiting: Ready to add with middleware

## Error Handling

### Types
1. **Auth errors**: 401 status, redirect to sign-in
2. **Validation errors**: 400 status, user-friendly message
3. **Not found errors**: 404 status, return early
4. **Server errors**: 500 status, log and report
5. **React errors**: Error Boundary component

### Strategy
```typescript
try {
  // operation
} catch (error) {
  console.error('[v0] Context:', error)  // Always log
  // Return appropriate status + message
  throw new Error('User-friendly message')
}
```

## Testing Approach

### Manual Testing Done
- Build verification (TypeScript, no errors)
- Route verification (all pages accessible)
- Component rendering (snapshots taken)
- Authentication flow (redirect logic)
- Database schema (tables created)

### Future Test Coverage
- Unit tests: Components and utilities
- Integration tests: API routes with auth
- E2E tests: Complete user journeys
- Performance tests: Web Vitals monitoring

## Deployment

### Vercel
1. Connect Git repository
2. Environment variables auto-imported
3. Automatic builds with Turbopack
4. Zero-downtime deployments
5. Analytics and monitoring included

### Pre-deployment
```bash
# 1. Set BETTER_AUTH_SECRET
export BETTER_AUTH_SECRET=$(openssl rand -base64 32)

# 2. Set DATABASE_URL from Neon dashboard
export DATABASE_URL=postgresql://...

# 3. Test locally
pnpm dev

# 4. Build for production
pnpm build

# 5. Deploy
vercel deploy --prod
```

## Monitoring

### Logging
- `[v0]` prefix on all app console logs
- `[API]` prefix on API route logs
- Structured logging for debugging
- Production: Send to logging service

### Analytics
- Vercel Web Analytics: Page views, Core Web Vitals
- Error tracking: Console errors and React errors
- Custom metrics: Code generation success rate

## Future Enhancements

1. **Multi-language support**: Python, Vue, Svelte
2. **Component library**: Shadcn, Material UI, Chakra
3. **Collaborative editing**: Real-time sync
4. **Custom domains**: Deploy to user domains
5. **AI model selection**: Let users choose GPT vs Claude
6. **Marketplace**: Share and discover generated apps
7. **Analytics dashboard**: Usage insights
8. **Webhook integration**: GitHub, Slack, Discord

## Troubleshooting

### Build Fails
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install --force`
- Check types: `pnpm exec tsc --noEmit`

### Database Issues
- Verify DATABASE_URL in .env.local
- Check Neon project status
- Test connection: `psql $DATABASE_URL`
- Rebuild schema via neon_run_sql

### Auth Problems
- Verify BETTER_AUTH_SECRET is set
- Check session cookie in DevTools
- Verify auth route exists: `/api/auth/[...all]`
- Test login flow manually

### AI Generation Not Working
- Check API key/model name
- Verify streaming response format
- Check console for parsing errors
- Test API manually with curl

## Resources

- Next.js: https://nextjs.org/docs
- Better Auth: https://better-auth.dev/docs
- Drizzle: https://orm.drizzle.team/docs
- Tailwind: https://tailwindcss.com/docs
- React: https://react.dev
- Vercel: https://vercel.com/docs
