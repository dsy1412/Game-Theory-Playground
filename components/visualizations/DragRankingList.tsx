"use client";

import { GripVertical } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function DragRankingList({
  title,
  items,
  onChange
}: {
  title: string;
  items: string[];
  onChange?: (items: string[]) => void;
}) {
  const [ranking, setRanking] = useState(items);
  const [dragged, setDragged] = useState<number | null>(null);

  function move(target: number) {
    if (dragged === null || dragged === target) return;
    const next = [...ranking];
    const [item] = next.splice(dragged, 1);
    next.splice(target, 0, item);
    setRanking(next);
    setDragged(target);
    onChange?.(next);
  }

  return (
    <div className="rounded-[8px] border border-border bg-white/60 p-3 dark:bg-white/5">
      <p className="mb-3 text-sm font-semibold">{title}</p>
      <div className="grid gap-2">
        {ranking.map((item, index) => (
          <div
            key={item}
            draggable
            onDragStart={() => setDragged(index)}
            onDragEnter={() => move(index)}
            onDragEnd={() => setDragged(null)}
            onDragOver={(event) => event.preventDefault()}
            className={cn(
              "flex cursor-grab items-center gap-2 rounded-[8px] border border-border bg-background px-3 py-2 text-sm shadow-sm transition",
              dragged === index && "scale-[0.98] opacity-70"
            )}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="grid h-6 w-6 place-items-center rounded-full bg-muted text-xs text-muted-foreground">
              {index + 1}
            </span>
            <span className="font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
