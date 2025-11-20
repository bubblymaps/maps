"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// In-memory cache to avoid refetching the same summary across mounts
const summaryCache = new Map<string, string>();

interface Props {
  reviews: { rating: number; comment: string }[];
}

export default function AIReviewSummaryCompact({ reviews }: Props) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const fetchingRef = useRef(false);
  const lastKeyRef = useRef<string | null>(null);
  const normalized = useMemo(() => reviews.map(r => ({ r: r.rating, c: r.comment })), [reviews]);
  const reviewsKey = useMemo(() => JSON.stringify(normalized), [normalized]);
  const reviewsCount = normalized.length;

  useEffect(() => {

    if (reviewsCount < 2) return;
    if (reviewsKey === lastKeyRef.current) return;
    if (fetchingRef.current) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSummary = async () => {
      fetchingRef.current = true;
      setLoading(true);
      try {
        if (summaryCache.has(reviewsKey)) {
          const cached = summaryCache.get(reviewsKey) ?? "";
          setSummary(cached);
          lastKeyRef.current = reviewsKey;
          setLoading(false);
          return;
        }
        const res = await fetch("https://api.bubblymaps.org/ai/summarise", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: JSON.stringify(reviews) }),
          signal,
        });
        if (!res.ok) throw new Error(`AI request failed (${res.status})`);
        const data = await res.json();
        const text = (data.response || "").trim();
        setSummary(text);
        summaryCache.set(reviewsKey, text);
        lastKeyRef.current = reviewsKey;
        setLoading(false);
      } catch (err: unknown) {
        const errName = typeof err === "object" && err !== null && "name" in err ? (err as { name?: string }).name : undefined;
        if (errName === "AbortError") {
          return;
        }
        setSummary("Unable to generate summary.");
        setLoading(false);
      } finally {
        fetchingRef.current = false;
      }
    };

    fetchSummary();

    return () => {
      controller.abort();
      fetchingRef.current = false;
    };
  }, [reviewsKey, reviewsCount]);

  if (reviews.length < 2) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-950/20 dark:to-blue-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-3">
      <div className="flex items-start gap-2.5">
        <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-600 text-white">
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-foreground">Reviews</h4>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 font-medium">
              Beta
            </span>
          </div>

          <div className="text-xs text-foreground/85 leading-relaxed">
            {loading ? (
              <div className="space-y-1.5">
                <Skeleton className="h-2.5 w-full rounded" />
                <Skeleton className="h-2.5 w-[85%] rounded" />
                <Skeleton className="h-2.5 w-[70%] rounded" />
              </div>
            ) : (
              <p className="whitespace-pre-wrap">
                {summary.length > 180 ? summary.slice(0, 177) + "..." : summary}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
