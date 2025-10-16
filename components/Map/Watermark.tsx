"use client";

import { useTheme } from "@/lib/theme";

export function Watermark() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none">
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