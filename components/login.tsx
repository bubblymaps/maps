"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface LoginCardProps {
  title?: string;
  subtitle?: string;
  callbackUrl?: string;
  onClose?: () => void;
}

export default function Login({
  title = "Sign in",
  subtitle = "Use your Google account to continue",
  callbackUrl = "/",
  onClose,
}: LoginCardProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className={`relative w-full max-w-sm p-8 sm:p-10 rounded-3xl shadow-2xl border backdrop-blur-md transition-colors duration-300 space-y-6
          ${isDark ? "bg-zinc-900/80 border-zinc-700 text-white" : "bg-white/80 border-zinc-200 text-foreground"}`}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className={`cursor-pointer w-5 h-5 ${isDark ? "text-white" : "text-gray-700"}`} />
          </button>
        )}

        <h1 className="text-3xl font-extrabold">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>

        <Button
          onClick={() => signIn("google", { callbackUrl })}
          className={`cursor-pointer w-full flex items-center justify-center gap-3 rounded-xl border shadow-sm px-5 py-3 text-sm font-medium transition-all
            ${isDark
              ? "border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-md"
              : "border-zinc-200 bg-white text-foreground hover:bg-gray-100 hover:shadow-md"
            }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
            <path d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.4H272v95.3h146.9c-6.3 34.1-25.2 63.1-53.7 82.6v68.5h86.7c50.9-46.9 81.6-116.1 81.6-196z" fill="#4285F4"/>
            <path d="M272 544.3c72.9 0 134.1-24.2 178.8-65.7l-86.7-68.5c-24.1 16.1-55 25.6-92.1 25.6-70.9 0-131-47.9-152.5-112.5H32.9v70.9C77 482.6 169.6 544.3 272 544.3z" fill="#34A853"/>
            <path d="M119.5 323.6c-10.6-31.8-10.6-66.4 0-98.2v-70.9H32.9c-40.2 80.5-40.2 176.2 0 256.7l86.6-70.9z" fill="#FBBC05"/>
            <path d="M272 107.7c38.9-.6 75.9 14 104 40.6l77.9-77.9C406.1 24.1 344.9 0 272 0 169.6 0 77 61.7 32.9 153.8l86.6 70.9C141 155.6 201.1 107.7 272 107.7z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </Button>

        <p className="text-xs text-muted-foreground mt-2">
          By signing in, you agree to our{" "}
          <a href="/terms" className="underline hover:text-primary transition-colors" target="_blank">Terms of Service</a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-primary transition-colors" target="_blank">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
