"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedCharacter({
  name,
  mood = "neutral"
}: {
  name: string;
  mood?: "happy" | "neutral" | "worried";
  color?: string;
}) {
  const mouth = mood === "happy" ? "M35 62 Q50 76 65 62" : mood === "worried" ? "M36 70 Q50 58 64 70" : "M38 66 H62";

  return (
    <motion.div
      animate={{ y: mood === "happy" ? [0, -5, 0] : 0 }}
      transition={{ duration: 1.6, repeat: Infinity }}
      className="grid justify-items-center gap-2"
    >
      <svg viewBox="0 0 100 112" className="h-24 w-24 drop-shadow-xl" role="img" aria-label={name}>
        <circle cx="50" cy="50" r="38" fill="currentColor" opacity="0.08" />
        <circle cx="50" cy="48" r="30" fill="white" className="dark:fill-neutral-100" />
        <circle cx="39" cy="45" r="3.5" fill="#0f172a" />
        <circle cx="61" cy="45" r="3.5" fill="#0f172a" />
        <path d={mouth} stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M25 98 C35 82 65 82 75 98" fill="currentColor" opacity="0.82" />
      </svg>
      <span
        className={cn(
          "rounded-full border px-3 py-1 text-xs font-medium",
          mood === "happy" && "border-foreground bg-background text-foreground",
          mood === "neutral" && "bg-muted text-muted-foreground",
          mood === "worried" && "border-border bg-muted text-foreground"
        )}
      >
        {name}
      </span>
    </motion.div>
  );
}
