"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Droplet, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/themeToggle"
import { AvatarManager } from "@/components/account"
import { useSession } from "next-auth/react"

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const items: Array<{ href: string; label: string; auth?: boolean }> = [
    { href: "https://bubblymaps.org", label: "Home" },
    { href: "https://docs.bubblymaps.org", label: "Docs" },
    { href: "https://app.bubblymaps.org", label: "Maps" },
    { href: "/settings", label: "Settings", auth: true },
  ]

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={cn("flex items-center gap-1", mobile && "flex-col items-stretch gap-2")}> 
      {items
        .filter((i) => !i.auth || !!session)
        .map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
          const classes = mobile
            ? cn(
                "w-full text-left px-3 py-2 rounded-md",
                active
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "hover:bg-muted"
              )
            : cn(
                "px-3 py-2 rounded-full text-sm font-medium transition",
                active
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
              )
          return (
            <Link key={item.href} href={item.href} className={classes}>
              {item.label}
            </Link>
          )
        })}
    </nav>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Left: Brand + Mobile menu */}
          <div className="flex items-center gap-2">
            <div className="flex lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                  <SheetTitle className="flex items-center gap-2 mb-4">
                    <Droplet className="h-5 w-5 text-primary" />
                    <span className="font-bold">bubblymaps</span>
                  </SheetTitle>
                  <NavLinks mobile />
                </SheetContent>
              </Sheet>
            </div>

            <Link href="/" className="flex items-center gap-2">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Droplet className="h-5 w-5" />
              </div>
              <span className="hidden sm:inline text-base font-bold tracking-tight">bubblymaps</span>
            </Link>
          </div>

          {/* Center: Nav (desktop) */}
          <div className="hidden lg:flex">
            <NavLinks />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session ? (
              <AvatarManager />
            ) : (
              <Button asChild className="rounded-full h-10 px-4">
                <Link href="/signin">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
