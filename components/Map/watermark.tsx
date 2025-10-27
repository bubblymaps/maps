"use client";

import { useTheme } from "next-themes";

export function Watermark() {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div
      className={`
        fixed z-10 pointer-events-none select-none
        bottom-2 right-5 sm:bottom-2 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto
      `}
    >
      <span
        className={`text-[13px] font-medium ${
          isDark
            ? "text-white opacity-50"
            : "text-gray-400 [text-shadow:0_0_1px_white]"
        }`}
      >
        Bubbly Maps
      </span>
    </div>
  );
}
