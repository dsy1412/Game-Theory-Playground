import { GlassCard } from "@/components/ui/card";

export function FormulaPanel({
  formula,
  interpretation,
  locale = "en"
}: {
  formula: string;
  interpretation: string;
  locale?: "en" | "zh";
}) {
  return (
    <GlassCard className="p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {locale === "zh" ? "公式" : "Formula"}
      </p>
      <code className="mt-3 block rounded-[8px] border border-border bg-foreground px-4 py-3 text-sm leading-6 text-background">
        {formula}
      </code>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{interpretation}</p>
    </GlassCard>
  );
}
