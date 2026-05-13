"use client";

import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, BookOpen, Braces, CircleDot, GitBranch } from "lucide-react";
import Link from "next/link";
import { ConceptCard } from "@/components/ConceptCard";
import { ProgressTracker } from "@/components/ProgressTracker";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { concepts, glossary } from "@/data/concepts";
import { zhConcepts, zhGlossary } from "@/data/zh";
import type { Concept } from "@/lib/types";

export function HomePage({ locale = "en" }: { locale?: "en" | "zh" }) {
  const isZh = locale === "zh";
  const activeConcepts = isZh ? zhConcepts : concepts;
  const activeGlossary = isZh ? zhGlossary : glossary;
  const copy = isZh ? zhHomeCopy : enHomeCopy;

  return (
    <main className="min-h-screen bg-aurora-soft text-foreground dark:bg-aurora-dark">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href={isZh ? "/zh" : "/"} className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-[8px] border border-foreground bg-foreground text-background">
              <BrainCircuit className="h-5 w-5" />
            </span>
            Game Theory Playground
          </Link>
          <div className="flex items-center gap-2">
            <Link href="#concepts" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
              {copy.navConcepts}
            </Link>
            <Button variant="secondary" size="sm" asChild>
              <Link href={isZh ? "/" : "/zh"}>{isZh ? "English" : "中文版"}</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="theory-grid border-b border-border">
        <div className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_520px] lg:px-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-5 inline-flex items-center gap-2 rounded-[8px] border border-border bg-card px-3 py-2 font-mono text-xs uppercase text-muted-foreground">
              <CircleDot className="h-3.5 w-3.5" />
              {copy.badge}
            </p>
            <h1 className="max-w-4xl text-balance text-6xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
              Game Theory Playground
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-muted-foreground">{copy.subtitle}</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{copy.promise}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="#concepts">
                  {copy.start}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href={`${isZh ? "/zh" : ""}/concepts/prisoners-dilemma`}>
                  {copy.try}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-10 grid max-w-2xl gap-2 sm:grid-cols-3">
              {copy.microSteps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.08 }}
                  className="rounded-[8px] border border-border bg-card p-4"
                >
                  <p className="font-mono text-xs text-muted-foreground">0{index + 1}</p>
                  <p className="mt-3 text-sm font-semibold">{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <StrategicFormBoard locale={locale} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-5">
          {copy.masters.map((item) => (
            <div key={item.name} className="rounded-[8px] border border-border bg-card p-5">
              <p className="font-mono text-xs uppercase text-muted-foreground">{item.name}</p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.line}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="concepts" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_460px] lg:items-end">
          <div>
            <p className="font-mono text-sm uppercase text-muted-foreground">{copy.conceptEyebrow}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">{copy.conceptTitle}</h2>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{copy.conceptText}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {activeConcepts.map((concept, index) => (
            <ConceptCard key={concept.slug} concept={concept} index={index} locale={locale} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5" />
            <p className="font-mono text-sm uppercase text-muted-foreground">{copy.what}</p>
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">{copy.whatTitle}</h2>
          <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">{copy.whatText}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {copy.lenses.map(([item, description], index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[8px] border border-border bg-background p-4"
              >
                <p className="text-lg font-semibold">{item}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
        <ProgressTracker locale={locale} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="font-mono text-sm uppercase text-muted-foreground">{copy.featured}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">{copy.fast}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {activeConcepts.slice(0, 6).map((concept, index) => (
            <Link
              key={concept.slug}
              href={`${isZh ? "/zh" : ""}/concepts/${concept.slug}`}
              className="rounded-[8px] border border-border bg-card p-5 transition hover:border-foreground/60 hover:shadow-glass"
            >
              <p className="font-mono text-xs uppercase text-muted-foreground">route {index + 1}</p>
              <h3 className="mt-5 text-xl font-semibold">{concept.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{concept.scenario}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <GlassCard className="p-6 sm:p-8">
          <p className="font-mono text-sm uppercase text-muted-foreground">{copy.glossary}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {activeGlossary.map(([term, definition]) => (
              <div key={term} className="rounded-[8px] border border-border bg-background p-4">
                <p className="font-semibold capitalize">{term}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{definition}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </main>
  );
}

function StrategicFormBoard({ locale = "en" }: { locale?: "en" | "zh" }) {
  const isZh = locale === "zh";
  const rows = isZh
    ? [
        ["玩家", "A 与 B"],
        ["策略", "合作 / 背叛"],
        ["规则", "收益取决于双方选择"],
        ["问题", "谁会单独改变？"]
      ]
    : [
        ["Players", "A and B"],
        ["Strategies", "Cooperate / Defect"],
        ["Rule", "Payoff depends on both moves"],
        ["Question", "Who wants to move alone?"]
      ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.12 }}
      className="rounded-[8px] border border-foreground bg-card p-5 shadow-glass"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            {isZh ? "策略形式" : "Strategic form"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{isZh ? "把冲突写成可运行的模型" : "Turn conflict into a runnable model"}</h2>
        </div>
        <Braces className="h-8 w-8" />
      </div>
      <div className="mt-5 grid gap-3">
        {rows.map(([label, value], index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22 + index * 0.08 }}
            className="grid grid-cols-[104px_1fr] rounded-[8px] border border-border bg-background"
          >
            <div className="border-r border-border p-3 font-mono text-xs uppercase text-muted-foreground">{label}</div>
            <div className="p-3 text-sm font-medium">{value}</div>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-[8px] border border-border text-sm">
        <div className="border-b border-r border-border bg-muted p-3 font-mono text-xs uppercase text-muted-foreground" />
        <div className="border-b border-border bg-muted p-3 font-mono text-xs uppercase text-muted-foreground">B</div>
        <div className="border-r border-border bg-muted p-3 font-mono text-xs uppercase text-muted-foreground">A</div>
        <div className="grid grid-cols-2">
          {["-1,-1", "0,-5", "-5,0", "-3,-3"].map((payoff) => (
            <div key={payoff} className="border-b border-r border-border p-3 font-mono last:border-r-0">
              {payoff}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
        <GitBranch className="h-4 w-4" />
        {isZh ? "每个页面都按：规则 → 行动 → 计算 → 解释运行。" : "Every module runs: rules -> move -> compute -> interpret."}
      </div>
    </motion.div>
  );
}

const enHomeCopy = {
  navConcepts: "Concepts",
  badge: "working notes in strategic reasoning",
  subtitle: "Learn game theory by running the choices, not by memorizing definitions.",
  promise:
    "Each simulation reduces a real situation to players, strategies, payoffs, and a question: what changes when one person changes alone?",
  start: "Open the games",
  try: "Start with Prisoner's Dilemma",
  microSteps: ["Name the players", "Move one strategy", "Read the payoff"],
  masters: [
    { name: "von Neumann", line: "Formalize the rules before arguing about the outcome." },
    { name: "Morgenstern", line: "Treat economics as choices under interdependence." },
    { name: "Nash", line: "Look for a position where no one improves alone." },
    { name: "Schelling", line: "Notice signals, commitment, and focal points." },
    { name: "Shapley / Ostrom", line: "Ask how cooperation, fairness, and commons can survive." }
  ],
  conceptEyebrow: "10 playable models",
  conceptTitle: "Choose the game, then run the reasoning.",
  conceptText: "The interaction is deliberately compact: change one variable, watch the mechanism respond, then read why that response matters.",
  what: "What is Game Theory?",
  whatTitle: "A discipline for situations where your best move depends on someone else's move.",
  whatText:
    "The site treats each concept like a small laboratory: define the players, constrain the moves, compute the consequences, and then ask whether the result is stable, fair, efficient, or fragile.",
  lenses: [
    ["Payoff", "What each participant gains or loses."],
    ["Incentive", "Why one move becomes tempting."],
    ["Stability", "Whether anyone wants to deviate alone."]
  ],
  featured: "study routes",
  fast: "Short paths into the playground",
  glossary: "Glossary"
};

const zhHomeCopy = {
  navConcepts: "概念",
  badge: "策略推理工作台",
  subtitle: "通过运行选择来学习博弈论，而不是背定义。",
  promise: "每个模拟都会把真实处境压缩成参与者、策略、收益和一个问题：当某个人单独改变时，什么会跟着改变？",
  start: "打开博弈",
  try: "从囚徒困境开始",
  microSteps: ["确认参与者", "移动一个策略", "读懂收益变化"],
  masters: [
    { name: "冯·诺依曼", line: "先把规则形式化，再讨论结果。" },
    { name: "摩根斯特恩", line: "把经济行为看作相互依赖的选择。" },
    { name: "纳什", line: "寻找没人能单独变好的位置。" },
    { name: "谢林", line: "注意信号、承诺和焦点。" },
    { name: "夏普利 / 奥斯特罗姆", line: "追问合作、公平与公地如何维持。" }
  ],
  conceptEyebrow: "10 个可运行模型",
  conceptTitle: "选择一个博弈，然后运行推理。",
  conceptText: "交互被刻意做得紧凑：改变一个变量，观察机制响应，再读懂这个响应为什么重要。",
  what: "什么是博弈论？",
  whatTitle: "研究“我的最佳选择取决于别人怎么选”的学科。",
  whatText:
    "这里把每个概念当作一个小实验室：定义参与者，限制可选行动，计算后果，再判断结果是否稳定、公平、有效或脆弱。",
  lenses: [
    ["收益", "每个参与者得到或失去什么。"],
    ["激励", "为什么某个行动变得诱人。"],
    ["稳定性", "是否有人想单独偏离。"]
  ],
  featured: "学习路径",
  fast: "快速进入 Playground",
  glossary: "术语表"
};
