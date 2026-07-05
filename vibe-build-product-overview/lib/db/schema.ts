import { pgTable, text, timestamp, boolean, serial, jsonb } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  password: text('password').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// Example:
//
// import { serial } from "drizzle-orm/pg-core"
//
// export const todos = pgTable("todos", {
//   id: serial("id").primaryKey(),
//   userId: text("userId").notNull(),
//   title: text("title").notNull(),
//   completed: boolean("completed").notNull().default(false),
//   createdAt: timestamp("createdAt").notNull().defaultNow(),
// })
//
// If the user asks for foreign keys, add the reference back in:
//   userId: text("userId")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').default('draft'), // 'draft', 'published', 'archived'
  generatedCode: text('generatedCode'),
  deploymentUrl: text('deploymentUrl'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  projectId: serial('projectId').notNull(),
  userId: text('userId').notNull(),
  role: text('role').notNull(), // 'user', 'assistant'
  content: text('content').notNull(),
  codeBlocks: jsonb('codeBlocks'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const versions = pgTable('versions', {
  id: serial('id').primaryKey(),
  projectId: serial('projectId').notNull(),
  userId: text('userId').notNull(),
  code: text('code').notNull(),
  snapshot: jsonb('snapshot'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
