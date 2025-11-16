'use client'

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Logo() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch by waiting until mounted
    useEffect(() => setMounted(true), [])

    const isDark = (resolvedTheme ?? 'light') === 'dark'

    // If you add a dedicated dark logo later, switch here
    const src = isDark ? '/logo.png' : '/logo.png'

    if (!mounted) {
        return <div className="h-16 w-16" />
    }

    return (
        <div className="flex h-16 w-16 items-center justify-center rounded-md">
            <Image
                src={src}
                alt="Bubbly Logo"
                width={64}
                height={64}
                className="object-contain"
                priority
            />
        </div>
    )
}