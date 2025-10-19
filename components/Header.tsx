"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react";
import { AvatarManager } from "@/components/Avatar"
import ThemeToggle from "@/components/ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export function Header() {
    const { data: session } = useSession();
    const isSignedIn = !!session;
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-lg font-semibold">Bubbly Maps</span>
                    </Link>
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link href="https://docs.bubblymaps.org/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            Docs
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
                                Platform
                                <ChevronDown className="h-3 w-3" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem asChild>
                                    <Link href="https://bubblymaps.org/privacy">Privacy Policy</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="https://bubblymaps.org/terms">Terms</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link href="https://bubblymaps.org/enterprise" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            Enterprise
                        </Link>
                        <Link href="https://bubblymaps.org/support" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            Support
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    {isSignedIn ? (
                        <>
                            <Button size="sm" variant="outline" className="cursor-pointer">
                                <Link href="/">Maps</Link>
                            </Button>
                            <AvatarManager />
                        </>
                    ) : (
                        <>
                            <Button size="sm" variant="outline" className="cursor-pointer">
                                <Link href="/">Maps</Link>
                            </Button>
                            <ThemeToggle />
                        </>
                    )}

                </div>
            </div>
        </header>
    )
}
