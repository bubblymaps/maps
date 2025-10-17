"use client"

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link"

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Footer } from "@/components/Footer"
import { MapPin, Upload, Code2 } from "lucide-react"

import Loading from "@/components/Loading";

import type { Announcement } from "@/types/types"
import type { Stats } from "@/types/types"

export function Home() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [stats, setStats] = useState<Stats>({ users: 0, bubblers: 0, reviews: 0 });
  const { data: session } = useSession();
  const isSignedIn = !!session;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [announcementRes, statsRes] = await Promise.all([
          fetch("https://app.linuskang.au/b/announcement"),
          fetch("/api/stats")
        ]);

        const announcementData = await announcementRes.json();
        const statsData = await statsRes.json();

        setAnnouncement(announcementData);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading || status === "loading") {
    return <Loading />;
  }

  console.log(session)
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="mt-10 relative h-screen w-full overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 flex flex-col items-center justify-center">
          <div className="container mx-auto px-4 z-10">
            <div className="mx-auto max-w-3xl text-center">
              {announcement && (
                <a
                  href={announcement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm justify-center cursor-pointer hover:bg-muted/20 transition"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                  </span>
                  {announcement.announcement}
                </a>
              )}
              <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
                The{" "}
                <span className="bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  next generation, 
                open-source
                </span>{" "}
                bubbler map
              </h1>
              <p className="mb-8 text-lg text-muted-foreground text-balance sm:text-xl">
                Explore and contribute to the world's largest community-driven public drinking fountain repository, all for free.
              </p>
              <div className="mb-8 grid grid-cols-3 gap-4 justify-center">
                <div className="border-primary/20 bg-primary/5 p-4 rounded-xl">
                  <div className="mb-1 text-2xl font-bold text-primary sm:text-3xl">
                    {stats.bubblers.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground sm:text-sm">Mapped locations</div>
                </div>
                <div className="border-primary/20 bg-primary/5 p-4 rounded-xl">
                  <div className="mb-1 text-2xl font-bold text-primary sm:text-3xl">
                    {stats.reviews.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground sm:text-sm">Bubbler Reviews</div>
                </div>
                <div className="border-primary/20 bg-primary/5 p-4 rounded-xl">
                  <div className="mb-1 text-2xl font-bold text-primary sm:text-3xl">
                    {stats.users.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground sm:text-sm">Active Contributors</div>
                </div>
              </div>
              <div className="flex justify-center mb-12">
                <Link href="/">
                  <Button size="lg" className="rounded-full px-8 py-7 text-base font-semibold cursor-pointer">
                    {isSignedIn ? "Launch App" : "Get Started"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-3 w-[50%] max-w-10xl rounded-lg border border-border bg-card shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span className="ml-2 text-sm text-muted-foreground">https://bubblymaps.org</span>
            </div>
            <iframe
              src="https://bubblymaps.org"
              className="w-full h-[800px] sm:h-[600px] md:h-[650px] border-none"
              title="Embedded Website"
            ></iframe>
          </div>
        </section>
        <section className=" bg-muted/20 py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              How It Works
            </h2>
            <p className="mb-16 text-lg text-muted-foreground max-w-2xl mx-auto">
              Bubbly Maps is a open source platform with the largest water fountain repository in the world, all available for free.
            </p>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative flex flex-col items-center text-center rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-all">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin size={28} />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Explore Fountains</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Explore and locate thousands of public drinking fountains near you mapped across the world, updated by our community.
                </p>
              </div>
              <div className="relative flex flex-col items-center text-center rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-all">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Upload size={28} />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Add New Locations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Want to contribute a water fountain? Add it in seconds. Your contributions are verified and synced across all Bubbly platforms.
                </p>
              </div>
              <div className="relative flex flex-col items-center text-center rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-all">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Code2 size={28} />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Integrate with Our API</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access our open developer API or SDK to build apps, visualizations, or integrations powered by our live hydration data.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="border-t border-border py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="mb-6 text-4xl font-bold leading-tight text-balance md:text-5xl">
                  Built by developers, for developers.
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  The Bubbly Maps SDK allows you to interface our APIs to display waypoints and reviews in your own applications. Check our documentation for more details.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-8 w-full">
                <div className="w-full max-w-xl rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
                  <div className="flex items-center gap-2 bg-muted/70 px-4 py-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs font-medium text-muted-foreground">bubbly.js</span>
                  </div>
                  <pre className="overflow-x-auto bg-card p-6 font-mono text-sm rounded-b-2xl">
                    <code>
                      <span className="text-purple-400">import</span> bubbly <span className="text-purple-400">from</span> <span className="text-green-400">"bubbly.io"</span>;{'\n'}
                      {'\n'}
                      bubbly.auth(<span className="text-green-400">"my_token"</span>);{'\n'}
                      {'\n'}
                      <span className="text-gray-400">// Fetch waypoints from a location</span>{'\n'}
                      bubbly.<span className="text-blue-400">get</span>(<span className="text-green-400">"waypoints"</span>, <span className="text-white">{'{ suburb: "Calamvale" }'}</span>).then(<span className="text-pink-400">data</span> =&gt; <span className="text-white">{'{'}</span>{'\n'}
                      <span>{'\u00A0\u00A0\u00A0\u00A0'}</span>console<span className="text-blue-400">.log</span>(<span className="text-pink-400">data</span>);{'\n'}
                      <span className="text-white">{'}'}</span>);{'\n'}
                      {'\n'}
                      <span className="text-gray-400">// Fetch reviews for a specific waypoint</span>{'\n'}
                      bubbly.<span className="text-blue-400">get</span>(<span className="text-green-400">"reviews"</span>, <span className="text-white">{'{ id: 42 }'}</span>).then(<span className="text-pink-400">reviews</span> =&gt; <span className="text-white">{'{'}</span>{'\n'}
                      <span>{'\u00A0\u00A0\u00A0\u00A0'}</span>console<span className="text-blue-400">.log</span>(<span className="text-pink-400">reviews</span>);{'\n'}
                      <span className="text-white">{'}'}</span>);{'\n'}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="border-t border-border py-24">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="mb-8 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full text-left">
              <AccordionItem value="item-1">
                <AccordionTrigger className="cursor-pointer">Is Bubbly free to use?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    Yes! Bubbly is completely free to use under the CC BY-NC 4.0 license.
                    You can explore, use, and contribute to the database for non-commercial purposes.
                  </p>
                  <p>
                    All data is community-driven and shared transparently to make water fountain access easier for everyone.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="cursor-pointer">Can I contribute or add new locations?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    Definitely! Anyone can suggest or add new fountains through the app
                    or contribute directly to the open-source project on GitHub.
                    Contributions help keep the map accurate, up-to-date, and helpful for everyone.
                  </p>
                  <p>
                    Please note that you’ll need an account to submit new locations or edits.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="cursor-pointer">Do I need an account to use Bubbly?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    You can browse all public data without signing in.
                    Creating an account lets you contribute to the fountain database, add reviews,
                    save favorite fountains, and sync your preferences across devices.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="cursor-pointer">How accurate is the data on Bubbly?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    All contributions ont the platform are community-verified and moderated to ensure accuracy. Users can report outdated or incorrect entries directly in the app.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="cursor-pointer">Can I integrate Bubbly Maps data into my own app?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    We offer APIs for your application to interface our data for non-commercial projects. Please see our documentation for usage guidelines.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger className="cursor-pointer">Can I self-host Bubbly Maps for my own organization or location?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    A lightweight, open-source version of Bubbly Maps is available under the CC BY-NC 4.0 license for self-hosting.
                    It includes the core mapping experience but not all the features found on <span className="font-medium">maps.bubbly.io</span>.
                  </p>
                  <p>
                    If your organization needs a tailored deployment, feel free to reach out to discuss custom solutions.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-4 py-24 text-center md:px-16">
              <div className="relative z-10 mx-auto max-w-3xl">
                <h2 className="mb-6 text-5xl font-bold leading-tight text-balance md:text-6xl">
                  Join the revolution
                </h2>
                <p className="mb-10 text-xl text-muted-foreground text-balance">
                  Join thousands of contributors to help expand Bubbly’s water fountain database. Explore, discover, and contribute for free.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/">
                    <Button size="lg" className="rounded-full px-8 py-7 text-base font-semibold cursor-pointer">
                      {isSignedIn ? "Launch App" : "Get Started"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
