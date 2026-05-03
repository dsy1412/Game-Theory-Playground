"use client";

import { Fragment } from "react";
import type { PayoffMatrix as PayoffMatrixType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PayoffMatrix({
  matrix,
  highlight
}: {
  matrix: PayoffMatrixType;
  highlight?: { rowStrategy: string; columnStrategy: string };
}) {
  const rows = Array.from(new Set(matrix.map((cell) => cell.rowStrategy)));
  const columns = Array.from(new Set(matrix.map((cell) => cell.columnStrategy)));

  return (
    <div className="overflow-hidden rounded-[8px] border border-border bg-white/60 text-sm dark:bg-white/5">
      <div className="grid" style={{ gridTemplateColumns: `120px repeat(${columns.length}, minmax(110px, 1fr))` }}>
        <div className="border-b border-border p-3 text-muted-foreground">A / B</div>
        {columns.map((column) => (
          <div key={column} className="border-b border-l border-border p-3 text-center font-semibold">
            {column}
          </div>
        ))}
        {rows.map((row) => (
          <Fragment key={row}>
            <div key={`${row}-label`} className="border-b border-border p-3 font-semibold">
              {row}
            </div>
            {columns.map((column) => {
              const cell = matrix.find(
                (candidate) => candidate.rowStrategy === row && candidate.columnStrategy === column
              );
              const active = highlight?.rowStrategy === row && highlight.columnStrategy === column;
              return (
                <div
                  key={`${row}-${column}`}
                  className={cn(
                    "border-b border-l border-border p-3 text-center transition",
                    active && "bg-primary/15 ring-2 ring-inset ring-primary/50"
                  )}
                >
                  <span className="font-mono">
                    {cell?.payoffA}, {cell?.payoffB}
                  </span>
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
