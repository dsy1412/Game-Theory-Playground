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

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.035, duration: 0.55 }}
      whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
      className="h-full"
    >
      <Link href={`${locale === "zh" ? "/zh" : ""}/concepts/${concept.slug}`} className="group block h-full">
        <div className="glass relative flex h-full min-h-[190px] flex-col justify-between overflow-hidden rounded-[8px] p-5">
          <div
            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${concept.accent} opacity-80 transition-opacity group-hover:opacity-100`}
          />
          <div className="flex items-start justify-between gap-4">
            <div className={`rounded-[8px] bg-gradient-to-br ${concept.accent} p-3 text-white shadow-glow`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="rounded-full border border-border bg-white/60 px-3 py-1 text-xs text-muted-foreground dark:bg-white/10">
              {locale === "zh" ? "模块" : "Module"} {index + 1}
            </span>
          </div>
          <div>
            <h3 className="mt-8 text-xl font-semibold tracking-tight">{concept.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{concept.subtitle}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
