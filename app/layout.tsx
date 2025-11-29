import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Bubbly Maps – Find Nearby Drinking Fountains",
    template: "%s | Bubbly Maps",
  },
  description:
    "The open-source water bubbler map. Find drinking fountains worldwide. Open code, open data, open community.",
  keywords: [
    "water bubbler map",
    "tap finder",
    "drinking fountains",
    "public water map",
    "bubbly maps",
    "hydration map",
  ],
  metadataBase: new URL("https://bubblymaps.org"),
  openGraph: {
    title: "Bubbly Maps – Find Nearby Drinking Fountains",
    description:
      "Locate water bubblers and drinking taps near you. Open-source, community powered hydration map.",
    url: "https://bubblymaps.org",
    siteName: "Bubbly Maps",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Bubbly Maps – Find Nearby Drinking Fountains",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bubbly Maps – Find Nearby Drinking Fountains",
    description:
      "The open-source bubbler map. Easily find drinking fountains around the world.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://bubblymaps.org",
  },
  authors: [{ name: "Bubbly Maps" }],
  creator: "Bubbly Maps",
  publisher: "Bubbly Maps",
  category: "Maps",
  verification: {
    // google: 'your-google-site-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bubbly Maps',
    url: 'https://bubblymaps.org',
    description: 'The open-source water bubbler map. Find drinking fountains worldwide.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://bubblymaps.org/waypoints?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
