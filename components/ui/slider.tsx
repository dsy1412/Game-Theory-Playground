"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SliderProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  value: number;
  prefix?: string;
  suffix?: string;
};

export function Slider({ className, label, value, prefix = "", suffix, ...props }: SliderProps) {
  return (
    <label className="grid gap-2 text-sm">
      {label ? (
        <span className="flex items-center justify-between text-muted-foreground">
          <span>{label}</span>
          <span className="font-semibold text-foreground">
            {prefix}
            {value}
            {suffix}
          </span>
        </span>
      ) : null}
      <input
        type="range"
        value={value}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary",
          className
        )}
        {...props}
      />
    </label>
  );
}
