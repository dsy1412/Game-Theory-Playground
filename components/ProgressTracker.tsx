"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { concepts } from "@/data/concepts";
import { cn } from "@/lib/utils";

export function markConceptVisited(slug: string) {
  if (typeof window === "undefined") return;
  const current = JSON.parse(window.localStorage.getItem("gtp-progress") ?? "[]") as string[];
  const next = Array.from(new Set([...current, slug]));
  window.localStorage.setItem("gtp-progress", JSON.stringify(next));
}

export function ProgressTracker({ activeSlug }: { activeSlug?: string }) {
  const [visited, setVisited] = useState<string[]>([]);

  useEffect(() => {
    setVisited(JSON.parse(window.localStorage.getItem("gtp-progress") ?? "[]") as string[]);
  }, [activeSlug]);

  const percent = useMemo(() => Math.round((visited.length / concepts.length) * 100), [visited.length]);

  return (
    <div className="glass rounded-[8px] p-4">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-semibold">Progress</span>
        <span className="text-muted-foreground">{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-5 lg:grid-cols-2">
        {concepts.map((concept) => {
          const done = visited.includes(concept.slug);
          return (
            <Link
              key={concept.slug}
              href={`/concepts/${concept.slug}`}
              className={cn(
                "flex items-center gap-2 rounded-[8px] border border-border bg-white/50 px-2 py-2 transition hover:bg-white dark:bg-white/5 dark:hover:bg-white/10",
                activeSlug === concept.slug && "border-primary/60"
              )}
            >
              <CheckCircle2 className={cn("h-3.5 w-3.5", done ? "text-accent" : "text-muted-foreground")} />
              <span className="truncate">{concept.shortTitle}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
