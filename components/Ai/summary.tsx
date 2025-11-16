"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Sparkles, RefreshCw, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

// In-memory cache to avoid refetching the same summary across mounts
const summaryCache = new Map<string, string>();

interface Props {
  reviews: { rating: number; comment: string }[];
}

export default function AIReviewSummary({ reviews }: Props) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [displayed, setDisplayed] = useState("");
  const fetchingRef = useRef(false);
  const lastKeyRef = useRef<string | null>(null);
  const normalized = useMemo(() => reviews.map(r => ({ r: r.rating, c: r.comment })), [reviews]);
  const reviewsKey = useMemo(() => JSON.stringify(normalized), [normalized]);
  const reviewsCount = normalized.length;
  const [refreshCount, setRefreshCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [typingComplete, setTypingComplete] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (reviewsCount < 2) return;

    // Compute a lightweight key for the reviews so we only refetch when content changes
    if (reviewsKey === lastKeyRef.current) return;

    // Avoid duplicate fetches
    if (fetchingRef.current) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSummary = async () => {
      fetchingRef.current = true;
      setLoading(true);
      try {
        // Use cache unless this is an explicit refresh
        if (refreshCount === 0 && summaryCache.has(reviewsKey)) {
          const cached = summaryCache.get(reviewsKey) ?? "";
          setSummary(cached);
          setFeedback(null);
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
        setFeedback(null);
        lastKeyRef.current = reviewsKey;
        setLoading(false);
      } catch (err: unknown) {
        const errName = typeof err === "object" && err !== null && "name" in err ? (err as { name?: string }).name : undefined;
        if (errName === "AbortError") {
          return;
        }
        setSummary("There was an issue whilst generating the summary for this waypoint. Please try again later.");
        setLoading(false);
      } finally {
        fetchingRef.current = false;
      }
    };

    fetchSummary();

    return () => {
      controller.abort();
      // don't set loading false here; let the next successful fetch clear it
      fetchingRef.current = false;
    };
  }, [reviewsKey, reviewsCount, refreshCount]);

  useEffect(() => {
    if (!summary) return;
    // Reset typing states for new summary
    setTypingComplete(false);
    setDisplayed("");
    // Typewriter feel but not too fast (~2s overall)
    let i = 0;
    const pace = Math.max(12, Math.floor(2000 / Math.max(1, summary.length)));
    const interval = setInterval(() => {
      setDisplayed(summary.slice(0, i++));
      if (i > summary.length) {
        clearInterval(interval);
        setTypingComplete(true);
      }
    }, pace);
    return () => clearInterval(interval);
  }, [summary]);

  const handleRefresh = () => {
    if (loading || cooldown) return;
    setCooldown(true);
    setTimeout(() => setCooldown(false), 1500);
    lastKeyRef.current = null;
    setDisplayed("");
    setTypingComplete(false);
    setRefreshCount(prev => prev + 1);
    setFeedback(null);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: 'up' | 'down') => {
    if (feedback) return; // Prevent changing feedback once submitted
    setFeedback(type);
    // TODO: Send feedback to your API endpoint
    // fetch('/api/ai/feedback', { method: 'POST', body: JSON.stringify({ type, summary }) });

    console.log("Feedback submitted:", type);
  };

  if (reviews.length < 2) return null;

  return (
    <div className="relative">
      <div className="relative bg-gradient-to-br from-card to-card/50 border border-border/60 rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Subtle Gemini-style glow background (toned down) */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute -top-10 -right-10 h-48 w-48 md:h-64 md:w-64 rounded-full blur-2xl opacity-20 dark:opacity-15"
            style={{
              background:
                "radial-gradient(closest-side, rgba(124,58,237,0.55), rgba(99,102,241,0.35), transparent 70%)",
              mixBlendMode: "soft-light",
            }}
            animate={prefersReducedMotion ? undefined : { scale: [1, 1.04, 1], x: [0, -8, 0], y: [0, 6, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 h-40 w-40 md:h-56 md:w-56 rounded-full blur-2xl opacity-15 dark:opacity-10"
            style={{
              background:
                "radial-gradient(closest-side, rgba(56,189,248,0.45), rgba(59,130,246,0.3), transparent 70%)",
              mixBlendMode: "soft-light",
            }}
            animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1], x: [0, 6, 0], y: [0, -6, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Foreground content */}
        <div className="relative z-10 flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground">Assistant</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium border border-purple-200/50 dark:border-purple-800/50">
                Experimental
              </span>
            </div>
            
            {!loading && summary && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!summary || loading}
                  className="h-7 px-2 text-xs hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Copy summary"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied && <span className="ml-1">Copied!</span>}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading || cooldown}
                  className="h-7 px-2 text-xs hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Regenerate summary"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>

          <div className="text-sm text-foreground/90 leading-relaxed">
            {loading ? (
              <div className="space-y-2.5">
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-[92%] rounded-md" />
                <Skeleton className="h-3.5 w-[78%] rounded-md" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <p aria-live="polite" className="whitespace-pre-wrap text-foreground/85">
                  {displayed || summary}
                </p>
              </motion.div>
            )}
          </div>

          {!loading && summary && typingComplete && (
            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center gap-3 pt-2 border-t border-border/40"
            >
              <span className="text-xs text-muted-foreground">Was this helpful?</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('up')}
                  disabled={!!feedback}
                  className={`h-7 px-2 text-xs hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                    feedback === 'up' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30' 
                      : ''
                  }`}
                  title="Helpful"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('down')}
                  disabled={!!feedback}
                  className={`h-7 px-2 text-xs hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                    feedback === 'down' 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30' 
                      : ''
                  }`}
                  title="Not helpful"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </Button>
              </div>
              {feedback && (
                <span className="text-xs text-muted-foreground ml-1">Thanks for your feedback!</span>
              )}
            </motion.div>
          )}
        </div>
        {/* end: flex-1 content */}
      </div>
      {/* end: foreground wrapper */}
    </div>
  </div>
  );
}
