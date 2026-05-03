"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

type AnimatedCounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className
}: AnimatedCounterProps) {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(
    motionValue,
    (latest: number) => `${prefix}${latest.toFixed(decimals)}${suffix}`
  );

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.65, ease: "easeOut" });
    return controls.stop;
  }, [motionValue, value]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
