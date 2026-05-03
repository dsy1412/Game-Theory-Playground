import { GlassCard } from "@/components/ui/card";

export function FormulaPanel({ formula, interpretation }: { formula: string; interpretation: string }) {
  return (
    <GlassCard className="p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Formula</p>
      <code className="mt-3 block rounded-[8px] bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-50 dark:bg-black/50">
        {formula}
      </code>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{interpretation}</p>
    </GlassCard>
  );
}
