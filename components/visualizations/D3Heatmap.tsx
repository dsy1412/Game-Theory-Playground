"use client";

import * as d3 from "d3";
import { useMemo } from "react";

export function D3Heatmap({
  values,
  active,
  className
}: {
  values: number[][];
  active?: { x: number; y: number };
  className?: string;
}) {
  const cells = useMemo(() => {
    const flattened = values.flat();
    const color = d3
      .scaleSequential(d3.interpolateTurbo)
      .domain([d3.min(flattened) ?? 0, d3.max(flattened) ?? 1]);
    return values.flatMap((row, y) =>
      row.map((value, x) => ({
        x,
        y,
        value,
        fill: color(value)
      }))
    );
  }, [values]);

  const width = values[0]?.length ?? 1;
  const height = values.length || 1;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} preserveAspectRatio="none">
      {cells.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x}
          y={cell.y}
          width={1}
          height={1}
          fill={cell.fill}
          opacity={0.42 + cell.value * 0.004}
        />
      ))}
      {active ? (
        <circle cx={active.x * width} cy={active.y * height} r={0.45} fill="white" opacity="0.95">
          <animate attributeName="r" values="0.28;0.52;0.28" dur="1.6s" repeatCount="indefinite" />
        </circle>
      ) : null}
    </svg>
  );
}
