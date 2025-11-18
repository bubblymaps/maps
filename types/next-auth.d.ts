import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      email?: string | null
      image?: string | null
      displayName?: string | null
      handle?: string | null
      id: string
      bio: string | null
      moderator: boolean
      name: string | null
    }
  }

  interface User {
    displayName?: string | null
    handle?: string | null
    bio: string | null
    id: string
    email?: string | null
    image?: string | null
    moderator: boolean

    name: string | null
  }
}
