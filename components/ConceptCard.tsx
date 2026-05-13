"use client";

import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Concept } from "@/lib/types";

type IconName = keyof typeof Icons;

export function ConceptCard({
  concept,
  index = 0,
  locale = "en"
}: {
  concept: Concept;
  index?: number;
  locale?: "en" | "zh";
}) {
  const Icon = (Icons[concept.icon as IconName] ?? Icons.Sparkles) as React.ComponentType<{
    className?: string;
  }>;
  const stepLabel = locale === "zh" ? "运行步骤" : "run";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.025, duration: 0.45 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link href={`${locale === "zh" ? "/zh" : ""}/concepts/${concept.slug}`} className="group block h-full">
        <div className="relative flex h-full min-h-[214px] flex-col justify-between overflow-hidden rounded-[8px] border border-border bg-card p-5 shadow-sm transition group-hover:border-foreground/60 group-hover:shadow-glass">
          <div className="absolute left-0 top-0 h-full w-[3px] bg-foreground opacity-80" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase text-muted-foreground">Game {String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight">{concept.title}</h3>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-[8px] border border-border bg-background text-foreground">
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{concept.subtitle}</p>
            <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-3 border-t border-border pt-4">
              <span className="font-mono text-xs uppercase text-muted-foreground">{stepLabel}</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((step) => (
                  <span
                    key={step}
                    className="h-1.5 flex-1 rounded-full bg-foreground/20 transition group-hover:bg-foreground"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
