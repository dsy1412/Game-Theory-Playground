"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  Fish,
  Play,
  RefreshCcw,
  ShoppingBag,
  Sun
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type PointerEvent, type ReactNode } from "react";
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

  const runNotes = getRunNotes(concept.slug, locale);

  return (
    <main className="min-h-screen bg-aurora-soft dark:bg-aurora-dark">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
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
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end"
        >
          <div>
            <p className="font-mono text-sm uppercase text-muted-foreground">{copy.module}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{concept.title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{concept.subtitle}</p>
          </div>
          <RuleLedger concept={concept} locale={locale} />
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
            <ConceptRunPanel notes={runNotes} locale={locale} />
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

function RuleLedger({ concept, locale = "en" }: { concept: Concept; locale?: Locale }) {
  const isZh = locale === "zh";
  return (
    <div className="rounded-[8px] border border-foreground bg-card p-5 shadow-sm">
      <p className="font-mono text-xs uppercase text-muted-foreground">{isZh ? "规则账本" : "Rule ledger"}</p>
      <div className="mt-4 grid gap-3 text-sm">
        <div className="grid grid-cols-[88px_1fr] gap-3 border-b border-border pb-3">
          <span className="font-mono text-xs uppercase text-muted-foreground">{isZh ? "场景" : "case"}</span>
          <span className="leading-6 text-muted-foreground">{concept.scenario}</span>
        </div>
        <div className="grid grid-cols-[88px_1fr] gap-3 border-b border-border pb-3">
          <span className="font-mono text-xs uppercase text-muted-foreground">{isZh ? "公式" : "rule"}</span>
          <code className="break-words font-mono text-xs">{concept.formula}</code>
        </div>
        <div className="grid grid-cols-[88px_1fr] gap-3">
          <span className="font-mono text-xs uppercase text-muted-foreground">{isZh ? "问题" : "question"}</span>
          <span className="font-medium">{isZh ? "单独改变策略时，谁的收益或公平感先变化？" : "When one strategy changes alone, whose payoff or fairness changes first?"}</span>
        </div>
      </div>
    </div>
  );
}

function ConceptRunPanel({
  notes,
  locale = "en"
}: {
  notes: { title: string; steps: string[]; observation: string };
  locale?: Locale;
}) {
  return (
    <GlassCard className="p-5">
      <p className="font-mono text-xs uppercase text-muted-foreground">{locale === "zh" ? "运行步骤" : "Run sequence"}</p>
      <h2 className="mt-3 text-xl font-semibold">{notes.title}</h2>
      <div className="mt-5 grid gap-3">
        {notes.steps.map((step, index) => (
          <div key={step} className="grid grid-cols-[40px_1fr] gap-3 rounded-[8px] border border-border bg-background p-3">
            <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
            <p className="text-sm leading-6">{step}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-[8px] border border-foreground bg-foreground p-4 text-sm leading-6 text-background">
        {notes.observation}
      </div>
    </GlassCard>
  );
}

function getRunNotes(slug: string, locale: Locale) {
  const zh: Record<string, { title: string; steps: string[]; observation: string }> = {
    "split-rent-fairly": {
      title: "从报价到租金",
      steps: ["输入每个人对每个房间的真实估值。", "让每个房间暂时给出价最高的人。", "把总租金拉回 1600，并观察剩余是否相等。"],
      observation: "重点看“剩余”而不是只看租金：公平来自每个人按自己的估值都不吃亏。"
    },
    "prisoners-dilemma": {
      title: "从一次背叛到长期信任",
      steps: ["先选 A 和 B 的行动。", "在矩阵中找到对应格子。", "播放重复轮次，观察信任如何改变未来激励。"],
      observation: "单轮理性和长期关系会拉扯：这正是囚徒困境的核心张力。"
    },
    "nash-equilibrium": {
      title: "拖动位置，寻找稳定点",
      steps: ["拖动两家店的位置。", "比较各自收益是否上升。", "当单独移动没有好处时，读作均衡候选。"],
      observation: "纳什均衡不是最好结果，而是没人能单独变好的结果。"
    },
    "vickrey-auction": {
      title: "报价只决定胜负，价格来自第二名",
      steps: ["调节三个密封报价。", "看最高报价者获胜。", "比较获胜者支付的是第二高价而不是自己的报价。"],
      observation: "二价机制把“我想赢”和“我怕付太多”分开，因此更鼓励真实报价。"
    },
    "envy-free-allocation": {
      title: "公平来自主观价值",
      steps: ["移动蛋糕切线。", "看每个人对每一段的主观价值。", "检查是否有人更想要别人的份额。"],
      observation: "大小相等不一定公平；偏好不同，公平也要按个人价值来判断。"
    },
    "shapley-value": {
      title: "把每一种加入顺序都算一遍",
      steps: ["播放一个加入顺序。", "记录每个人加入时新增的价值。", "在所有顺序上取平均。"],
      observation: "夏普利值不是拍脑袋分功劳，而是平均边际贡献。"
    },
    "bertrand-competition": {
      title: "价格差一点，需求可能全变",
      steps: ["调节两家店价格。", "观察顾客流向低价店。", "把价格推近成本，观察利润被压缩。"],
      observation: "同质商品的价格战会把利润推薄，差异化才可能改变博弈。"
    },
    "tragedy-of-the-commons": {
      title: "个人多用一点，集体少一点",
      steps: ["调节每个人的使用量。", "模拟一轮资源恢复。", "比较个人收益和池塘余量。"],
      observation: "问题不在于单个人坏，而在于收益私人化、损耗公共化。"
    },
    "ultimatum-game": {
      title: "钱不是唯一收益",
      steps: ["调节给 B 的金额。", "设置 B 的公平底线。", "比较理性模型和公平模型的接受条件。"],
      observation: "人会为公平付出代价，所以谈判不只是算钱。"
    },
    "matching-market": {
      title: "稳定来自没有双方共同反悔",
      steps: ["调整偏好排序。", "逐步运行提议和拒绝。", "检查是否还有阻塞配对。"],
      observation: "稳定匹配关注的不是每个人都最满意，而是没有一对人想一起离开。"
    }
  };

  const en: Record<string, { title: string; steps: string[]; observation: string }> = {
    "split-rent-fairly": {
      title: "From bids to rents",
      steps: ["Enter each person's value for each room.", "Assign each room to the highest valuation.", "Pull total rent back to $1600 and compare surplus."],
      observation: "Watch surplus, not rent alone: fairness means nobody feels worse by their own values."
    },
    "prisoners-dilemma": {
      title: "From one betrayal to repeated trust",
      steps: ["Choose A and B's actions.", "Find the selected cell in the matrix.", "Play repeated rounds and watch trust reshape incentives."],
      observation: "One-shot rationality and long-term relationship pull in different directions."
    },
    "nash-equilibrium": {
      title: "Move locations, search for stability",
      steps: ["Drag the two shops.", "Compare whether either profit rises.", "Read a no-improvement position as an equilibrium candidate."],
      observation: "A Nash equilibrium is not necessarily best; it is where no one improves alone."
    },
    "vickrey-auction": {
      title: "Your bid decides winning, not the price",
      steps: ["Adjust the sealed bids.", "Watch the highest bidder win.", "Compare the winner's payment with the second-highest bid."],
      observation: "Second price separates wanting to win from fearing overpayment, so truth becomes attractive."
    },
    "envy-free-allocation": {
      title: "Fairness is subjective",
      steps: ["Move the cake cuts.", "Read each person's value for each segment.", "Check whether anyone wants someone else's piece."],
      observation: "Equal size is not always fair; preferences decide whether envy exists."
    },
    "shapley-value": {
      title: "Average every joining order",
      steps: ["Play one joining order.", "Record each person's marginal value.", "Average across all orders."],
      observation: "Shapley value divides credit by average marginal contribution."
    },
    "bertrand-competition": {
      title: "A tiny price cut can move demand",
      steps: ["Adjust both store prices.", "Watch customers flow to the cheaper store.", "Push price toward cost and observe shrinking profit."],
      observation: "Identical goods create brutal price competition unless differentiation changes the game."
    },
    "tragedy-of-the-commons": {
      title: "A little more for me, a little less for us",
      steps: ["Set each person's usage.", "Simulate regeneration.", "Compare private gain with remaining resource."],
      observation: "The issue is not one bad actor; it is private benefit plus shared damage."
    },
    "ultimatum-game": {
      title: "Money is not the only payoff",
      steps: ["Set B's offer.", "Set B's fairness threshold.", "Compare rational and fairness acceptance."],
      observation: "People pay to reject disrespect, so negotiation is not just arithmetic."
    },
    "matching-market": {
      title: "Stable means no mutual regret",
      steps: ["Change preference rankings.", "Run proposals and rejections.", "Check for blocking pairs."],
      observation: "A stable match need not be everyone's favorite; it prevents pairs from leaving together."
    }
  };

  return (locale === "zh" ? zh : en)[slug] ?? (locale === "zh" ? zh["prisoners-dilemma"] : en["prisoners-dilemma"]);
}

function InsightPanel({
  locale = "en",
  title,
  children
}: {
  locale?: Locale;
  title?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[8px] border border-border bg-background p-4 text-sm leading-6 text-muted-foreground shadow-sm"
    >
      <p className="mb-1 font-semibold text-foreground">{title ?? (locale === "zh" ? "怎样读这个结果" : "How to read this result")}</p>
      {children}
    </motion.div>
  );
}

function CaseStrip({ cases }: { cases: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {cases.map((item, index) => (
        <motion.span
          key={item}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          {item}
        </motion.span>
      ))}
    </div>
  );
}

function RoomPreview({ roomId, quality }: { roomId: string; quality: number }) {
  const isLarge = roomId === "large-window";
  const isMedium = roomId === "medium-bed";

  return (
    <div className="relative h-32 overflow-hidden rounded-[8px] border border-border bg-background p-3">
      {isLarge ? (
        <>
          <motion.div
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-sm"
            animate={{ scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sun className="h-5 w-5" />
          </motion.div>
          <div className="grid h-full grid-cols-3 gap-2 rounded-[8px] border border-border bg-muted p-2">
            {[0, 1, 2].map((pane) => (
              <div key={pane} className="rounded-[6px] bg-background" />
            ))}
          </div>
        </>
      ) : isMedium ? (
        <div className="flex h-full items-end justify-center">
          <div className="relative h-16 w-36 rounded-t-[8px] border border-border bg-muted shadow-inner">
            <BedDouble className="absolute left-4 top-4 h-8 w-8 text-foreground" />
            <div className="absolute right-4 top-3 h-5 w-9 rounded-[6px] bg-background" />
            <div className="absolute bottom-0 h-3 w-full rounded-b-[8px] bg-foreground/15" />
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <motion.div
            className="h-20 w-24 rounded-[8px] border border-border bg-muted shadow-inner"
            animate={{ x: [0, -4, 0, 4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}
      <div className="absolute bottom-3 left-3 right-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-foreground"
          animate={{ width: `${quality}%` }}
        />
      </div>
    </div>
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
    joins: "加入",
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
      <CaseStrip
        cases={
          locale === "zh"
            ? ["合租分房", "办公室座位", "共享工作室"]
            : ["Roommates", "Office desks", "Shared studios"]
        }
      />
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
                <RoomPreview roomId={room.id} quality={room.quality} />
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
      <InsightPanel locale={locale}>
        {locale === "zh"
          ? "先看每个人最愿意为哪个房间付钱，再把总租金调回 1600 美元。三个剩余都相同，表示大家都觉得自己没有吃亏。"
          : "First assign rooms to the strongest valuations, then adjust rents back to the $1600 total. Equal surplus means nobody is left with a worse deal by their own bids."}
      </InsightPanel>
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
      <CaseStrip
        cases={
          locale === "zh"
            ? ["偷吃外卖", "小组作业", "公司价格默契"]
            : ["Takeout", "Group projects", "Price discipline"]
        }
      />
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
        <ResultCard label={locale === "zh" ? "A 的收益" : "A payoff"} value={result.payoffA} tone={result.payoffA >= -1 ? "good" : "danger"} />
        <ResultCard label={locale === "zh" ? "B 的收益" : "B payoff"} value={result.payoffB} tone={result.payoffB >= -1 ? "good" : "danger"} />
      </div>
      <TimelineAnimation steps={history} />
      <InsightPanel locale={locale}>
        {locale === "zh"
          ? "背叛通常让个人当下更安全，但双方都背叛会让总结果变差。重复轮次里的信任分数用来表现：未来关系会改变今天的激励。"
          : "Defection can look safer in a single round, but mutual defection lowers the shared outcome. The trust score shows how future relationships can change today's incentives."}
      </InsightPanel>
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(255,255,255,0.72))] dark:bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.62))]" />
          {[
            ["a", shopA, locale === "zh" ? "店铺 A" : "Shop A", "hsl(var(--foreground))"],
            ["b", shopB, locale === "zh" ? "店铺 B" : "Shop B", "hsl(var(--muted-foreground))"]
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
            <div className="absolute left-1/2 top-6 -translate-x-1/2 rounded-[8px] border border-foreground bg-card px-4 py-2 text-sm font-semibold shadow-sm">
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
      <InsightPanel locale={locale}>
        {locale === "zh"
          ? "拖动店铺时，收益来自附近顾客密度和竞争距离。发光并不代表全局最好，而是表示在当前对手位置下，单独移动的吸引力变小。"
          : "When you drag a shop, profit follows customer density and distance from the rival. The glow does not mean globally perfect; it means moving alone is less attractive from this profile."}
      </InsightPanel>
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
      <CaseStrip
        cases={
          locale === "zh"
            ? ["房间竞价", "艺术品拍卖", "广告位竞价"]
            : ["Room bids", "Art auctions", "Ad slots"]
        }
      />
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
      <InsightPanel locale={locale}>
        {locale === "zh"
          ? "最高报价只决定谁赢，真正支付的是第二高价。所以你不用猜别人会报多少，报出自己的真实价值更稳。"
          : "The highest bid decides who wins, but the payment is the second price. That is why bidding your true value is safer than trying to guess everyone else."}
      </InsightPanel>
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
      <InsightPanel locale={locale}>
        {locale === "zh"
          ? "这里的公平不是看蛋糕面积是否一样，而是看每个人用自己的偏好评价后，是否还想要别人的那份。"
          : "Fairness here is not equal physical size. It is whether each person, using their own preferences, would still prefer someone else's piece."}
      </InsightPanel>
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
      <InsightPanel locale={locale}>
        {locale === "zh"
          ? "夏普利值把每一种加入顺序都看一遍，再平均每个人带来的新增价值。这样能避免只看最终成果时的抢功劳。"
          : "The Shapley value checks every joining order and averages the extra value each person adds. That avoids giving credit only by looking at the final team."}
      </InsightPanel>
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
  const winnerSide = priceA === priceB ? "tie" : priceA < priceB ? "A" : "B";
  const customerShift = winnerSide === "A" ? -78 : winnerSide === "B" ? 78 : 0;

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
      <CaseStrip
        cases={
          locale === "zh"
            ? ["便利店可乐", "打车补贴", "咖啡折扣"]
            : ["Cola stores", "Ride-hailing coupons", "Coffee discounts"]
        }
      />
      <SimulationCanvas>
        <div className="grid h-full content-center gap-5 md:grid-cols-[1fr_1.1fr_1fr]">
          {[
            [locale === "zh" ? "店铺 A" : "Store A", priceA, demand.demandA, storeAProfit, "#2563eb"],
            [locale === "zh" ? "店铺 B" : "Store B", priceB, demand.demandB, storeBProfit, "#db2777"]
          ].map(([name, price, quantity, profit, color], index) => (
            <motion.div
              key={name as string}
              layout
              className={cn(
                "rounded-[8px] border bg-white/70 p-5 shadow-glass dark:bg-white/5",
                winnerSide === "tie" || winnerSide === (index === 0 ? "A" : "B") ? "border-primary/40" : "border-border"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t.price} ${price}</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-[8px] bg-muted" style={{ color: color as string }}>
                  <Building2 className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color as string }}
                  animate={{ width: String(quantity as number) + "%" }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {Math.round(quantity as number)}% {locale === "zh" ? "顾客流向这里" : "customer flow"}
              </p>
              <p className="mt-4 text-2xl font-semibold">
                <AnimatedCounter value={profit as number} prefix="$" />
              </p>
            </motion.div>
          ))}
          <div className="order-first grid content-center gap-4 md:order-none md:col-start-2 md:row-start-1">
            <div className="relative mx-auto h-28 w-full max-w-xs rounded-[8px] border border-border bg-white/55 p-4 dark:bg-white/5">
              <div className="absolute left-6 top-1/2 h-px w-[calc(100%-3rem)] bg-border" />
              {Array.from({ length: 9 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-background shadow-glass"
                  animate={{ x: customerShift + (index - 4) * 7, y: Math.sin(index) * 12 }}
                  transition={{ type: "spring", stiffness: 80, damping: 16, delay: index * 0.03 }}
                >
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
            <p className="text-center text-sm font-medium text-muted-foreground">
              {winnerSide === "tie" ? t.splitMarket : t.cheaperWins}
            </p>
          </div>
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
      <InsightPanel locale={locale}>
        {locale === "zh"
          ? "当商品完全一样时，低一点的价格就能吸走顾客。价格越接近成本，消费者越开心，但店铺利润越薄。"
          : "With identical products, a slightly lower price can pull customers away. As prices approach cost, consumers benefit while store margins shrink."}
      </InsightPanel>
    </div>
  );
}

function CommonsSimulation({ locale = "en" }: { locale?: Locale }) {
  const t = simText[locale];
  const [usage, setUsage] = useState([8, 8, 8]);
  const [resource, setResource] = useState(82);
  const [history, setHistory] = useState<string[]>([t.pondStarts]);
  const round = simulateCommonsRound(usage, resource, 18);
  const fishCount = Math.max(3, Math.round(resource / 8));
  const pressure = Math.min(100, round.totalUsage * 3);

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
      <CaseStrip
        cases={
          locale === "zh"
            ? ["共享鱼塘", "公共停车位", "办公室零食柜"]
            : ["Shared pond", "Public parking", "Office snacks"]
        }
      />
      <SimulationCanvas>
        <div className="grid h-full content-center gap-6">
          <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full border border-foreground bg-muted">
            <motion.div
              className="absolute inset-x-0 bottom-0 bg-foreground/80"
              animate={{ height: `${resource}%` }}
            />
            <motion.div
              className="absolute inset-6 rounded-full border border-background/50"
              animate={{ scale: [1, 1 + pressure / 180, 1], opacity: [0.08, 0.35, 0.08] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            {Array.from({ length: fishCount }).map((_, index) => (
              <motion.div
                key={index}
                className="absolute grid h-6 w-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-sm"
                style={{
                  left: `${18 + (index * 17) % 62}%`,
                  top: `${26 + (index * 23) % 48}%`
                }}
                animate={{ x: [0, index % 2 ? 12 : -12, 0], opacity: resource < 30 ? 0.45 : 0.9 }}
                transition={{ duration: 3 + (index % 4), repeat: Infinity, ease: "easeInOut" }}
              >
                <Fish className="h-4 w-4" />
              </motion.div>
            ))}
            <div className="absolute inset-0 grid place-items-center text-4xl font-semibold text-background drop-shadow">
              <AnimatedCounter value={resource} suffix="%" />
            </div>
          </div>
          {round.collapsed ? (
            <div className="mx-auto rounded-[8px] border border-foreground bg-foreground px-4 py-2 text-sm font-semibold text-background">{t.collapse}</div>
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
      <InsightPanel locale={locale}>
        {locale === "zh"
          ? "单个人多用一点会增加自己的收益，但总使用量超过恢复速度时，资源水平会下降，下一轮所有人都变差。"
          : "Each person gains from using more, but when total usage beats regeneration, the shared resource falls and the next round becomes worse for everyone."}
      </InsightPanel>
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
              outcome.accepted ? "border-foreground text-foreground" : "border-foreground text-foreground bg-muted"
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
      <InsightPanel locale={locale}>
        {locale === "zh"
          ? "纯理性模型只问“有没有钱拿”，公平模型还问“这个分配是否被尊重”。现实谈判经常同时受到两者影响。"
          : "The strict rational model asks only whether there is money to take. The fairness model also asks whether the split feels respectful."}
      </InsightPanel>
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
      <InsightPanel locale={locale}>
        {locale === "zh"
          ? "稳定的意思不是每个人都拿到第一志愿，而是不存在一对双方都宁愿抛开当前匹配、选择彼此。"
          : "Stable does not mean everyone gets their first choice. It means no unmatched pair would both rather leave their current matches for each other."}
      </InsightPanel>
    </div>
  );
}
