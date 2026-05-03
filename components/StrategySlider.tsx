"use client";

import { Slider } from "@/components/ui/slider";

export function StrategySlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  prefix = "",
  suffix = ""
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <Slider
      label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      prefix={prefix}
      suffix={suffix}
      onChange={(event) => onChange(Number(event.currentTarget.value))}
    />
  );
}
