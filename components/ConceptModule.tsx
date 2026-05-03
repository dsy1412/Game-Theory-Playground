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
import { zhRooms } from "@/data/zh";
import type { Concept } from "@/lib/types";
import { cn, formatCurrency, round } from "@/lib/utils";

type Locale = "en" | "zh";

export function ConceptModule({
  concept,
  locale = "en"
}: {
  concept: Concept;
  locale?: "en" | "zh";
}) {
  const isZh = locale === "zh";
  const copy = isZh
    ? {
        back: "Playground",
        module: "互动模块",
        switchLabel: "English",
        switchHref: `/concepts/${concept.slug}`,
        step: "分步解释",
        lens: "学习视角",
        lensText: "移动控件时，观察哪个激励先发生变化。这个单点比较，就是策略思维的核心。"
      }
    : {
        back: "Playground",
        module: "Interactive module",
        switchLabel: "中文版",
        switchHref: `/zh/concepts/${concept.slug}`,
        step: "Step-by-step Explanation",
        lens: "Learning Lens",
        lensText:
          "Watch which incentive changes when you move a control. That single comparison is the heart of strategic thinking."
      };

  useEffect(() => {
    markConceptVisited(concept.slug);
  }, [concept.slug]);

  return (
    <main className="min-h-screen bg-aurora-soft dark:bg-aurora-dark">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href={isZh ? "/zh" : "/"} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {copy.back}
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href={copy.switchHref}>{copy.switchLabel}</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {copy.module}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{concept.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{concept.subtitle}</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-6">
            <GlassCard className="p-4 sm:p-5">
              {concept.slug === "split-rent-fairly" && <SplitRentSimulation locale={locale} />}
              {concept.slug === "prisoners-dilemma" && <PrisonersSimulation locale={locale} />}
              {concept.slug === "nash-equilibrium" && <NashSimulation locale={locale} />}
              {concept.slug === "vickrey-auction" && <VickreySimulation locale={locale} />}
              {concept.slug === "envy-free-allocation" && <EnvyFreeSimulation locale={locale} />}
              {concept.slug === "shapley-value" && <ShapleySimulation locale={locale} />}
              {concept.slug === "bertrand-competition" && <BertrandSimulation locale={locale} />}
              {concept.slug === "tragedy-of-the-commons" && <CommonsSimulation locale={locale} />}
              {concept.slug === "ultimatum-game" && <UltimatumSimulation locale={locale} />}
              {concept.slug === "matching-market" && <MatchingSimulation locale={locale} />}
            </GlassCard>
            <div className="grid gap-6 md:grid-cols-2">
              <FormulaPanel formula={concept.formula} interpretation={concept.interpretation} locale={locale} />
              <GlassCard className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {copy.step}
                </p>
                <ExplanationPanel concept={concept} locale={locale} />
              </GlassCard>
            </div>
          </div>
          <aside className="grid content-start gap-6">
            <ProgressTracker activeSlug={concept.slug} locale={locale} />
            <GlassCard className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy.lens}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {copy.lensText}
              </p>
            </GlassCard>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ResetButton({ onClick, locale = "en" }: { onClick: () => void; locale?: Locale }) {
  return (
    <Button variant="secondary" size="sm" onClick={onClick}>
      <RefreshCcw className="h-4 w-4" />
      {locale === "zh" ? "重置模拟" : "Reset simulation"}
    </Button>
  );
}

const simText = {
  en: {
    splitTitle: "Sealed-Bid Room Split",
    assignedTo: "Assigned to",
    rent: "Rent",
    roommate: "Roommate",
    surplus: "surplus",
    prisonersTitle: "Takeout Interrogation",
    trust: "Trust score",
    playRound: "Play repeated round",
    actionA: "A action",
    actionB: "B action",
    silent: "Stay silent",
    betray: "Betray",
    nashTitle: "Milk Tea Location Game",
    equilibrium: "Nash-like point: no one wants to move alone",
    shopAProfit: "Shop A profit",
    shopBProfit: "Shop B profit",
    signal: "Equilibrium signal",
    glowing: "Glowing",
    keepDragging: "Keep dragging",
    vickreyTitle: "Second-Price Room Auction",
    secondPrice: "second price",
    winner: "Winner",
    pays: "Pays second-highest bid",
    envyTitle: "Cake Cut Fairness",
    cream: "Cream",
    chocolate: "Chocolate",
    fruit: "Fruit",
    ownValue: "own value",
    cut1: "Cut line 1",
    cut2: "Cut line 2",
    envyCheck: "Envy-free check",
    noEnvy: "No envy detected",
    warnings: "envy warnings",
    shapleyTitle: "Project Credit Split",
    joins: "joins",
    coalitionValue: "coalition value",
    nextOrder: "Animate next order",
    fairPayment: "fair payment",
    bertrandTitle: "Cola Price War",
    price: "Price",
    storeAPrice: "Store A price",
    storeBPrice: "Store B price",
    priceWar: "Price war signal",
    atCost: "At marginal cost",
    splitMarket: "Split market",
    cheaperWins: "Cheaper store wins",
    commonsTitle: "Shared Pond",
    pondStarts: "Pond starts healthy",
    collapse: "Collapse warning",
    usage: "usage",
    simulateRound: "Simulate round",
    gain: "gain",
    resource: "resource",
    ultimatumTitle: "Split $100",
    keeps: "A keeps",
    gets: "B gets",
    accepted: "Accepted",
    rejected: "Rejected",
    offerToB: "Offer to B",
    threshold: "B fairness threshold",
    rational: "Rational model",
    fairness: "Human fairness model",
    accepts: "Accepts",
    rejects: "Rejects",
    matchingTitle: "Deferred Acceptance",
    dragRanking: "Drag Mina's school ranking",
    stableCheck: "Stable matching check",
    stable: "Stable",
    blocking: "Blocking pair found"
  },
  zh: {
    splitTitle: "密封报价分房租",
    assignedTo: "分配给",
    rent: "租金",
    roommate: "室友",
    surplus: "剩余",
    prisonersTitle: "外卖事件审问",
    trust: "信任分数",
    playRound: "进行一轮重复博弈",
    actionA: "A 的选择",
    actionB: "B 的选择",
    silent: "保持沉默",
    betray: "背叛",
    nashTitle: "奶茶店选址博弈",
    equilibrium: "接近纳什均衡：没人愿意单独移动",
    shopAProfit: "店铺 A 收益",
    shopBProfit: "店铺 B 收益",
    signal: "均衡信号",
    glowing: "正在发光",
    keepDragging: "继续拖动",
    vickreyTitle: "二价房间拍卖",
    secondPrice: "第二高价",
    winner: "获胜者",
    pays: "支付第二高报价",
    envyTitle: "蛋糕切分公平性",
    cream: "奶油",
    chocolate: "巧克力",
    fruit: "水果",
    ownValue: "主观价值",
    cut1: "切线 1",
    cut2: "切线 2",
    envyCheck: "无嫉妒检查",
    noEnvy: "没有检测到嫉妒",
    warnings: "个嫉妒提醒",
    shapleyTitle: "项目贡献分配",
    joins: "第",
    coalitionValue: "联盟价值",
    nextOrder: "播放下一个加入顺序",
    fairPayment: "公平报酬",
    bertrandTitle: "可乐价格战",
    price: "价格",
    storeAPrice: "店铺 A 价格",
    storeBPrice: "店铺 B 价格",
    priceWar: "价格战信号",
    atCost: "已到边际成本",
    splitMarket: "平分市场",
    cheaperWins: "低价店获胜",
    commonsTitle: "共享鱼塘",
    pondStarts: "鱼塘一开始很健康",
    collapse: "崩塌警告",
    usage: "使用量",
    simulateRound: "模拟一轮",
    gain: "收益",
    resource: "资源",
    ultimatumTitle: "分配 100 美元",
    keeps: "A 保留",
    gets: "B 获得",
    accepted: "接受",
    rejected: "拒绝",
    offerToB: "给 B 的金额",
    threshold: "B 的公平底线",
    rational: "理性模型",
    fairness: "人类公平模型",
    accepts: "接受",
    rejects: "拒绝",
    matchingTitle: "延迟接受算法",
    dragRanking: "拖动 Mina 的学校偏好",
    stableCheck: "稳定匹配检查",
    stable: "稳定",
    blocking: "存在阻塞配对"
  }
} as const;

function SplitRentSimulation({ locale = "en" }: { locale?: Locale }) {
  const t = simText[locale];
  const activeRooms = locale === "zh" ? zhRooms : rooms;
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
        <h2 className="text-2xl font-semibold">{t.splitTitle}</h2>
        <ResetButton locale={locale} onClick={() => setBids(initialRentBids)} />
      </div>
      <SimulationCanvas>
        <div className="grid gap-4 md:grid-cols-3">
          {activeRooms.map((room, index) => {
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
                  <p className="text-xs text-muted-foreground">{t.assignedTo}</p>
                  <p className="font-semibold" style={{ color: owner?.color }}>
                    {owner?.name}
                  </p>
                  <p className="mt-2 text-sm">
                    {t.rent} <AnimatedCounter value={result?.rent ?? 0} prefix="$" />
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
              <th className="p-3">{t.roommate}</th>
              {activeRooms.map((room) => (
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
                {activeRooms.map((room) => {
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
            label={`${players.find((player) => player.id === item.ownerId)?.name} ${t.surplus}`}
            value={item.surplus}
            prefix="$"
            tone="good"
          />
        ))}
      </div>
    </div>
  );
}

function PrisonersSimulation({ locale = "en" }: { locale?: Locale }) {
  const t = simText[locale];
  const [actionA, setActionA] = useState<"cooperate" | "defect">("cooperate");
  const [actionB, setActionB] = useState<"cooperate" | "defect">("defect");
  const [trust, setTrust] = useState(58);
  const [history, setHistory] = useState<string[]>([locale === "zh" ? "第 1 轮：请选择行动" : "Round 1: choose actions"]);
  const result = calculatePrisonersDilemmaPayoff(actionA, actionB);
  const matrix = prisonersPayoffMatrix().map((cell) =>
    locale === "zh"
      ? {
          ...cell,
          rowStrategy: cell.rowStrategy === "Cooperate" ? "沉默" : "背叛",
          columnStrategy: cell.columnStrategy === "Cooperate" ? "沉默" : "背叛"
        }
      : cell
  );

  function playRound() {
    setTrust((current) => {
      const next = calculatePrisonersDilemmaPayoff(actionA, actionB);
      const updated = actionA === "cooperate" && actionB === "cooperate" ? current + 14 : current - (next.payoffA + next.payoffB <= -6 ? 20 : 12);
      return Math.max(0, Math.min(100, updated));
    });
    setHistory((items) => [
      ...items.slice(-4),
      locale === "zh" ? `本轮收益：${result.payoffA}, ${result.payoffB}` : `${result.label}: ${result.payoffA}, ${result.payoffB}`
    ]);
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">{t.prisonersTitle}</h2>
        <ResetButton
          locale={locale}
          onClick={() => {
            setActionA("cooperate");
            setActionB("defect");
            setTrust(58);
            setHistory([locale === "zh" ? "第 1 轮：请选择行动" : "Round 1: choose actions"]);
          }}
        />
      </div>
      <SimulationCanvas>
        <div className="grid h-full content-center gap-6 md:grid-cols-[1fr_1.2fr_1fr]">
          <AnimatedCharacter name={locale === "zh" ? "室友 A" : "Roommate A"} mood={result.payoffA >= -1 ? "happy" : "worried"} color="#2563eb" />
          <div className="grid content-center gap-4">
            <PayoffMatrix
              matrix={matrix}
              highlight={{
                rowStrategy: actionA === "cooperate" ? (locale === "zh" ? "沉默" : "Cooperate") : (locale === "zh" ? "背叛" : "Defect"),
                columnStrategy: actionB === "cooperate" ? (locale === "zh" ? "沉默" : "Cooperate") : (locale === "zh" ? "背叛" : "Defect")
              }}
            />
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>{t.trust}</span>
                <span>{trust}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <motion.div className="h-full bg-accent" animate={{ width: `${trust}%` }} />
              </div>
            </div>
          </div>
          <AnimatedCharacter name={locale === "zh" ? "室友 B" : "Roommate B"} mood={result.payoffB >= -1 ? "happy" : "worried"} color="#db2777" />
        </div>
      </SimulationCanvas>
      <div className="grid gap-4 md:grid-cols-2">
        <ChoiceGroup label={t.actionA} value={actionA} onChange={setActionA} locale={locale} />
        <ChoiceGroup label={t.actionB} value={actionB} onChange={setActionB} locale={locale} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={playRound}>
          <Play className="h-4 w-4" />
          {t.playRound}
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
  onChange,
  locale = "en"
}: {
  label: string;
  value: "cooperate" | "defect";
  onChange: (value: "cooperate" | "defect") => void;
  locale?: Locale;
}) {
  const t = simText[locale];
  return (
    <div className="rounded-[8px] border border-border bg-white/60 p-3 dark:bg-white/5">
      <p className="mb-2 text-sm font-semibold">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {(["cooperate", "defect"] as const).map((item) => (
          <Button key={item} variant={value === item ? "primary" : "secondary"} onClick={() => onChange(item)}>
            {item === "cooperate" ? t.silent : t.betray}
          </Button>
        ))}
      </div>
    </div>
  );
}

function NashSimulation({ locale = "en" }: { locale?: Locale }) {
  const t = simText[locale];
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
        <h2 className="text-2xl font-semibold">{t.nashTitle}</h2>
        <ResetButton
          locale={locale}
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
            ["a", shopA, locale === "zh" ? "店铺 A" : "Shop A", "#2563eb"],
            ["b", shopB, locale === "zh" ? "店铺 B" : "Shop B", "#db2777"]
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
              {t.equilibrium}
            </div>
          ) : null}
        </div>
      </SimulationCanvas>
      <div className="grid gap-3 md:grid-cols-3">
        <ResultCard label={t.shopAProfit} value={profitA} tone={profitA >= profitB ? "good" : "neutral"} />
        <ResultCard label={t.shopBProfit} value={profitB} tone={profitB >= profitA ? "good" : "neutral"} />
        <ResultCard label={t.signal} value={closeToEquilibrium ? t.glowing : t.keepDragging} tone={closeToEquilibrium ? "good" : "warn"} />
      </div>
    </div>
  );
}

function VickreySimulation({ locale = "en" }: { locale?: Locale }) {
  const t = simText[locale];
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
        <h2 className="text-2xl font-semibold">{t.vickreyTitle}</h2>
        <ResetButton
          locale={locale}
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
                    {t.secondPrice}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SimulationCanvas>
      <div className="grid gap-4 md:grid-cols-3">
        <StrategySlider label={locale === "zh" ? "Ava 报价" : "Ava bid"} min={100} max={1000} value={bidA} prefix="$" onChange={setBidA} />
        <StrategySlider label={locale === "zh" ? "Ben 报价" : "Ben bid"} min={100} max={1000} value={bidB} prefix="$" onChange={setBidB} />
        <StrategySlider label={locale === "zh" ? "Chloe 报价" : "Chloe bid"} min={100} max={1000} value={bidC} prefix="$" onChange={setBidC} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <ResultCard label={t.winner} value={result.winner.bidderId} tone="good" />
        <ResultCard label={t.pays} value={result.payment} prefix="$" tone="good" />
      </div>
    </div>
  );
}

function EnvyFreeSimulation({ locale = "en" }: { locale?: Locale }) {
  const t = simText[locale];
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
        <h2 className="text-2xl font-semibold">{t.envyTitle}</h2>
        <ResetButton
          locale={locale}
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
              <div className="grid place-items-center bg-white/10">{t.cream}</div>
              <div className="grid place-items-center bg-white/10">{t.chocolate}</div>
              <div className="grid place-items-center bg-white/10">{t.fruit}</div>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {Object.keys(allocation).map((person) => (
              <ResultCard
                key={person}
                label={`${person} ${t.ownValue}`}
                value={round(calculateSubjectiveValue(cakeValuations[person as keyof typeof cakeValuations], allocation[person as keyof typeof allocation]) * 100, 0)}
                tone="neutral"
              />
            ))}
          </div>
        </div>
      </SimulationCanvas>
      <div className="grid gap-4 md:grid-cols-2">
        <StrategySlider label={t.cut1} min={10} max={90} value={cut1} suffix="%" onChange={setCut1} />
        <StrategySlider label={t.cut2} min={10} max={90} value={cut2} suffix="%" onChange={setCut2} />
      </div>
      <ResultCard
        label={t.envyCheck}
        value={envy.envyFree ? t.noEnvy : `${envy.envyPairs.length} ${t.warnings}`}
        tone={envy.envyFree ? "good" : "warn"}
      />
    </div>
  );
}

function ShapleySimulation({ locale = "en" }: { locale?: Locale }) {
  const t = simText[locale];
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
        <h2 className="text-2xl font-semibold">{t.shapleyTitle}</h2>
        <ResetButton locale={locale} onClick={() => setActive(0)} />
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
                <p className="text-xs text-muted-foreground">
                  {locale === "zh" ? `第 ${index + 1} 个加入` : `${t.joins} #${index + 1}`}
                </p>
                <p className="mt-2 text-xl font-semibold">{player}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t.coalitionValue} {formatCurrency(valueFunction(order.slice(0, index + 1)))}
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
          {t.nextOrder}
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {Object.entries(shapley).map(([player, value]) => (
          <ResultCard key={player} label={`${player} ${t.fairPayment}`} value={value} prefix="$" tone="good" />
        ))}
      </div>
    </div>
  );
}

function BertrandSimulation({ locale = "en" }: { locale?: Locale }) {
  const t = simText[locale];
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
        <h2 className="text-2xl font-semibold">{t.bertrandTitle}</h2>
        <ResetButton
          locale={locale}
          onClick={() => {
            setPriceA(4);
            setPriceB(5);
          }}
        />
      </div>
      <SimulationCanvas>
        <div className="grid h-full content-center gap-6 md:grid-cols-2">
          {[
            [locale === "zh" ? "店铺 A" : "Store A", priceA, demand.demandA, storeAProfit, "#2563eb"],
            [locale === "zh" ? "店铺 B" : "Store B", priceB, demand.demandB, storeBProfit, "#db2777"]
          ].map(([name, price, quantity, profit, color]) => (
            <div key={name as string} className="rounded-[8px] border border-border bg-white/70 p-5 dark:bg-white/5">
              <p className="text-lg font-semibold">{name}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t.price} ${price}</p>
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
        <StrategySlider label={t.storeAPrice} min={2} max={8} value={priceA} prefix="$" onChange={setPriceA} />
        <StrategySlider label={t.storeBPrice} min={2} max={8} value={priceB} prefix="$" onChange={setPriceB} />
      </div>
      <ResultCard
        label={t.priceWar}
        value={priceA === cost && priceB === cost ? t.atCost : priceA === priceB ? t.splitMarket : t.cheaperWins}
        tone={priceA === cost && priceB === cost ? "warn" : "neutral"}
      />
    </div>
  );
}

function CommonsSimulation({ locale = "en" }: { locale?: Locale }) {
  const t = simText[locale];
  const [usage, setUsage] = useState([8, 8, 8]);
  const [resource, setResource] = useState(82);
  const [history, setHistory] = useState<string[]>([t.pondStarts]);
  const round = simulateCommonsRound(usage, resource, 18);

  function play() {
    setResource(round.nextResource);
    setHistory((items) => [
      ...items.slice(-4),
      `${t.usage} ${round.totalUsage}, ${t.resource} ${Math.round(round.nextResource)}`
    ]);
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">{t.commonsTitle}</h2>
        <ResetButton
          locale={locale}
          onClick={() => {
            setUsage([8, 8, 8]);
            setResource(82);
            setHistory([t.pondStarts]);
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
            <div className="mx-auto rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">{t.collapse}</div>
          ) : null}
        </div>
      </SimulationCanvas>
      <div className="grid gap-4 md:grid-cols-3">
        {usage.map((value, index) => (
          <StrategySlider
            key={index}
            label={`${locale === "zh" ? "玩家" : "Player"} ${index + 1} ${t.usage}`}
            min={0}
            max={18}
            value={value}
            onChange={(next) => setUsage((items) => items.map((item, itemIndex) => (itemIndex === index ? next : item)))}
          />
        ))}
      </div>
      <Button onClick={play}>
        <Play className="h-4 w-4" />
        {t.simulateRound}
      </Button>
      <div className="grid gap-3 md:grid-cols-3">
        {round.payoffs.map((payoff, index) => (
          <ResultCard key={index} label={`${locale === "zh" ? "玩家" : "Player"} ${index + 1} ${t.gain}`} value={payoff} tone="neutral" />
        ))}
      </div>
      <TimelineAnimation steps={history} />
    </div>
  );
}

function UltimatumSimulation({ locale = "en" }: { locale?: Locale }) {
  const t = simText[locale];
  const [offer, setOffer] = useState(35);
  const [threshold, setThreshold] = useState(30);
  const outcome = calculateUltimatumOutcome(100, offer, threshold);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">{t.ultimatumTitle}</h2>
        <ResetButton
          locale={locale}
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
              {t.keeps} ${100 - offer}
            </motion.div>
            <motion.div className="bg-accent p-6" animate={{ width: `${offer}%` }}>
              {t.gets} ${offer}
            </motion.div>
          </div>
          <motion.div
            animate={{ rotate: outcome.accepted ? 0 : [-2, 2, -2, 0], scale: outcome.accepted ? 1 : [1, 1.04, 1] }}
            className={cn(
              "mx-auto rounded-[8px] border-2 px-8 py-4 text-2xl font-black uppercase tracking-[0.2em]",
              outcome.accepted ? "border-emerald-500 text-emerald-600" : "border-red-500 text-red-600"
            )}
          >
            {outcome.accepted ? t.accepted : t.rejected}
          </motion.div>
        </div>
      </SimulationCanvas>
      <div className="grid gap-4 md:grid-cols-2">
        <StrategySlider label={t.offerToB} min={0} max={100} value={offer} prefix="$" onChange={setOffer} />
        <StrategySlider label={t.threshold} min={0} max={60} value={threshold} prefix="$" onChange={setThreshold} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <ResultCard label={t.rational} value={outcome.acceptsRationally ? t.accepts : t.rejects} tone="neutral" />
        <ResultCard label={t.fairness} value={outcome.acceptsBehaviorally ? t.accepts : t.rejects} tone={outcome.accepted ? "good" : "danger"} />
      </div>
    </div>
  );
}

function MatchingSimulation({ locale = "en" }: { locale?: Locale }) {
  const t = simText[locale];
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
        <h2 className="text-2xl font-semibold">{t.matchingTitle}</h2>
        <ResetButton locale={locale} onClick={() => setMinaRanking(matchingPreferences.proposers[0].rankings)} />
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
        <DragRankingList title={t.dragRanking} items={minaRanking} onChange={setMinaRanking} />
        <TimelineAnimation steps={result.steps.slice(0, 7).map((step) => step.message)} />
      </div>
      <ResultCard label={t.stableCheck} value={stable ? t.stable : t.blocking} tone={stable ? "good" : "warn"} />
    </div>
  );
}
