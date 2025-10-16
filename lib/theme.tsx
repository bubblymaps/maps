"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

export type Theme = "light" | "dark" | "system"

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "system",
    setTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system")

    const applyTheme = (theme: Theme) => {
        const root = document.documentElement
        root.classList.remove("light", "dark")

        if (theme === "light") root.classList.add("light")
        else if (theme === "dark") root.classList.add("dark")
        else {
            const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            root.classList.toggle("dark", isDark)
        }
    }

    useEffect(() => {
        const saved = localStorage.getItem("theme") as Theme | null
        if (saved) setThemeState(saved)
        applyTheme(saved || "system")
    }, [])

    useEffect(() => {
        applyTheme(theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    useEffect(() => {
        const listener = () => {
            if (theme === "system") applyTheme("system")
        }
        const mql = window.matchMedia("(prefers-color-scheme: dark)")
        mql.addEventListener("change", listener)
        return () => mql.removeEventListener("change", listener)
    }, [theme])

    return <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)