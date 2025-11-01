"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface Props {
  reviews: { rating: number; comment: string }[];
}

export default function AIReviewSummary({ reviews }: Props) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (reviews.length < 2) return;

    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/ai/reviews-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviews }),
        });
        const data = await res.json();
        const text = data.summary;
        setSummary(text);
      } catch (err) {
        setSummary("Failed to generate AI summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [reviews]);

  // Typing animation
  useEffect(() => {
    if (!summary) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(summary.slice(0, i++));
      if (i > summary.length) clearInterval(interval);
    }, 30); // speed in ms per character
    return () => clearInterval(interval);
  }, [summary]);

  if (reviews.length < 2) return null;

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg opacity-75 group-hover:opacity-100 blur transition duration-300 animate-gradient-x"></div>
      <div className="relative bg-card border border-border/60 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full opacity-20 blur-md animate-pulse"></div>
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Assistant
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                Beta
              </span>
            </div>

            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : (
              <motion.p
                className="text-sm text-foreground/80 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {displayed}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
