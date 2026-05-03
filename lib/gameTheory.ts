import type {
  AllocationResult,
  Bid,
  CakeSegment,
  MatchPreference,
  MatchingStep,
  PayoffMatrix,
  Position
} from "@/lib/types";

export type BidTable = Record<string, Record<string, number>>;

function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  return items.flatMap((item, index) =>
    permutations([...items.slice(0, index), ...items.slice(index + 1)]).map((rest) => [
      item,
      ...rest
    ])
  );
}

export function calculateRoomAssignment(
  bids: BidTable,
  totalRent: number
): AllocationResult[] {
  const playerIds = Object.keys(bids);
  const roomIds = Object.keys(bids[playerIds[0]] ?? {});
  const assignments = permutations(playerIds).map((playerOrder) => {
    const results = roomIds.map((roomId, index) => {
      const ownerId = playerOrder[index];
      return {
        ownerId,
        roomId,
        valuation: bids[ownerId][roomId],
        rent: 0,
        surplus: 0
      };
    });
    const totalValue = results.reduce((sum, result) => sum + result.valuation, 0);
    return { results, totalValue };
  });

  const best = assignments.sort((a, b) => b.totalValue - a.totalValue)[0] ?? {
    results: [],
    totalValue: 0
  };
  const fairSurplus = (best.totalValue - totalRent) / Math.max(1, best.results.length);

  return best.results.map((result) => ({
    ...result,
    rent: result.valuation - fairSurplus,
    surplus: fairSurplus
  }));
}

export function calculateSurplus(valuation: number, rent: number) {
  return valuation - rent;
}

export function calculatePrisonersDilemmaPayoff(
  actionA: "cooperate" | "defect",
  actionB: "cooperate" | "defect"
) {
  const key = `${actionA}-${actionB}`;
  const payoffs: Record<string, { payoffA: number; payoffB: number; label: string }> = {
    "cooperate-cooperate": { payoffA: -1, payoffB: -1, label: "Both stay silent" },
    "defect-cooperate": { payoffA: 0, payoffB: -5, label: "A betrays, B stays silent" },
    "cooperate-defect": { payoffA: -5, payoffB: 0, label: "B betrays, A stays silent" },
    "defect-defect": { payoffA: -3, payoffB: -3, label: "Both betray" }
  };
  return payoffs[key];
}

export function updateTrust(
  previousTrust: number,
  actionA: "cooperate" | "defect",
  actionB: "cooperate" | "defect"
) {
  if (actionA === "cooperate" && actionB === "cooperate") return Math.min(100, previousTrust + 14);
  if (actionA === "defect" && actionB === "defect") return Math.max(0, previousTrust - 18);
  return Math.max(0, previousTrust - 28);
}

export function calculateLocationProfit(
  shopPosition: Position,
  opponentPosition: Position,
  customerDensity: (position: Position) => number
) {
  let profit = 0;
  const grid = 13;
  for (let x = 0; x <= grid; x += 1) {
    for (let y = 0; y <= grid; y += 1) {
      const point = { x: x / grid, y: y / grid };
      const density = customerDensity(point);
      const ownDistance = Math.hypot(point.x - shopPosition.x, point.y - shopPosition.y);
      const opponentDistance = Math.hypot(point.x - opponentPosition.x, point.y - opponentPosition.y);
      if (ownDistance < opponentDistance) profit += density;
      if (ownDistance === opponentDistance) profit += density / 2;
    }
  }
  return Math.round(profit);
}

export function detectNashEquilibrium(
  strategyProfile: Record<string, string>,
  payoffMatrix: Record<string, Record<string, Record<string, number>>>
) {
  return Object.entries(strategyProfile).every(([playerId, strategy]) => {
    const opponents = Object.fromEntries(
      Object.entries(strategyProfile).filter(([id]) => id !== playerId)
    );
    const opponentKey = Object.values(opponents).join("|");
    const current = payoffMatrix[playerId]?.[strategy]?.[opponentKey] ?? Number.NEGATIVE_INFINITY;
    return Object.entries(payoffMatrix[playerId] ?? {}).every(
      ([alternative, outcomes]) => alternative === strategy || (outcomes[opponentKey] ?? 0) <= current
    );
  });
}

export function getWinner(bids: Bid[]) {
  return [...bids].sort((a, b) => b.amount - a.amount)[0];
}

export function getSecondHighestBid(bids: Bid[]) {
  return [...bids].sort((a, b) => b.amount - a.amount)[1]?.amount ?? 0;
}

export function calculateVickreyAuction(bids: Bid[]) {
  return {
    winner: getWinner(bids),
    payment: getSecondHighestBid(bids),
    sortedBids: [...bids].sort((a, b) => b.amount - a.amount)
  };
}

export function calculateSubjectiveValue(
  person: { cream: number; chocolate: number; fruit: number },
  cakeSegment: CakeSegment
) {
  const start = Math.max(0, cakeSegment.start);
  const end = Math.min(1, cakeSegment.end);
  const samples = 30;
  let value = 0;
  for (let index = 0; index < samples; index += 1) {
    const t = start + ((end - start) * (index + 0.5)) / samples;
    const cream = Math.max(0, 1 - Math.abs(t - 0.2) * 3);
    const chocolate = Math.max(0, 1 - Math.abs(t - 0.52) * 4);
    const fruit = Math.max(0, 1 - Math.abs(t - 0.82) * 5);
    value += cream * person.cream + chocolate * person.chocolate + fruit * person.fruit;
  }
  return value / samples;
}

export function checkEnvyFree(
  allocation: Record<string, CakeSegment>,
  valuations: Record<string, { cream: number; chocolate: number; fruit: number }>
) {
  const envyPairs: Array<{ person: string; envies: string }> = [];
  Object.keys(valuations).forEach((personId) => {
    const ownValue = calculateSubjectiveValue(valuations[personId], allocation[personId]);
    Object.keys(allocation).forEach((otherId) => {
      const otherValue = calculateSubjectiveValue(valuations[personId], allocation[otherId]);
      if (otherId !== personId && otherValue > ownValue + 0.02) {
        envyPairs.push({ person: personId, envies: otherId });
      }
    });
  });
  return { envyFree: envyPairs.length === 0, envyPairs };
}

export function generatePermutations<T>(players: T[]) {
  return permutations(players);
}

export function calculateMarginalContribution(
  player: string,
  coalition: string[],
  coalitionValueFunction: (coalition: string[]) => number
) {
  return coalitionValueFunction([...coalition, player]) - coalitionValueFunction(coalition);
}

export function calculateShapleyValue(
  players: string[],
  coalitionValueFunction: (coalition: string[]) => number
) {
  const orders = generatePermutations(players);
  const totals = Object.fromEntries(players.map((player) => [player, 0]));

  orders.forEach((order) => {
    const coalition: string[] = [];
    order.forEach((player) => {
      totals[player] += calculateMarginalContribution(player, coalition, coalitionValueFunction);
      coalition.push(player);
    });
  });

  return Object.fromEntries(
    Object.entries(totals).map(([player, total]) => [player, total / orders.length])
  );
}

export function calculateBertrandDemand(priceA: number, priceB: number) {
  const market = 120;
  if (priceA < priceB) return { demandA: market, demandB: 0 };
  if (priceB < priceA) return { demandA: 0, demandB: market };
  return { demandA: market / 2, demandB: market / 2 };
}

export function calculateProfit(price: number, cost: number, quantity: number) {
  return Math.max(0, price - cost) * quantity;
}

export function calculateCommonsPayoff(usage: number, resourceLevel: number) {
  const scarcityPenalty = Math.max(0, 45 - resourceLevel) * 0.18;
  return Math.max(0, usage * 7 - usage ** 1.35 * 0.8 - scarcityPenalty);
}

export function simulateCommonsRound(
  playersUsage: number[],
  resourceLevel: number,
  regenerationRate: number
) {
  const totalUsage = playersUsage.reduce((sum, usage) => sum + usage, 0);
  const nextResource = Math.max(0, Math.min(100, resourceLevel - totalUsage * 2.2 + regenerationRate));
  const payoffs = playersUsage.map((usage) => calculateCommonsPayoff(usage, nextResource));
  return {
    nextResource,
    payoffs,
    collapsed: nextResource <= 12,
    totalUsage
  };
}

export function calculateUltimatumOutcome(
  totalMoney: number,
  offer: number,
  fairnessThreshold: number
) {
  const acceptsRationally = offer > 0;
  const acceptsBehaviorally = offer >= fairnessThreshold;
  return {
    accepted: acceptsBehaviorally,
    acceptsRationally,
    acceptsBehaviorally,
    proposerPayoff: acceptsBehaviorally ? totalMoney - offer : 0,
    responderPayoff: acceptsBehaviorally ? offer : 0
  };
}

export function runGaleShapley(
  proposers: string[],
  receivers: string[],
  preferences: {
    proposers: MatchPreference[];
    receivers: MatchPreference[];
  }
) {
  const proposerPrefs = Object.fromEntries(
    preferences.proposers.map((preference) => [preference.id, preference.rankings])
  );
  const receiverPrefs = Object.fromEntries(
    preferences.receivers.map((preference) => [preference.id, preference.rankings])
  );
  const free = [...proposers];
  const nextIndex = Object.fromEntries(proposers.map((proposer) => [proposer, 0]));
  const held = new Map<string, string>();
  const steps: MatchingStep[] = [];
  let round = 1;

  while (free.length > 0) {
    const proposer = free.shift() as string;
    const receiver = proposerPrefs[proposer]?.[nextIndex[proposer]];
    nextIndex[proposer] += 1;
    if (!receiver) continue;

    steps.push({
      round,
      proposer,
      receiver,
      status: "proposed",
      message: `${proposer} proposes to ${receiver}.`
    });

    const current = held.get(receiver);
    if (!current) {
      held.set(receiver, proposer);
      steps.push({
        round,
        proposer,
        receiver,
        status: "held",
        message: `${receiver} holds ${proposer}'s proposal.`
      });
    } else {
      const ranking = receiverPrefs[receiver] ?? [];
      const prefersNew = ranking.indexOf(proposer) < ranking.indexOf(current);
      if (prefersNew) {
        held.set(receiver, proposer);
        free.push(current);
        steps.push({
          round,
          proposer,
          receiver,
          status: "swapped",
          message: `${receiver} switches from ${current} to ${proposer}.`
        });
      } else {
        free.push(proposer);
        steps.push({
          round,
          proposer,
          receiver,
          status: "rejected",
          message: `${receiver} rejects ${proposer}.`
        });
      }
    }
    round += 1;
  }

  const matches = Array.from(held.entries()).map(([receiver, proposer]) => ({ proposer, receiver }));
  return { matches, steps };
}

export function checkStableMatching(
  matches: Array<{ proposer: string; receiver: string }>,
  preferences: {
    proposers: MatchPreference[];
    receivers: MatchPreference[];
  }
) {
  const proposerMatch = Object.fromEntries(matches.map((match) => [match.proposer, match.receiver]));
  const receiverMatch = Object.fromEntries(matches.map((match) => [match.receiver, match.proposer]));
  const proposerPrefs = Object.fromEntries(
    preferences.proposers.map((preference) => [preference.id, preference.rankings])
  );
  const receiverPrefs = Object.fromEntries(
    preferences.receivers.map((preference) => [preference.id, preference.rankings])
  );

  for (const proposer of Object.keys(proposerPrefs)) {
    for (const receiver of proposerPrefs[proposer]) {
      const currentReceiver = proposerMatch[proposer];
      const currentProposer = receiverMatch[receiver];
      const proposerPrefersReceiver =
        proposerPrefs[proposer].indexOf(receiver) < proposerPrefs[proposer].indexOf(currentReceiver);
      const receiverPrefersProposer =
        receiverPrefs[receiver].indexOf(proposer) < receiverPrefs[receiver].indexOf(currentProposer);
      if (proposerPrefersReceiver && receiverPrefersProposer) return false;
    }
  }
  return true;
}

export function prisonersPayoffMatrix(): PayoffMatrix {
  return [
    { rowStrategy: "Cooperate", columnStrategy: "Cooperate", payoffA: -1, payoffB: -1 },
    { rowStrategy: "Defect", columnStrategy: "Cooperate", payoffA: 0, payoffB: -5 },
    { rowStrategy: "Cooperate", columnStrategy: "Defect", payoffA: -5, payoffB: 0 },
    { rowStrategy: "Defect", columnStrategy: "Defect", payoffA: -3, payoffB: -3 }
  ];
}
