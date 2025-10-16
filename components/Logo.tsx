'use client'

import Image from "next/image"
import { useTheme } from "@/lib/theme"
import { useEffect, useState } from "react"

export function Logo() {
    const { theme } = useTheme()
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        if (theme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setCurrentTheme(isDark ? 'dark' : 'light')

            const listener = (e: MediaQueryListEvent) => {
                setCurrentTheme(e.matches ? 'dark' : 'light')
            }
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener)
            return () => {
                window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener)
            }
        } else {
            setCurrentTheme(theme)
        }
    }, [theme])

    const src = currentTheme === 'dark'
        ? '/logo-no-bg.png'
        : '/logo-no-bg.png'

    return (
        <div className="flex h-16 w-16 items-center justify-center rounded-md">
            <Image
                src={src}
                alt="Bubbly Logo"
                width={64}
                height={64}
                className="object-contain"
            />
        </div>
    )
}