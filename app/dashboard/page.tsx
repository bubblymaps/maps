// /app/dashboard/page.tsx
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {ThemeToggle} from "@/components/themeToggle"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/signin")
  }

  const user = session.user

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="text-center">
        <ThemeToggle />
        <h1 className="text-3xl font-semibold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">{user?.email}</p>
        {user?.image && (
          <img
            src={user.image}
            alt="Profile"
            className="w-24 h-24 rounded-full mt-4"
          />
        )}
      </div>

      <Link href="/api/auth/signout">
        <Button variant="destructive">Sign out</Button>
      </Link>
    </div>
  )
}
