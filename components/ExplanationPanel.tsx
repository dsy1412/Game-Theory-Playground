import type { Concept } from "@/lib/types";

export function ExplanationPanel({
  concept,
  mode,
  locale = "en"
}: {
  concept: Concept;
  mode: "beginner" | "advanced";
  locale?: "en" | "zh";
}) {
  const labels =
    locale === "zh"
      ? {
          scenario: "场景",
          why: "为什么重要",
          beginner: "新手总结",
          advanced: "进阶提示",
          advancedText: "关键是比较边际激励，而不只是看最终结果。",
          prompt: "试着改变策略，观察哪个结果最先发生变化。"
        }
      : {
          scenario: "Scenario",
          why: "Why This Matters",
          beginner: "Beginner Summary",
          advanced: "Advanced Note",
          advancedText: "The important move is to compare incentives at the margin, not just final outcomes.",
          prompt: "Try changing the strategy and watch which result changes first."
        };

  return (
    <div className="grid gap-4">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{labels.scenario}</p>
        <p className="mt-2 leading-7 text-muted-foreground">{concept.scenario}</p>
      </section>
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{labels.why}</p>
        <p className="mt-2 leading-7 text-muted-foreground">{concept.whyItMatters}</p>
      </section>
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {mode === "beginner" ? labels.beginner : labels.advanced}
        </p>
        <p className="mt-2 leading-7 text-muted-foreground">
          {mode === "beginner"
            ? concept.summary
            : `${concept.summary} ${labels.advancedText}`}
        </p>
      </section>
      <p className="rounded-[8px] border border-border bg-white/50 p-4 text-sm font-medium dark:bg-white/5">
        {labels.prompt}
      </p>
    </div>
  );
}
