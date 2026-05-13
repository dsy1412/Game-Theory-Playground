"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
  asChild?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-[8px] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:pointer-events-none disabled:opacity-50",
    variant === "primary" &&
      "bg-foreground text-background shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:shadow-xl dark:bg-white dark:text-black",
    variant === "secondary" &&
      "border border-border bg-card text-foreground hover:bg-muted dark:bg-white/10 dark:hover:bg-white/15",
    variant === "ghost" && "text-foreground hover:bg-foreground/8 dark:hover:bg-white/10",
    variant === "danger" && "bg-red-500 text-white hover:bg-red-600",
    size === "sm" && "h-9 px-4 text-sm",
    size === "md" && "h-11 px-5 text-sm",
    size === "icon" && "h-10 w-10",
    className
  );

  if (asChild && React.isValidElement<{ className?: string }>(children)) {
    return React.cloneElement(children, {
      className: cn(classes, children.props.className)
    });
  }

  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
