"use client";

import { ReactNode, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { GeistSans, GeistMono } from "geist/font";

export default function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Wait until the component is mounted to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  const fontClasses = `${GeistSans.variable} ${GeistMono.variable}`;

  if (!mounted) return null; // render nothing on server

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <div className={fontClasses}>{children}</div>
      </ThemeProvider>
    </SessionProvider>
  );
}
