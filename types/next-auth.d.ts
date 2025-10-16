import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      handle?: string | null;
      displayName?: string | null;
      bio?: string | null;
      moderator?: boolean;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    handle?: string | null;
    displayName?: string | null;
    bio?: string | null;
    moderator?: bool;
  }
}