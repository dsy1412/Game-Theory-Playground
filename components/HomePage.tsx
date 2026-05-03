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

export function HomePage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0.4]);

  return (
    <main className="min-h-screen bg-aurora-soft dark:bg-aurora-dark">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-foreground text-background dark:bg-white dark:text-slate-950">
              <BrainCircuit className="h-5 w-5" />
            </span>
            Game Theory Playground
          </Link>
          <div className="flex items-center gap-2">
            <Link href="#concepts" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
              Concepts
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <HeroStrategyScene />
        </motion.div>
        <div className="relative mx-auto grid min-h-[86vh] max-w-7xl content-center px-4 pb-20 pt-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="max-w-4xl"
          >
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur dark:bg-white/10">
              <Sparkles className="h-4 w-4 text-accent" />
              10 real-life simulations, all in your browser
            </p>
            <h1 className="text-balance text-6xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
              Game Theory Playground
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-muted-foreground">
              Learn strategic thinking through interactive visual simulations.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="#concepts">
                  Start exploring
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/concepts/prisoners-dilemma">
                  Try Prisoner’s Dilemma
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="concepts" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Concept Library</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">Choose a simulation</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Hover a card, open a module, change a strategy, and watch the incentive structure respond.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {concepts.map((concept, index) => (
            <ConceptCard key={concept.slug} concept={concept} index={index} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              What is Game Theory?
            </p>
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">The study of choices that depend on other choices.</h2>
          <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">
            Game theory gives you a language for situations where your best move depends on what someone else might do:
            splitting rent, setting prices, negotiating, forming teams, matching students to schools, or protecting a
            shared resource.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Payoffs", "Incentives", "Equilibrium"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[8px] border border-border bg-white/60 p-4 dark:bg-white/5"
              >
                <p className="text-lg font-semibold">{item}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {index === 0 && "What each player gains or loses."}
                  {index === 1 && "Why a choice becomes attractive."}
                  {index === 2 && "When no one wants to change alone."}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
        <ProgressTracker />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Featured Simulation Carousel
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Fast paths into the playground</h2>
          </div>
        </div>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
          {concepts.slice(0, 6).map((concept) => (
            <Link
              key={concept.slug}
              href={`/concepts/${concept.slug}`}
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Glossary</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {glossary.map(([term, definition]) => (
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

function HeroStrategyScene() {
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
          className="absolute hidden w-44 rounded-[8px] border border-white/30 bg-white/55 p-3 text-sm font-semibold shadow-glass backdrop-blur-xl dark:bg-white/10 md:block"
          style={{
            left: `${8 + (index % 5) * 18}%`,
            top: `${16 + Math.floor(index / 5) * 42 + (index % 2) * 8}%`
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
