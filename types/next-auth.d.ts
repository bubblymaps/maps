import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      email?: string | null
      image?: string | null
      displayName?: string | null
      handle?: string | null
      id: string
    }
  }

  interface User {
    displayName?: string | null
    handle?: string | null
  }
}
