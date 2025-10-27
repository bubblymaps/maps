"use client"

import type React from "react"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
}

export function SearchBar({
  placeholder = "Search...",
  value: initialValue = "",
  onChange,
  onSearch,
  className,
}: SearchBarProps) {
  const [input, setInput] = useState(initialValue)

  const handleInputChange = (val: string) => {
    setInput(val)
    onChange?.(val)
  }

  const handleClear = () => {
    setInput("")
    onChange?.("")
  }

  const handleSearch = () => {
    onSearch?.(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <div
      className={cn(
        "relative flex items-center w-full rounded-full border border-input shadow-md focus-within:ring-2 focus-within:ring-ring transition bg-white dark:bg-zinc-900/80 dark:backdrop-blur-sm",
        className,
      )}
    >
      {/* Search icon */}
      <button
        onClick={handleSearch}
        type="button"
        className="ml-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground truncate"
      />

      {/* Clear button */}
      <button
        onClick={handleClear}
        type="button"
        aria-label="Clear search"
        className={cn(
          "mr-3 text-muted-foreground hover:text-foreground transition-opacity cursor-pointer",
          input ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
