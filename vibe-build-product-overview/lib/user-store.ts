// In-memory user store for development when DATABASE_URL is not available
export interface StoredUser {
  id: string
  name: string
  email: string
  passwordHash: string
}

class UserStore {
  private users: Map<string, StoredUser> = new Map()

  findByEmail(email: string): StoredUser | undefined {
    return this.users.get(email.toLowerCase())
  }

  findById(id: string): StoredUser | undefined {
    for (const user of this.users.values()) {
      if (user.id === id) {
        return user
      }
    }
    return undefined
  }

  create(user: StoredUser): void {
    this.users.set(user.email.toLowerCase(), user)
  }

  emailExists(email: string): boolean {
    return this.users.has(email.toLowerCase())
  }

  clear(): void {
    this.users.clear()
  }
}

export const userStore = new UserStore()
