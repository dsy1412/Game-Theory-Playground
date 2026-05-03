"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  RefreshCcw
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type PointerEvent } from "react";
import { AnimatedCharacter } from "@/components/AnimatedCharacter";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { FormulaPanel } from "@/components/FormulaPanel";
import { PayoffMatrix } from "@/components/PayoffMatrix";
import { ProgressTracker, markConceptVisited } from "@/components/ProgressTracker";
import { ResultCard } from "@/components/ResultCard";
import { SimulationCanvas } from "@/components/SimulationCanvas";
import { StrategySlider } from "@/components/StrategySlider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { D3Heatmap, DragRankingList, TimelineAnimation } from "@/components/visualizations";
import {
  calculateBertrandDemand,
  calculateLocationProfit,
  calculatePrisonersDilemmaPayoff,
  calculateRoomAssignment,
  calculateShapleyValue,
  calculateSubjectiveValue,
  calculateUltimatumOutcome,
  calculateVickreyAuction,
  checkEnvyFree,
  checkStableMatching,
  prisonersPayoffMatrix,
  runGaleShapley,
  simulateCommonsRound,
  type BidTable
} from "@/lib/gameTheory";
import { cakeValuations, initialRentBids, matchingPreferences, players, rooms } from "@/data/concepts";
import type { Concept } from "@/lib/types";
import { cn, formatCurrency, round } from "@/lib/utils";

export function ConceptModule({ concept }: { concept: Concept }) {
  const [mode, setMode] = useState<"beginner" | "advanced">("beginner");

  useEffect(() => {
    markConceptVisited(concept.slug);
  }, [concept.slug]);

  return (
    <main className="min-h-screen bg-aurora-soft dark:bg-aurora-dark">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Playground
          </Link>
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-border bg-white/70 p-1 dark:bg-white/10">
              {(["beginner", "advanced"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setMode(item)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium capitalize transition",
                    mode === item ? "bg-foreground text-background dark:bg-white dark:text-slate-950" : "text-muted-foreground"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Interactive module
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{concept.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{concept.subtitle}</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-6">
            <GlassCard className="p-4 sm:p-5">
              {concept.slug === "split-rent-fairly" && <SplitRentSimulation />}
              {concept.slug === "prisoners-dilemma" && <PrisonersSimulation />}
              {concept.slug === "nash-equilibrium" && <NashSimulation />}
              {concept.slug === "vickrey-auction" && <VickreySimulation />}
              {concept.slug === "envy-free-allocation" && <EnvyFreeSimulation />}
              {concept.slug === "shapley-value" && <ShapleySimulation />}
              {concept.slug === "bertrand-competition" && <BertrandSimulation />}
              {concept.slug === "tragedy-of-the-commons" && <CommonsSimulation />}
              {concept.slug === "ultimatum-game" && <UltimatumSimulation />}
              {concept.slug === "matching-market" && <MatchingSimulation />}
            </GlassCard>
            <div className="grid gap-6 md:grid-cols-2">
              <FormulaPanel formula={concept.formula} interpretation={concept.interpretation} />
              <GlassCard className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Step-by-step Explanation
                </p>
                <ExplanationPanel concept={concept} mode={mode} />
              </GlassCard>
            </div>
          </div>
          <aside className="grid content-start gap-6">
            <ProgressTracker activeSlug={concept.slug} />
            <GlassCard className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Learning Lens</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Watch which incentive changes when you move a control. That single comparison is the heart of strategic
                thinking.
              </p>
            </GlassCard>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="secondary" size="sm" onClick={onClick}>
      <RefreshCcw className="h-4 w-4" />
      Reset simulation
    </Button>
  );
}

function SplitRentSimulation() {
  const [bids, setBids] = useState<BidTable>(initialRentBids);
  const assignment = useMemo(() => calculateRoomAssignment(bids, 1600), [bids]);
  const byRoom = Object.fromEntries(assignment.map((item) => [item.roomId, item]));

  function updateBid(playerId: string, roomId: string, value: number) {
    setBids((current) => ({
      ...current,
      [playerId]: { ...current[playerId], [roomId]: value }
    }));
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Sealed-Bid Room Split</h2>
        <ResetButton onClick={() => setBids(initialRentBids)} />
      </div>
      <SimulationCanvas>
        <div className="grid gap-4 md:grid-cols-3">
          {rooms.map((room, index) => {
            const result = byRoom[room.id];
            const owner = players.find((player) => player.id === result?.ownerId);
            return (
              <motion.div
                key={room.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[8px] border border-border bg-white/75 p-4 shadow-glass dark:bg-white/5"
              >
                <div className="h-28 rounded-[8px] bg-gradient-to-br from-sky-200 via-white to-teal-100 p-3 dark:from-sky-950 dark:via-slate-900 dark:to-teal-950">
                  <div className="h-full rounded-[8px] border border-white/70 bg-white/40 dark:border-white/10 dark:bg-white/5" />
                </div>
                <h3 className="mt-4 font-semibold">{room.name}</h3>
                <p className="text-sm text-muted-foreground">{room.description}</p>
                <div className="mt-4 rounded-[8px] bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Assigned to</p>
                  <p className="font-semibold" style={{ color: owner?.color }}>
                    {owner?.name}
                  </p>
                  <p className="mt-2 text-sm">
                    Rent <AnimatedCounter value={result?.rent ?? 0} prefix="$" />
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </SimulationCanvas>
      <div className="overflow-x-auto rounded-[8px] border border-border bg-white/60 dark:bg-white/5">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3">Roommate</th>
              {rooms.map((room) => (
                <th key={room.id} className="p-3">
                  {room.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="border-b border-border last:border-b-0">
                <td className="p-3 font-semibold">{player.name}</td>
                {rooms.map((room) => {
                  const assigned = byRoom[room.id]?.ownerId === player.id;
                  return (
                    <td key={room.id} className={cn("p-3", assigned && "bg-primary/10")}>
                      <input
                        type="number"
                        min={0}
                        className="w-24 rounded-[8px] border border-border bg-background px-3 py-2"
                        value={bids[player.id][room.id]}
                        onChange={(event) => updateBid(player.id, room.id, Number(event.currentTarget.value))}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {assignment.map((item) => (
          <ResultCard
            key={`${item.ownerId}-${item.roomId}`}
            label={`${players.find((player) => player.id === item.ownerId)?.name} surplus`}
            value={item.surplus}
            prefix="$"
            tone="good"
          />
        ))}
      </div>
    </div>
  );
}

function PrisonersSimulation() {
  const [actionA, setActionA] = useState<"cooperate" | "defect">("cooperate");
  const [actionB, setActionB] = useState<"cooperate" | "defect">("defect");
  const [trust, setTrust] = useState(58);
  const [history, setHistory] = useState<string[]>(["Round 1: choose actions"]);
  const result = calculatePrisonersDilemmaPayoff(actionA, actionB);

  function playRound() {
    setTrust((current) => {
      const next = calculatePrisonersDilemmaPayoff(actionA, actionB);
      const updated = actionA === "cooperate" && actionB === "cooperate" ? current + 14 : current - (next.payoffA + next.payoffB <= -6 ? 20 : 12);
      return Math.max(0, Math.min(100, updated));
    });
    setHistory((items) => [...items.slice(-4), `${result.label}: ${result.payoffA}, ${result.payoffB}`]);
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Takeout Interrogation</h2>
        <ResetButton
          onClick={() => {
            setActionA("cooperate");
            setActionB("defect");
            setTrust(58);
            setHistory(["Round 1: choose actions"]);
          }}
        />
      </div>
      <SimulationCanvas>
        <div className="grid h-full content-center gap-6 md:grid-cols-[1fr_1.2fr_1fr]">
          <AnimatedCharacter name="Roommate A" mood={result.payoffA >= -1 ? "happy" : "worried"} color="#2563eb" />
          <div className="grid content-center gap-4">
            <PayoffMatrix
              matrix={prisonersPayoffMatrix()}
              highlight={{
                rowStrategy: actionA === "cooperate" ? "Cooperate" : "Defect",
                columnStrategy: actionB === "cooperate" ? "Cooperate" : "Defect"
              }}
            />
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Trust score</span>
                <span>{trust}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <motion.div className="h-full bg-accent" animate={{ width: `${trust}%` }} />
              </div>
            </div>
          </div>
          <AnimatedCharacter name="Roommate B" mood={result.payoffB >= -1 ? "happy" : "worried"} color="#db2777" />
        </div>
      </SimulationCanvas>
      <div className="grid gap-4 md:grid-cols-2">
        <ChoiceGroup label="A action" value={actionA} onChange={setActionA} />
        <ChoiceGroup label="B action" value={actionB} onChange={setActionB} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={playRound}>
          <Play className="h-4 w-4" />
          Play repeated round
        </Button>
        <ResultCard label="A payoff" value={result.payoffA} tone={result.payoffA >= -1 ? "good" : "danger"} />
        <ResultCard label="B payoff" value={result.payoffB} tone={result.payoffB >= -1 ? "good" : "danger"} />
      </div>
      <TimelineAnimation steps={history} />
    </div>
  );
}

function ChoiceGroup({
  label,
  value,
  onChange
}: {
  label: string;
  value: "cooperate" | "defect";
  onChange: (value: "cooperate" | "defect") => void;
}) {
  return (
    <div className="rounded-[8px] border border-border bg-white/60 p-3 dark:bg-white/5">
      <p className="mb-2 text-sm font-semibold">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {(["cooperate", "defect"] as const).map((item) => (
          <Button key={item} variant={value === item ? "primary" : "secondary"} onClick={() => onChange(item)}>
            {item === "cooperate" ? "Stay silent" : "Betray"}
          </Button>
        ))}
      </div>
    </div>
  );
}

function NashSimulation() {
  const [shopA, setShopA] = useState({ x: 0.36, y: 0.46 });
  const [shopB, setShopB] = useState({ x: 0.64, y: 0.48 });
  const [dragging, setDragging] = useState<"a" | "b" | null>(null);
  const heat = useMemo(
    () =>
      Array.from({ length: 18 }, (_, y) =>
        Array.from({ length: 18 }, (_, x) => {
          const px = x / 17;
          const py = y / 17;
          return Math.round(90 * Math.exp(-Math.hypot(px - 0.5, py - 0.46) * 3.4) + 20 * (1 - py));
        })
      ),
    []
  );
  const density = (point: { x: number; y: number }) =>
    90 * Math.exp(-Math.hypot(point.x - 0.5, point.y - 0.46) * 3.4) + 20 * (1 - point.y);
  const profitA = calculateLocationProfit(shopA, shopB, density);
  const profitB = calculateLocationProfit(shopB, shopA, density);
  const closeToEquilibrium = Math.abs(shopA.x - shopB.x) < 0.12 && Math.abs(shopA.y - shopB.y) < 0.12;

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const next = {
      x: Math.min(0.95, Math.max(0.05, (event.clientX - rect.left) / rect.width)),
      y: Math.min(0.92, Math.max(0.08, (event.clientY - rect.top) / rect.height))
    };
    if (dragging === "a") setShopA(next);
    if (dragging === "b") setShopB(next);
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Milk Tea Location Game</h2>
        <ResetButton
          onClick={() => {
            setShopA({ x: 0.36, y: 0.46 });
            setShopB({ x: 0.64, y: 0.48 });
          }}
        />
      </div>
      <SimulationCanvas className="p-0">
        <div
          className="relative h-[480px] touch-none"
          onPointerMove={move}
          onPointerUp={() => setDragging(null)}
          onPointerLeave={() => setDragging(null)}
        >
          <D3Heatmap values={heat} className="absolute inset-0 h-full w-full opacity-80" active={{ x: 0.5, y: 0.46 }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(255,255,255,0.62))] dark:bg-[radial-gradient(circle_at_center,transparent,rgba(2,6,23,0.55))]" />
          {[
            ["a", shopA, "Shop A", "#2563eb"],
            ["b", shopB, "Shop B", "#db2777"]
          ].map(([id, shop, label, color]) => (
            <motion.button
              key={id as string}
              type="button"
              className="absolute grid h-16 w-16 place-items-center rounded-full border-2 border-white text-xs font-bold text-white shadow-glow"
              style={{
                left: `${(shop as typeof shopA).x * 100}%`,
                top: `${(shop as typeof shopA).y * 100}%`,
                backgroundColor: color as string,
                transform: "translate(-50%, -50%)"
              }}
              animate={{ scale: closeToEquilibrium ? [1, 1.08, 1] : 1 }}
              transition={{ duration: 1.4, repeat: closeToEquilibrium ? Infinity : 0 }}
              onPointerDown={() => setDragging(id as "a" | "b")}
            >
              {label as string}
            </motion.button>
          ))}
          {closeToEquilibrium ? (
            <div className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full border border-emerald-400/50 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-700 backdrop-blur dark:text-emerald-200">
              Nash-like point: no one wants to move alone
            </div>
          ) : null}
        </div>
      </SimulationCanvas>
      <div className="grid gap-3 md:grid-cols-3">
        <ResultCard label="Shop A profit" value={profitA} tone={profitA >= profitB ? "good" : "neutral"} />
        <ResultCard label="Shop B profit" value={profitB} tone={profitB >= profitA ? "good" : "neutral"} />
        <ResultCard label="Equilibrium signal" value={closeToEquilibrium ? "Glowing" : "Keep dragging"} tone={closeToEquilibrium ? "good" : "warn"} />
      </div>
    </div>
  );
}

function VickreySimulation() {
  const [bidA, setBidA] = useState(720);
  const [bidB, setBidB] = useState(640);
  const [bidC, setBidC] = useState(580);
  const bids = [
    { bidderId: "Ava", amount: bidA },
    { bidderId: "Ben", amount: bidB },
    { bidderId: "Chloe", amount: bidC }
  ];
  const result = calculateVickreyAuction(bids);
  const max = Math.max(...bids.map((bid) => bid.amount));

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Second-Price Room Auction</h2>
        <ResetButton
          onClick={() => {
            setBidA(720);
            setBidB(640);
            setBidC(580);
          }}
        />
      </div>
      <SimulationCanvas>
        <div className="grid h-full content-center gap-5">
          {bids.map((bid) => (
            <div key={bid.bidderId} className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">{bid.bidderId}</span>
                <span>{formatCurrency(bid.amount)}</span>
              </div>
              <div className="relative h-12 overflow-hidden rounded-[8px] bg-muted">
                <motion.div
                  className={cn("h-full rounded-[8px] bg-primary", result.winner.bidderId === bid.bidderId && "bg-accent")}
                  animate={{ width: `${(bid.amount / max) * 100}%` }}
                />
                {result.payment === bid.amount && (
                  <div className="absolute inset-y-0 right-0 grid place-items-center px-3 text-xs font-semibold">
                    second price
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SimulationCanvas>
      <div className="grid gap-4 md:grid-cols-3">
        <StrategySlider label="Ava bid" min={100} max={1000} value={bidA} prefix="$" onChange={setBidA} />
        <StrategySlider label="Ben bid" min={100} max={1000} value={bidB} onChange={setBidB} />
        <StrategySlider label="Chloe bid" min={100} max={1000} value={bidC} onChange={setBidC} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <ResultCard label="Winner" value={result.winner.bidderId} tone="good" />
        <ResultCard label="Pays second-highest bid" value={result.payment} prefix="$" tone="good" />
      </div>
    </div>
  );
}

function EnvyFreeSimulation() {
  const [cut1, setCut1] = useState(34);
  const [cut2, setCut2] = useState(68);
  const sorted = [Math.min(cut1, cut2), Math.max(cut1, cut2)];
  const allocation = {
    Ava: { start: 0, end: sorted[0] / 100 },
    Ben: { start: sorted[0] / 100, end: sorted[1] / 100 },
    Chloe: { start: sorted[1] / 100, end: 1 }
  };
  const envy = checkEnvyFree(allocation, cakeValuations);
  const heat = useMemo(
    () => [
      Array.from({ length: 30 }, (_, index) => {
        const t = index / 29;
        return Math.round(70 * Math.max(0, 1 - Math.abs(t - 0.2) * 3) + 80 * Math.max(0, 1 - Math.abs(t - 0.52) * 4) + 75 * Math.max(0, 1 - Math.abs(t - 0.82) * 5));
      })
    ],
    []
  );

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Cake Cut Fairness</h2>
        <ResetButton
          onClick={() => {
            setCut1(34);
            setCut2(68);
          }}
        />
      </div>
      <SimulationCanvas>
        <div className="grid h-full content-center gap-8">
          <div className="relative h-40 overflow-hidden rounded-[8px] border border-border bg-white dark:bg-white/10">
            <D3Heatmap values={heat} className="absolute inset-0 h-full w-full" />
            {sorted.map((cut) => (
              <motion.div
                key={cut}
                className="absolute top-0 h-full w-1 rounded-full bg-slate-950 shadow-xl dark:bg-white"
                animate={{ left: `${cut}%` }}
              />
            ))}
            <div className="absolute inset-0 grid grid-cols-3 text-center text-sm font-semibold text-slate-950">
              <div className="grid place-items-center bg-white/10">Cream</div>
              <div className="grid place-items-center bg-white/10">Chocolate</div>
              <div className="grid place-items-center bg-white/10">Fruit</div>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {Object.keys(allocation).map((person) => (
              <ResultCard
                key={person}
                label={`${person}'s own value`}
                value={round(calculateSubjectiveValue(cakeValuations[person as keyof typeof cakeValuations], allocation[person as keyof typeof allocation]) * 100, 0)}
                tone="neutral"
              />
            ))}
          </div>
        </div>
      </SimulationCanvas>
      <div className="grid gap-4 md:grid-cols-2">
        <StrategySlider label="Cut line 1" min={10} max={90} value={cut1} suffix="%" onChange={setCut1} />
        <StrategySlider label="Cut line 2" min={10} max={90} value={cut2} suffix="%" onChange={setCut2} />
      </div>
      <ResultCard
        label="Envy-free check"
        value={envy.envyFree ? "No envy detected" : `${envy.envyPairs.length} envy warning${envy.envyPairs.length > 1 ? "s" : ""}`}
        tone={envy.envyFree ? "good" : "warn"}
      />
    </div>
  );
}

function ShapleySimulation() {
  const playersList = ["Ava", "Ben", "Chloe"];
  const [active, setActive] = useState(0);
  const valueFunction = (coalition: string[]) => {
    const set = new Set(coalition);
    let value = 0;
    if (set.has("Ava")) value += 260;
    if (set.has("Ben")) value += 210;
    if (set.has("Chloe")) value += 180;
    if (set.has("Ava") && set.has("Ben")) value += 150;
    if (set.has("Ava") && set.has("Chloe")) value += 110;
    if (set.has("Ben") && set.has("Chloe")) value += 90;
    return Math.min(1000, value);
  };
  const shapley = calculateShapleyValue(playersList, valueFunction);
  const orders = useMemo(() => [["Ava", "Ben", "Chloe"], ["Ava", "Chloe", "Ben"], ["Ben", "Ava", "Chloe"], ["Ben", "Chloe", "Ava"], ["Chloe", "Ava", "Ben"], ["Chloe", "Ben", "Ava"]], []);
  const order = orders[active % orders.length];

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Project Credit Split</h2>
        <ResetButton onClick={() => setActive(0)} />
      </div>
      <SimulationCanvas>
        <div className="grid h-full content-center gap-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {order.map((player, index) => (
              <motion.div
                key={`${player}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[8px] border border-border bg-white/75 p-5 text-center shadow-glass dark:bg-white/5"
              >
                <p className="text-xs text-muted-foreground">joins #{index + 1}</p>
                <p className="mt-2 text-xl font-semibold">{player}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  coalition value {formatCurrency(valueFunction(order.slice(0, index + 1)))}
                </p>
              </motion.div>
            ))}
          </div>
          <TimelineAnimation steps={orders.map((item) => item.join(" -> "))} activeIndex={active} />
        </div>
      </SimulationCanvas>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setActive((current) => (current + 1) % orders.length)}>
          <Play className="h-4 w-4" />
          Animate next order
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {Object.entries(shapley).map(([player, value]) => (
          <ResultCard key={player} label={`${player} fair payment`} value={value} prefix="$" tone="good" />
        ))}
      </div>
    </div>
  );
}

function BertrandSimulation() {
  const [priceA, setPriceA] = useState(4);
  const [priceB, setPriceB] = useState(5);
  const cost = 2;
  const demand = calculateBertrandDemand(priceA, priceB);
  const profitA = calculateBertrandDemand(priceA, priceB).demandA;
  const profitB = calculateBertrandDemand(priceA, priceB).demandB;
  const storeAProfit = (priceA - cost) * profitA;
  const storeBProfit = (priceB - cost) * profitB;

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Cola Price War</h2>
        <ResetButton
          onClick={() => {
            setPriceA(4);
            setPriceB(5);
          }}
        />
      </div>
      <SimulationCanvas>
        <div className="grid h-full content-center gap-6 md:grid-cols-2">
          {[
            ["Store A", priceA, demand.demandA, storeAProfit, "#2563eb"],
            ["Store B", priceB, demand.demandB, storeBProfit, "#db2777"]
          ].map(([name, price, quantity, profit, color]) => (
            <div key={name as string} className="rounded-[8px] border border-border bg-white/70 p-5 dark:bg-white/5">
              <p className="text-lg font-semibold">{name}</p>
              <p className="mt-2 text-sm text-muted-foreground">Price ${price}</p>
              <div className="mt-5 flex h-20 items-end gap-1">
                {Array.from({ length: Math.round((quantity as number) / 8) }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: -12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="h-8 w-3 rounded-full"
                    style={{ backgroundColor: color as string }}
                  />
                ))}
              </div>
              <p className="mt-4 text-2xl font-semibold">
                <AnimatedCounter value={profit as number} prefix="$" />
              </p>
            </div>
          ))}
        </div>
      </SimulationCanvas>
      <div className="grid gap-4 md:grid-cols-2">
        <StrategySlider label="Store A price" min={2} max={8} value={priceA} prefix="$" onChange={setPriceA} />
        <StrategySlider label="Store B price" min={2} max={8} value={priceB} prefix="$" onChange={setPriceB} />
      </div>
      <ResultCard
        label="Price war signal"
        value={priceA === cost && priceB === cost ? "At marginal cost" : priceA === priceB ? "Split market" : "Cheaper store wins"}
        tone={priceA === cost && priceB === cost ? "warn" : "neutral"}
      />
    </div>
  );
}

function CommonsSimulation() {
  const [usage, setUsage] = useState([8, 8, 8]);
  const [resource, setResource] = useState(82);
  const [history, setHistory] = useState<string[]>(["Pond starts healthy"]);
  const round = simulateCommonsRound(usage, resource, 18);

  function play() {
    setResource(round.nextResource);
    setHistory((items) => [
      ...items.slice(-4),
      `Usage ${round.totalUsage}, resource ${Math.round(round.nextResource)}`
    ]);
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Shared Pond</h2>
        <ResetButton
          onClick={() => {
            setUsage([8, 8, 8]);
            setResource(82);
            setHistory(["Pond starts healthy"]);
          }}
        />
      </div>
      <SimulationCanvas>
        <div className="grid h-full content-center gap-6">
          <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full border border-cyan-300/50 bg-cyan-100 dark:bg-cyan-950">
            <motion.div
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyan-500 to-teal-300"
              animate={{ height: `${resource}%` }}
            />
            <div className="absolute inset-0 grid place-items-center text-4xl font-semibold text-white drop-shadow">
              <AnimatedCounter value={resource} suffix="%" />
            </div>
          </div>
          {round.collapsed ? (
            <div className="mx-auto rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">Collapse warning</div>
          ) : null}
        </div>
      </SimulationCanvas>
      <div className="grid gap-4 md:grid-cols-3">
        {usage.map((value, index) => (
          <StrategySlider
            key={index}
            label={`Player ${index + 1} usage`}
            min={0}
            max={18}
            value={value}
            onChange={(next) => setUsage((items) => items.map((item, itemIndex) => (itemIndex === index ? next : item)))}
          />
        ))}
      </div>
      <Button onClick={play}>
        <Play className="h-4 w-4" />
        Simulate round
      </Button>
      <div className="grid gap-3 md:grid-cols-3">
        {round.payoffs.map((payoff, index) => (
          <ResultCard key={index} label={`Player ${index + 1} gain`} value={payoff} tone="neutral" />
        ))}
      </div>
      <TimelineAnimation steps={history} />
    </div>
  );
}

function UltimatumSimulation() {
  const [offer, setOffer] = useState(35);
  const [threshold, setThreshold] = useState(30);
  const outcome = calculateUltimatumOutcome(100, offer, threshold);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Split $100</h2>
        <ResetButton
          onClick={() => {
            setOffer(35);
            setThreshold(30);
          }}
        />
      </div>
      <SimulationCanvas>
        <div className="grid h-full content-center gap-8">
          <div className="mx-auto flex w-full max-w-xl overflow-hidden rounded-[8px] border border-border text-center text-white shadow-glass">
            <motion.div className="bg-primary p-6" animate={{ width: `${100 - offer}%` }}>
              A keeps ${100 - offer}
            </motion.div>
            <motion.div className="bg-accent p-6" animate={{ width: `${offer}%` }}>
              B gets ${offer}
            </motion.div>
          </div>
          <motion.div
            animate={{ rotate: outcome.accepted ? 0 : [-2, 2, -2, 0], scale: outcome.accepted ? 1 : [1, 1.04, 1] }}
            className={cn(
              "mx-auto rounded-[8px] border-2 px-8 py-4 text-2xl font-black uppercase tracking-[0.2em]",
              outcome.accepted ? "border-emerald-500 text-emerald-600" : "border-red-500 text-red-600"
            )}
          >
            {outcome.accepted ? "Accepted" : "Rejected"}
          </motion.div>
        </div>
      </SimulationCanvas>
      <div className="grid gap-4 md:grid-cols-2">
        <StrategySlider label="Offer to B" min={0} max={100} value={offer} prefix="$" onChange={setOffer} />
        <StrategySlider label="B fairness threshold" min={0} max={60} value={threshold} prefix="$" onChange={setThreshold} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <ResultCard label="Rational model" value={outcome.acceptsRationally ? "Accepts" : "Rejects"} tone="neutral" />
        <ResultCard label="Human fairness model" value={outcome.acceptsBehaviorally ? "Accepts" : "Rejects"} tone={outcome.accepted ? "good" : "danger"} />
      </div>
    </div>
  );
}

function MatchingSimulation() {
  const [minaRanking, setMinaRanking] = useState(matchingPreferences.proposers[0].rankings);
  const preferences = {
    ...matchingPreferences,
    proposers: [
      { ...matchingPreferences.proposers[0], rankings: minaRanking },
      ...matchingPreferences.proposers.slice(1)
    ]
  };
  const result = runGaleShapley(
    preferences.proposers.map((item) => item.id),
    preferences.receivers.map((item) => item.id),
    preferences
  );
  const stable = checkStableMatching(result.matches, preferences);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Deferred Acceptance</h2>
        <ResetButton onClick={() => setMinaRanking(matchingPreferences.proposers[0].rankings)} />
      </div>
      <SimulationCanvas>
        <div className="grid h-full content-center gap-5 md:grid-cols-[1fr_1.2fr_1fr]">
          <div className="grid gap-3">
            {preferences.proposers.map((item) => (
              <div key={item.id} className="rounded-[8px] border border-border bg-white/70 p-3 font-semibold dark:bg-white/5">
                {item.id}
              </div>
            ))}
          </div>
          <div className="grid content-center gap-2">
            {result.matches.map((match, index) => (
              <motion.div
                key={`${match.proposer}-${match.receiver}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.12 }}
                className="origin-left rounded-full bg-primary/70 px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
              >
                {match.proposer} &rarr; {match.receiver}
              </motion.div>
            ))}
          </div>
          <div className="grid gap-3">
            {preferences.receivers.map((item) => (
              <div key={item.id} className="rounded-[8px] border border-border bg-white/70 p-3 font-semibold dark:bg-white/5">
                {item.id}
              </div>
            ))}
          </div>
        </div>
      </SimulationCanvas>
      <div className="grid gap-4 md:grid-cols-2">
        <DragRankingList title="Drag Mina's school ranking" items={minaRanking} onChange={setMinaRanking} />
        <TimelineAnimation steps={result.steps.slice(0, 7).map((step) => step.message)} />
      </div>
      <ResultCard label="Stable matching check" value={stable ? "Stable" : "Blocking pair found"} tone={stable ? "good" : "warn"} />
    </div>
  );
}
