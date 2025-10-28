"use client"

import { useState, useRef, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import Loading from "@/components/loading"
import { useRouter } from "next/navigation"

export default function Page() {
    const { data: session, status, update } = useSession()
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")
    const [avatarUrl, setAvatarUrl] = useState(session?.user.image ?? "")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const router = useRouter();
    const isSignedIn = !!session;

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/signin");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user) {
            setName(session.user.displayName ?? "")
            setUsername(session.user.handle ?? "")
            setBio(session.user.bio ?? "")
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

    const handleSave = async () => {
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
                    displayName: name,
                    handle: username,
                    bio,
                    image: uploadedImageUrl,
                }),
            })

            if (!res.ok) throw new Error("Failed to fetch api")

            await update()
            toast.info("Success!", { description: "Your account settings have been updated" })
        } catch (err) {
            console.error(err)
            toast.error("Uh-oh!", { description: `Your account settings failed to be updated: ${err}` })
        }
    }

    if (status === "loading") return <Loading />;

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
                <section className="space-y-6">
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <h1 className="text-3xl font-bold mt-16">Manage your account</h1>
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Profile</h2>
                        <p className="text-sm text-muted-foreground">Update your profile information</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={avatarUrl} alt={name} />
                                <AvatarFallback>
                                    {session?.user.displayName?.trim()
                                        ? session.user.displayName
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
                            >
                                <Upload className="h-4 w-4" />
                                Upload Photo
                            </Button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Display Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                                    <Input
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter your username"
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself"
                                rows={4}
                            />
                        </div>

                        <Button
                            onClick={handleSave}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                        >
                            Save Changes
                        </Button>
                    </div>
                </section>
            </div>
        </div>

    )
}