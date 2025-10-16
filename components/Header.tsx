"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react";
import { AvatarManager } from "@/components/Avatar"

export function Header() {
    const { data: session } = useSession();
    const isSignedIn = !!session;
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link href="/home" className="flex items-center gap-2">
                        <span className="text-lg font-semibold">Bubbly Maps</span>
                    </Link>
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link href="/developers" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            Docs
                        </Link>
                        <Link href="/platform" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            Platform
                        </Link>
                        <Link href="/enterprise" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            Enterprise
                        </Link>
                        <Link href="/support" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            Support
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    {isSignedIn ? (
                        <>
                        <Button size="sm" variant="outline" className="cursor-pointer">
                            <Link href="/">Launch App</Link>
                        </Button>
                        <AvatarManager />
                        </>
                    ) : (
                        <Button size="sm" className="cursor-pointer">
                            <Link href="/">Get Started</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
