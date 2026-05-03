export type ConceptSlug =
  | "split-rent-fairly"
  | "prisoners-dilemma"
  | "nash-equilibrium"
  | "vickrey-auction"
  | "envy-free-allocation"
  | "shapley-value"
  | "bertrand-competition"
  | "tragedy-of-the-commons"
  | "ultimatum-game"
  | "matching-market";

export type Concept = {
  slug: ConceptSlug;
  title: string;
  shortTitle: string;
  subtitle: string;
  scenario: string;
  formula: string;
  interpretation: string;
  whyItMatters: string;
  summary: string;
  accent: string;
  icon: string;
};

export type Player = {
  id: string;
  name: string;
  color: string;
};

export type Strategy = {
  id: string;
  label: string;
  description?: string;
};

export type PayoffCell = {
  rowStrategy: string;
  columnStrategy: string;
  payoffA: number;
  payoffB: number;
};

export type PayoffMatrix = PayoffCell[];

export type SimulationResult = {
  label: string;
  value: number | string;
  tone?: "good" | "warn" | "danger" | "neutral";
};

export type AllocationResult = {
  ownerId: string;
  roomId: string;
  valuation: number;
  rent: number;
  surplus: number;
};

export type Bid = {
  bidderId: string;
  amount: number;
};

export type Room = {
  id: string;
  name: string;
  description: string;
  quality: number;
};

export type Roommate = Player;

export type MatchPreference = {
  id: string;
  rankings: string[];
};

export type Position = {
  x: number;
  y: number;
};

export type CakeSegment = {
  start: number;
  end: number;
};

export type MatchingStep = {
  round: number;
  proposer: string;
  receiver: string;
  status: "proposed" | "held" | "rejected" | "swapped";
  message: string;
};
