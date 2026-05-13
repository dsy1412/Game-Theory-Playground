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
        "theory-grid relative min-h-[420px] overflow-hidden rounded-[8px] border border-border bg-card p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
