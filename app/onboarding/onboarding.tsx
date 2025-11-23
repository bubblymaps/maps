"use client"

import { useState, useRef, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Droplet } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import Loading from "@/components/loading"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Onboarding() {
    const { data: session, status, update } = useSession()
    const [displayName, setDisplayName] = useState("")
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")
    const [avatarUrl, setAvatarUrl] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [usernameError, setUsernameError] = useState("")
    const router = useRouter()

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/signin")
        } else if (status === "authenticated" && session?.user?.handle) {
            // User already has a username, redirect to home
            router.push("/home")
        }
    }, [status, session, router])

    useEffect(() => {
        if (session?.user) {
            setDisplayName(session.user.displayName ?? session.user.name ?? "")
            setAvatarUrl(session.user.image ?? "")
        }
    }, [session])

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setSelectedFile(file)

        const reader = new FileReader()
        reader.onload = () => setAvatarUrl(reader.result as string)
        reader.readAsDataURL(file)
    }

    const validateUsername = (value: string) => {
        if (!value) {
            setUsernameError("Username is required")
            return false
        }
        if (value.length < 3) {
            setUsernameError("Username must be at least 3 characters")
            return false
        }
        if (value.length > 20) {
            setUsernameError("Username must be 20 characters or less")
            return false
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            setUsernameError("Username can only contain letters, numbers, and underscores")
            return false
        }
        setUsernameError("")
        return true
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setUsername(value)
        validateUsername(value)
    }

    const handleComplete = async () => {
        if (!validateUsername(username)) {
            toast.error("Please fix the errors before continuing")
            return
        }

        if (!displayName) {
            toast.error("Display name is required")
            return
        }

        setIsSubmitting(true)

        try {
            let uploadedImageUrl = avatarUrl

            if (selectedFile) {
                const formData = new FormData()
                formData.append("file", selectedFile)

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                })
                const uploadData = await uploadRes.json()
                if (!uploadRes.ok) throw new Error("Upload failed")
                uploadedImageUrl = uploadData.url
            }

            const res = await fetch("/api/user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    displayName,
                    handle: username,
                    bio: bio || undefined,
                    image: uploadedImageUrl || undefined,
                }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.msg || errorData.message || errorData.error || "Failed to update profile")
            }

            await update()
            toast.success("Welcome to Bubbly Maps!", { description: "Your profile has been set up successfully" })
            router.push("/home")
        } catch (err) {
            console.error(err)
            const errorMessage = err instanceof Error ? err.message : "An error occurred"
            toast.error("Uh-oh!", { description: errorMessage })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (status === "loading") return <Loading />

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="space-y-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-center space-y-4"
                    >
                        <div className="flex justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                                className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                            >
                                <Droplet className="h-8 w-8 fill-current" />
                            </motion.div>
                        </div>
                        <h1 className="text-4xl font-bold">Welcome to Bubbly Maps!</h1>
                        <p className="text-lg text-muted-foreground">
                            Let&apos;s set up your profile to get started
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6"
                    >
                        {/* Avatar */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={avatarUrl} alt={displayName} />
                                <AvatarFallback className="text-2xl">
                                    {displayName?.trim()
                                        ? displayName
                                            .split(" ")
                                            .filter(Boolean)
                                            .map((word) => word[0].toUpperCase())
                                            .slice(0, 2)
                                            .join("")
                                        : "U"}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 bg-transparent cursor-pointer"
                                onClick={handleUploadClick}
                                type="button"
                            >
                                <Upload className="h-4 w-4" />
                                Upload Avatar
                            </Button>
                        </motion.div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="grid gap-4 sm:grid-cols-2"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">
                                        Display Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="displayName"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">
                                        Username <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="space-y-1">
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                                            <Input
                                                id="username"
                                                value={username}
                                                onChange={handleUsernameChange}
                                                placeholder="username"
                                                className={`pl-9 ${usernameError ? "border-destructive" : ""}`}
                                                required
                                            />
                                        </div>
                                        {usernameError && (
                                            <p className="text-sm text-destructive">{usernameError}</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="bio">Bio (Optional)</Label>
                                <Textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us about yourself"
                                    rows={4}
                                />
                            </motion.div>
                        </div>

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            <Button
                                onClick={handleComplete}
                                disabled={isSubmitting || !!usernameError || !username || !displayName}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer h-12 text-base"
                            >
                                {isSubmitting ? "Setting up..." : "Complete Setup"}
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
