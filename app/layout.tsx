import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Bubbly Maps",
  description: "The open-source fountain repository, mapping the world's bubblers.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors />
        <Script
          src="https://bubblymaps.statuspage.io/embed/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
