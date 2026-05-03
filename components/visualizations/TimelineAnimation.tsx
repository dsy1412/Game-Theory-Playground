"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TimelineAnimation({
  steps,
  activeIndex = steps.length - 1
}: {
  steps: string[];
  activeIndex?: number;
}) {
  return (
    <div className="grid gap-3">
      {steps.map((step, index) => {
        const active = index <= activeIndex;
        return (
          <motion.div
            key={`${step}-${index}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3"
          >
            <div
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            <p className={cn("text-sm", active ? "text-foreground" : "text-muted-foreground")}>{step}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
