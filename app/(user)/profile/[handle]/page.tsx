import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ZapIcon } from "lucide-react"

import UserContributions from "@/components/Profile/userContributions"
import UserReviews from "@/components/Profile/userReviews"
import NotFound from "@/components/404"

import Header from "@/components/header"

import { Verified } from "@/components/Badges/verified"
import { Admin } from "@/components/Badges/admin"

import { Users } from "@/lib/modules/users"

import Link from "next/link"

interface ProfilePageParams {
  params: Promise<{ handle: string }>
}

export const metadata = {
  title: "Profile | Bubbly Maps",
  description: "View the profile and contributions of a Bubbly Maps user.",
  openGraph: {
    title: "Profile | Bubbly Maps",
    description: "View the profile and contributions of a Bubbly Maps user.",
    url: "https://bubblymaps.org/profile",
    siteName: "Bubbly Maps",
    type: "website",
  },
};

export default async function ProfilePage({ params }: ProfilePageParams) {
  const { handle } = await params
  const user = await Users.getUserByUsername(handle)

  if (!user) {
    return (
      <NotFound />
    )
  }

  const isMVP = user!.xp >= 1000

  return (
    <div className="min-h-screen ">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <Header />
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
          <div className="px-6 pb-6 -mt-16">
            <Avatar className="w-28 h-28 shadow-lg mb-4">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-2xl font-semibold">
                {user.displayName?.trim()
                  ? user.displayName
                    .split(" ")
                    .filter(Boolean)
                    .map((word: string) => word[0].toUpperCase())
                    .slice(0, 2)
                    .join("")
                  : "U"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl font-bold text-balance">{user.displayName || user.handle}</h1>

                {user.moderator && (
                  <Admin />
                )}
                {user.verified && (
                  <Verified
                    content={
                      <p className="text-zinc-700 dark:text-zinc-300">
                        Official account of a government, organization, or recognized entity.{" "}
                        <Link
                          href="/help/verified"
                          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2"
                        >
                          Learn more.
                        </Link>
                      </p>
                    }
                  />
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-muted-foreground">@{user.handle}</p>
                <Badge variant="secondary" className="font-mono text-xs">
                  id: {user.id}
                </Badge>
              </div>
            </div>

            {user.bio && (
              <div className="p-4 rounded-lg bg-card border shadow-sm mb-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Bio</h2>
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {user.bio
                    ?.split(/(https?:\/\/[^\s]+)/g)
                    .map((part: string, i: number) =>
                      /^https?:\/\//.test(part) ? (
                        <Link key={i} href={part} className="text-blue-500 underline">
                          {part}
                        </Link>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}

                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div
                className={`flex items-center gap-3 p-3 rounded-lg relative overflow-hidden ${isMVP ? "bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 shadow-lg shadow-orange-500/50" : "bg-muted/50"
                  }`}
              >
                {isMVP && (
                  <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 via-orange-500/20 to-yellow-400/10" />
                )}

                <div
                  className={`p-2 rounded-full relative z-10 ${isMVP ? "bg-yellow-400/30 backdrop-blur-sm" : "bg-yellow-500/10"
                    }`}
                >
                  <ZapIcon
                    className={`h-5 w-5 ${isMVP
                      ? "text-yellow-100 fill-yellow-100 drop-shadow-[0_0_8px_rgba(255,255,100,0.8)]"
                      : "text-yellow-600 dark:text-yellow-500 fill-yellow-600 dark:fill-yellow-500"
                      }`}
                  />
                </div>

                <div className="relative z-10">
                  <p className={`text-2xl font-bold ${isMVP ? "text-white drop-shadow-md" : ""}`}>
                    {user.xp.toLocaleString()}
                  </p>
                  <p className={`text-sm ${isMVP ? "text-orange-50 font-semibold" : "text-muted-foreground"}`}>
                    XP
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-primary/10">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {user.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </p>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <UserContributions userId={user.id} />
        <UserReviews userId={user.id} />
      </div>
    </div>
  )
}