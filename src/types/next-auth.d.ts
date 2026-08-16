import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      name?: string | null
      email?: string | null
      image?: string | null
      phone?: string | null
      college?: string | null
      course?: string | null
      branch?: string | null
      year?: string | null
    }
  }

  interface User {
    role: string
    phone?: string | null
    college?: string | null
    course?: string | null
    branch?: string | null
    year?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}