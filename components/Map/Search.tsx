"use client"

import type React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: () => void
  className?: string
}

export function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
  className,
}: SearchBarProps) {
  const handleClear = () => onChange?.("")
  const handleSearch = () => onSearch?.()
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <div
      className={cn(
        "relative flex items-center w-full max-w-xl rounded-full border border-input shadow-md focus-within:ring-2 focus-within:ring-ring transition",
        "bg-white dark:bg-zinc-900/80 dark:backdrop-blur-sm",
        className
    )}
    >
      <button
        onClick={handleSearch}
        className="ml-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-label="Search"
        type="button"
      >
        <Search className="h-4 w-4" />
      </button>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground truncate"
      />

      <button
        onClick={handleClear}
        className={cn(
          "mr-3 text-muted-foreground hover:text-foreground transition-opacity cursor-pointer",
          value ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-label="Clear search"
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
