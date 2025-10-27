"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "cursor-pointer rounded-full border border-input shadow-md transition",
            "bg-white text-black",
            "dark:bg-zinc-900/80 dark:backdrop-blur-sm dark:text-white",
            "hover:bg-gray-100 dark:hover:bg-zinc-800",
            "h-10 w-10 rounded-full p-0 flex items-center justify-center"
          )}
        >
          <Sun
            className={cn(
              "h-[1.2rem] w-[1.2rem] transition-all",
              theme === "light"
                ? "rotate-0 scale-100"
                : "rotate-90 scale-0"
            )}
          />
          <Moon
            className={cn(
              "absolute h-[1.2rem] w-[1.2rem] transition-all",
              theme === "dark"
                ? "rotate-0 scale-100"
                : "rotate-90 scale-0"
            )}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
