"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { cn } from "@/lib/utils";

export function ResultCard({
  label,
  value,
  tone = "neutral",
  prefix = "",
  suffix = ""
}: {
  label: string;
  value: number | string;
  tone?: "good" | "warn" | "danger" | "neutral";
  prefix?: string;
  suffix?: string;
}) {
  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      animate={{ scale: [1, 1.015, 1] }}
      transition={{ duration: 0.45 }}
      className={cn(
        "rounded-[8px] border border-border bg-white/70 p-4 dark:bg-white/5",
        tone === "good" && "border-emerald-500/40 bg-emerald-500/10",
        tone === "warn" && "border-amber-500/40 bg-amber-500/10",
        tone === "danger" && "border-red-500/40 bg-red-500/10"
      )}
    >
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">
        {typeof value === "number" ? <AnimatedCounter value={value} prefix={prefix} suffix={suffix} /> : value}
      </p>
    </motion.div>
  );
}
