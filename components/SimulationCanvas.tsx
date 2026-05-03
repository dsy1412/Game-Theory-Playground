import { cn } from "@/lib/utils";

export function SimulationCanvas({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative min-h-[420px] overflow-hidden rounded-[8px] border border-border bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(226,232,240,0.42))] p-5 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.82),rgba(30,41,59,0.62))]",
        className
      )}
    >
      {children}
    </div>
  );
}
