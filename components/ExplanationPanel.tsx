import type { Concept } from "@/lib/types";

export function ExplanationPanel({
  concept,
  mode
}: {
  concept: Concept;
  mode: "beginner" | "advanced";
}) {
  return (
    <div className="grid gap-4">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Scenario</p>
        <p className="mt-2 leading-7 text-muted-foreground">{concept.scenario}</p>
      </section>
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Why This Matters</p>
        <p className="mt-2 leading-7 text-muted-foreground">{concept.whyItMatters}</p>
      </section>
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {mode === "beginner" ? "Beginner Summary" : "Advanced Note"}
        </p>
        <p className="mt-2 leading-7 text-muted-foreground">
          {mode === "beginner"
            ? concept.summary
            : `${concept.summary} The important move is to compare incentives at the margin, not just final outcomes.`}
        </p>
      </section>
      <p className="rounded-[8px] border border-border bg-white/50 p-4 text-sm font-medium dark:bg-white/5">
        Try changing the strategy and watch which result changes first.
      </p>
    </div>
  );
}
