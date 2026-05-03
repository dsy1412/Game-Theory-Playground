import type { Concept } from "@/lib/types";

export function ExplanationPanel({
  concept,
  locale = "en"
}: {
  concept: Concept;
  locale?: "en" | "zh";
}) {
  const labels =
    locale === "zh"
      ? {
          scenario: "场景",
          why: "为什么重要",
          summary: "零基础总结",
          prompt: "试着改变策略，观察哪个结果最先发生变化。"
        }
      : {
          scenario: "Scenario",
          why: "Why This Matters",
          summary: "Beginner-Friendly Summary",
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
          {labels.summary}
        </p>
        <p className="mt-2 leading-7 text-muted-foreground">{concept.summary}</p>
      </section>
      <p className="rounded-[8px] border border-border bg-white/50 p-4 text-sm font-medium dark:bg-white/5">
        {labels.prompt}
      </p>
    </div>
  );
}
