"use client"

import Link from "next/link"
import { AvatarManager } from "@/components/Avatar"

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link href="/admin" className="flex items-center gap-2">
                        <span className="text-lg font-semibold">Admin Console</span>
                    </Link>
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link href="/developers" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            Management
                        </Link>
                        <Link href="/platform" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            Admins
                        </Link>
                        <Link href="/enterprise" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            Waypoints
                        </Link>
                        <Link href="/support" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            Reviews
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <AvatarManager />
                </div>
            </div>
        </header>
    )
}
