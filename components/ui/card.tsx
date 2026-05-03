import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-[8px] border border-border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  );
}

export function GlassCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass rounded-[8px]", className)} {...props} />;
}
