"use client"

import type React from "react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Logo } from "@/components/Logo"
import Loading from "@/components/Loading"

import {
    Alert,
    AlertDescription
} from "@/components/ui/alert"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"

import { signIn, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useState } from "react"

import ThemeToggle from "@/components/ThemeToggle"
import { useRouter } from "next/navigation"

export function Login({ className, ...props }: React.ComponentProps<"div">) {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/");
        }
    }, [session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const result = await signIn("email", {
            email,
            redirect: false,
            callbackUrl: "/",
        })

        setIsSubmitting(false)

        if (result?.error) {
            setError("Please ask an administrator for help to access.")
        } else if (result?.ok) {
            alert("Check your email for the magic link!")
        }
    }

    if (status === "loading" || isSubmitting) {
        return( <Loading/> )
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <a href="/" className="flex flex-col items-center gap-2 font-medium">
                            <Logo />
                        </a>

                        <h1 className="text-xl font-bold">Login to Bubbly Maps</h1>

                        <div className="text-center text-sm">
                            Don&apos;t have an account
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="inline-block ml-1 h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Continue with one of the authentication methods below and we will automatically create your account upon signing in.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="hello@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>Uh oh, an error occured! Please try again later.</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-background text-muted-foreground relative z-10 px-2">Or</span>
                    </div>

                    <div className="grid gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full flex items-center justify-center gap-2 cursor-pointer bg-transparent"
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                        >
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 533.5 544.3"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill="#4285F4"
                                    d="M533.5 278.4c0-17.7-1.5-35-4.3-51.8H272v98h146.9c-6.3 33.5-25 61.8-53.2 80.8v66h85.9c50.2-46.2 79.9-114.3 79.9-193z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M272 544.3c71.5 0 131.5-23.7 175.3-64.4l-85.9-66c-23.9 16-54.7 25.4-89.4 25.4-68.9 0-127.2-46.5-148.2-108.8h-87.4v68.6C73.7 478.6 166.2 544.3 272 544.3z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M123.4 335.1c-6.3-18.9-9.9-39.2-9.9-60.1s3.6-41.2 9.9-60.1v-68.6h-87.4c-18.9 37.5-29.8 79.7-29.8 128.7s10.9 91.2 29.8 128.7l87.4-68.6z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M272 107.3c37.6 0 71.1 12.9 97.5 34.3l73.2-73.2C403.5 24.2 343.5 0 272 0 166.2 0 73.7 65.7 34.9 163.3l87.4 68.6C144.8 153.8 203.1 107.3 272 107.3z"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </div>
                </div>
            </form>

            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By signing in, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
            </div>
        </div>
    )
}