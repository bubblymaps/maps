"use client"

import { useSession } from "next-auth/react"
import Loading from "@/components/Loading"
import NoAccess from "@/components/403"
import { Header } from "@/components/Admin/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AdminStats } from "@/types/types"
import { useEffect, useState } from "react"
import { Users, MapPin, MessageSquare, Clock, CheckCircle2 } from "lucide-react"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!session || !session.user.moderator) return

    async function fetchStats() {
      try {
        const res = await fetch("/admin/stats")
        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoadingStats(false)
      }
    }

    fetchStats()
  }, [session])

  if (status === "loading" || loadingStats) return <Loading />
  if (status === "unauthenticated") return <NoAccess />
  if (!session) return null

  const isMod = session.user.moderator
  const modName = session.user.displayName

  if (!isMod) {
    return <NoAccess />
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.users || 0,
      description: "Registered users",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Bubblers",
      value: stats?.bubblers || 0,
      description: "Active locations",
      icon: MapPin,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Reviews",
      value: stats?.reviews || 0,
      description: "Total reviews submitted",
      icon: MessageSquare,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Awaiting Approval",
      value: stats?.awaitingApproval || 0,
      description: "Pending moderation",
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Verified",
      value: stats?.verified || 0,
      description: "Approved locations",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Header />
        </div>
      </div>

      <div className="container mx-auto px-50 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {modName}</h2>
          <p className="text-muted-foreground mt-2">Here's what's happening with your platform today.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4">
                  <CardTitle className="text-xs font-medium">{stat.title}</CardTitle>
                  <div className={`rounded-md p-1.5 ${stat.bgColor}`}>
                    <Icon className={`size-3.5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}

          
        </div>
      </div>
    </div>
  )
}
