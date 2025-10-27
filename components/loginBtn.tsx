"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoginBtnProps {
  onClick?: () => void;
}

export function LoginBtn({ onClick }: LoginBtnProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full border border-input shadow-md transition",
        "bg-white text-black",
        "dark:bg-zinc-900/80 dark:backdrop-blur-sm dark:text-white",
        "hover:bg-gray-100 dark:hover:bg-zinc-800",
        "h-10 px-4 flex items-center justify-center"
      )}
    >
      Sign In
    </Button>
  );
}
