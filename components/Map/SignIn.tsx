"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SignInButton() {
  return (
    <Button
      onClick={() => signIn()}
      className={cn(
        "cursor-pointer rounded-full border border-input shadow-md transition",
        "bg-white text-black",
        "dark:bg-zinc-900/80 dark:backdrop-blur-sm dark:text-white",
        "hover:bg-gray-100 dark:hover:bg-zinc-800"
      )}
    >
      Sign In
    </Button>
  )
}
