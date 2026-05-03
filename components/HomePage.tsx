"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BrainCircuit, BookOpen, Sparkles } from "lucide-react";
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
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0.4]);
  const isZh = locale === "zh";
  const activeConcepts = isZh ? zhConcepts : concepts;
  const activeGlossary = isZh ? zhGlossary : glossary;
  const copy = isZh ? zhHomeCopy : enHomeCopy;

  return (
    <main className="min-h-screen bg-aurora-soft dark:bg-aurora-dark">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href={isZh ? "/zh" : "/"} className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-foreground text-background dark:bg-white dark:text-slate-950">
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

      <section className="relative overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="pointer-events-none absolute inset-0">
          <HeroStrategyScene concepts={activeConcepts} />
        </motion.div>
        <div className="relative z-10 mx-auto grid min-h-[86vh] max-w-7xl content-center px-4 pb-20 pt-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="max-w-3xl"
          >
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur dark:bg-white/10">
              <Sparkles className="h-4 w-4 text-accent" />
              {copy.badge}
            </p>
            <h1 className="text-balance text-6xl font-semibold tracking-tight text-foreground drop-shadow-sm sm:text-7xl lg:text-8xl">
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
            <div className="mt-8 grid max-w-2xl gap-2 sm:grid-cols-3">
              {copy.microSteps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + index * 0.08 }}
                  className="rounded-[8px] border border-border bg-white/60 px-4 py-3 text-sm font-medium shadow-sm backdrop-blur dark:bg-white/10"
                >
                  <span className="mr-2 text-muted-foreground">0{index + 1}</span>
                  {step}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="concepts" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {copy.conceptEyebrow}
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">{copy.conceptTitle}</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">{copy.conceptText}</p>
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
            <BookOpen className="h-5 w-5 text-primary" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy.what}</p>
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
                className="rounded-[8px] border border-border bg-white/60 p-4 dark:bg-white/5"
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
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{copy.featured}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">{copy.fast}</h2>
          </div>
        </div>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
          {activeConcepts.slice(0, 6).map((concept) => (
            <Link
              key={concept.slug}
              href={`${isZh ? "/zh" : ""}/concepts/${concept.slug}`}
              className="glass min-w-[280px] rounded-[8px] p-5 transition hover:-translate-y-1"
            >
              <div className={`h-2 w-24 rounded-full bg-gradient-to-r ${concept.accent}`} />
              <h3 className="mt-8 text-xl font-semibold">{concept.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{concept.scenario}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <GlassCard className="p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{copy.glossary}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {activeGlossary.map(([term, definition]) => (
              <div key={term} className="rounded-[8px] border border-border bg-white/60 p-4 dark:bg-white/5">
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

function HeroStrategyScene({ concepts }: { concepts: Concept[] }) {
  const cards = concepts.slice(0, 10);
  return (
    <div className="relative h-full min-h-[86vh] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(45,212,191,0.20),transparent_30%),radial-gradient(circle_at_72%_34%,rgba(59,130,246,0.18),transparent_26%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-40" role="img" aria-label="Animated strategy network">
        <defs>
          <linearGradient id="networkLine" x1="0" x2="1">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((row) => (
          <motion.path
            key={row}
            d={`M${80 + row * 160} ${120 + row * 36} C 420 ${80 + row * 24}, 720 ${360 - row * 28}, 1180 ${180 + row * 46}`}
            stroke="url(#networkLine)"
            strokeWidth="1.2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0.2, 1, 0.2] }}
            transition={{ duration: 10 + row, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
      {cards.map((concept, index) => (
        <motion.div
          key={concept.slug}
          className="absolute hidden w-44 rounded-[8px] border border-white/30 bg-white/55 p-3 text-sm font-semibold opacity-75 shadow-glass backdrop-blur-xl dark:bg-white/10 lg:block"
          style={{
            left: `${54 + (index % 3) * 15}%`,
            top: `${12 + Math.floor(index / 3) * 22 + (index % 2) * 6}%`
          }}
          animate={{ y: [0, -16, 0], rotate: [0, index % 2 ? 2 : -2, 0] }}
          transition={{ duration: 7 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className={`mb-3 h-1.5 w-16 rounded-full bg-gradient-to-r ${concept.accent}`} />
          {concept.shortTitle}
        </motion.div>
      ))}
    </div>
  );
}

const enHomeCopy = {
  navConcepts: "Concepts",
  badge: "10 real-life simulations, all in your browser",
  subtitle: "Learn strategic thinking through interactive visual simulations.",
  promise:
    "Start with an everyday conflict, change one decision, and see the incentives, payoffs, and fairness rule update in front of you.",
  start: "Start exploring",
  try: "Try Prisoner's Dilemma",
  microSteps: ["Pick a scenario", "Move one control", "Read the result"],
  conceptEyebrow: "Concept Library",
  conceptTitle: "Choose a simulation",
  conceptText: "Hover a card, open a module, change a strategy, and watch the incentive structure respond.",
  what: "What is Game Theory?",
  whatTitle: "The study of choices that depend on other choices.",
  whatText:
    "Game theory gives you a language for situations where your best move depends on what someone else might do: splitting rent, setting prices, negotiating, forming teams, matching students to schools, or protecting a shared resource.",
  lenses: [
    ["Payoffs", "What each player gains or loses."],
    ["Incentives", "Why a choice becomes attractive."],
    ["Equilibrium", "When no one wants to change alone."]
  ],
  featured: "Featured Simulation Carousel",
  fast: "Fast paths into the playground",
  glossary: "Glossary"
};

const zhHomeCopy = {
  navConcepts: "概念",
  badge: "10 个真实生活模拟，全部在浏览器中运行",
  subtitle: "通过互动可视化模拟学习策略思维。",
  promise: "从一个熟悉的生活冲突开始，改变一个选择，马上看到激励、收益和公平规则如何变化。",
  start: "开始探索",
  try: "体验囚徒困境",
  microSteps: ["选择场景", "改变策略", "读懂结果"],
  conceptEyebrow: "概念库",
  conceptTitle: "选择一个模拟",
  conceptText: "悬停卡片，打开模块，改变策略，观察激励结构如何响应。",
  what: "什么是博弈论？",
  whatTitle: "研究那些取决于他人选择的选择。",
  whatText:
    "博弈论为策略场景提供语言：分摊房租、设置价格、谈判、组队、学生与学校匹配，或者保护共享资源。",
  lenses: [
    ["收益", "每位参与者得到或失去什么。"],
    ["激励", "为什么某个选择变得有吸引力。"],
    ["均衡", "什么时候没人愿意单独改变。"]
  ],
  featured: "精选模拟轮播",
  fast: "快速进入 Playground",
  glossary: "术语表"
};
