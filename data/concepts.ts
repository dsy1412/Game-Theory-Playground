import type { Concept, MatchPreference, Player, Room } from "@/lib/types";

export const players: Player[] = [
  { id: "ava", name: "Ava", color: "#2563eb" },
  { id: "ben", name: "Ben", color: "#0f766e" },
  { id: "chloe", name: "Chloe", color: "#db2777" }
];

export const rooms: Room[] = [
  {
    id: "large-window",
    name: "Large Room",
    description: "Floor-to-ceiling window",
    quality: 96
  },
  {
    id: "medium-bed",
    name: "Medium Room",
    description: "1.8m bed and balanced light",
    quality: 76
  },
  {
    id: "small-room",
    name: "Small Room",
    description: "Quiet, no window view",
    quality: 52
  }
];

export const initialRentBids = {
  ava: {
    "large-window": 760,
    "medium-bed": 520,
    "small-room": 320
  },
  ben: {
    "large-window": 620,
    "medium-bed": 610,
    "small-room": 370
  },
  chloe: {
    "large-window": 540,
    "medium-bed": 470,
    "small-room": 590
  }
};

export const cakeValuations = {
  Ava: { cream: 1, chocolate: 0.32, fruit: 0.5 },
  Ben: { cream: 0.3, chocolate: 1, fruit: 0.36 },
  Chloe: { cream: 0.34, chocolate: 0.42, fruit: 1 }
};

export const matchingPreferences: {
  proposers: MatchPreference[];
  receivers: MatchPreference[];
} = {
  proposers: [
    { id: "Mina", rankings: ["North", "River", "Central"] },
    { id: "Owen", rankings: ["River", "Central", "North"] },
    { id: "Priya", rankings: ["River", "North", "Central"] }
  ],
  receivers: [
    { id: "North", rankings: ["Priya", "Mina", "Owen"] },
    { id: "River", rankings: ["Mina", "Owen", "Priya"] },
    { id: "Central", rankings: ["Owen", "Priya", "Mina"] }
  ]
};

export const concepts: Concept[] = [
  {
    slug: "split-rent-fairly",
    title: "Split Rent Fairly",
    shortTitle: "Split Rent Fairly",
    subtitle: "Use sealed bids to turn messy room preferences into adjusted rents.",
    scenario: "Three roommates rent a $1600 apartment with rooms that feel valuable for different reasons.",
    formula: "rent_i = value_i(assigned room) - (total assigned value - total rent) / n",
    interpretation: "Everyone gets the same surplus after the assignment, so the person who values a room more pays more.",
    whyItMatters: "A fair division rule can replace awkward negotiation with a transparent process.",
    summary: "Bid honestly, assign rooms by strongest fit, then adjust prices so every roommate keeps equal surplus.",
    accent: "from-sky-500 to-teal-400",
    icon: "Home"
  },
  {
    slug: "prisoners-dilemma",
    title: "Prisoner’s Dilemma",
    shortTitle: "Prisoner’s Dilemma",
    subtitle: "See why individually sensible choices can make everyone worse off.",
    scenario: "Two roommates are accused of stealing takeout and must stay silent or betray each other.",
    formula: "Defect dominates because u(defect, s_other) > u(cooperate, s_other)",
    interpretation: "Betrayal is individually safer, but mutual silence creates the best shared outcome.",
    whyItMatters: "Many trust problems in teams, markets, and politics have this same shape.",
    summary: "Rational self-protection can destroy value unless repetition, norms, or trust change incentives.",
    accent: "from-rose-500 to-amber-400",
    icon: "Scale"
  },
  {
    slug: "nash-equilibrium",
    title: "Nash Equilibrium",
    shortTitle: "Nash Equilibrium",
    subtitle: "Drag competitors and watch when no one wants to move alone.",
    scenario: "Two milk tea shops choose where to locate between downtown crowds and suburban calm.",
    formula: "u_i(s_i, s_-i) >= u_i(s'_i, s_-i) for every alternative s'_i",
    interpretation: "A profile is stable when unilateral movement cannot improve anyone’s payoff.",
    whyItMatters: "Equilibrium explains why stable patterns can persist even when they are not perfect.",
    summary: "A Nash equilibrium is a strategic resting point: each player is best-responding to the others.",
    accent: "from-indigo-500 to-cyan-400",
    icon: "Map"
  },
  {
    slug: "vickrey-auction",
    title: "Vickrey Auction",
    shortTitle: "Vickrey Auction",
    subtitle: "Bid for the best room, win with the highest bid, pay the second price.",
    scenario: "Three roommates submit sealed bids for the most desirable bedroom.",
    formula: "winner = argmax bid_i, payment = second-highest bid",
    interpretation: "Your bid decides whether you win, but not the price you pay once you win.",
    whyItMatters: "Second-price auctions power truthful bidding ideas used in ad markets and marketplaces.",
    summary: "Truth-telling is attractive because shading your bid mostly risks losing items you truly value.",
    accent: "from-violet-500 to-sky-400",
    icon: "BadgeDollarSign"
  },
  {
    slug: "envy-free-allocation",
    title: "Envy-Free Allocation",
    shortTitle: "Envy-Free Allocation",
    subtitle: "Cut a cake so nobody prefers someone else’s piece.",
    scenario: "Ava likes cream, Ben loves chocolate, and Chloe wants fruit.",
    formula: "v_i(A_i) >= v_i(A_j) for every pair i, j",
    interpretation: "Fairness is judged by each person’s own preferences, not by physical size alone.",
    whyItMatters: "Envy-freeness helps reason about fair chores, inheritance, scheduling, and shared resources.",
    summary: "An allocation is envy-free when every person values their own bundle at least as much as every other bundle.",
    accent: "from-fuchsia-500 to-orange-400",
    icon: "CakeSlice"
  },
  {
    slug: "shapley-value",
    title: "Shapley Value",
    shortTitle: "Shapley Value",
    subtitle: "Average each teammate’s marginal contribution across every joining order.",
    scenario: "Three teammates produce a $1000 project, but their value depends on who collaborates.",
    formula: "phi_i = sum_S |S|!(n-|S|-1)!/n! * [v(S union {i}) - v(S)]",
    interpretation: "Fair payment is the average value a person adds when arriving to every possible team.",
    whyItMatters: "The Shapley value is used for bonuses, cost sharing, attribution, and cooperative AI analysis.",
    summary: "Instead of arguing about credit, measure how much each person changes the value of every coalition.",
    accent: "from-emerald-500 to-blue-400",
    icon: "UsersRound"
  },
  {
    slug: "bertrand-competition",
    title: "Bertrand Competition",
    shortTitle: "Bertrand Competition",
    subtitle: "Move prices and watch customers rush toward the cheaper identical product.",
    scenario: "Two convenience stores sell identical cola to the same neighborhood.",
    formula: "profit = (price - cost) * quantity",
    interpretation: "A tiny undercut can capture demand, so price competition pushes margins downward.",
    whyItMatters: "It explains price wars, commodity markets, and why differentiation protects profit.",
    summary: "When products are identical and customers choose the cheaper option, competition can drive price toward cost.",
    accent: "from-lime-500 to-cyan-400",
    icon: "Store"
  },
  {
    slug: "tragedy-of-the-commons",
    title: "Tragedy of the Commons",
    shortTitle: "Commons",
    subtitle: "Increase individual usage and watch the shared resource strain over time.",
    scenario: "Three people share a pond where fish regenerate only if usage stays moderate.",
    formula: "resource_next = resource - total usage + regeneration",
    interpretation: "Individual gains are private, while depletion costs are shared by everyone.",
    whyItMatters: "Climate, traffic, public goods, and shared infrastructure all depend on commons incentives.",
    summary: "Without coordination, reasonable individual use can add up to collective collapse.",
    accent: "from-teal-500 to-blue-500",
    icon: "Waves"
  },
  {
    slug: "ultimatum-game",
    title: "Ultimatum Game",
    shortTitle: "Ultimatum Game",
    subtitle: "Offer a split and compare strict rationality with human fairness.",
    scenario: "Player A splits $100. Player B accepts or rejects the entire deal.",
    formula: "accept if offer > 0 in the rational model; accept if offer >= threshold in the fairness model",
    interpretation: "People often reject low offers because fairness has value too.",
    whyItMatters: "Markets, negotiations, and product pricing all depend on perceived fairness.",
    summary: "A technically profitable offer can still fail when the other side feels disrespected.",
    accent: "from-pink-500 to-red-400",
    icon: "Handshake"
  },
  {
    slug: "matching-market",
    title: "Matching Market",
    shortTitle: "Matching Market",
    subtitle: "Run deferred acceptance and see stable pairs emerge from rankings.",
    scenario: "Students apply to schools, each side ranking the other side differently.",
    formula: "No blocking pair: no unmatched pair both prefer each other over current matches",
    interpretation: "Stable matching removes pairs who would want to abandon the final assignment.",
    whyItMatters: "Matching algorithms help place doctors, students, organ exchanges, and workers.",
    summary: "Gale-Shapley turns ranked preferences into matches where no pair has a mutual reason to defect.",
    accent: "from-blue-500 to-violet-400",
    icon: "Network"
  }
];

export const glossary = [
  ["payoff", "The value a player receives from an outcome."],
  ["strategy", "A complete action plan for a player."],
  ["dominant strategy", "A strategy that is best no matter what others do."],
  ["equilibrium", "A stable strategic pattern where players are best-responding."],
  ["surplus", "Value received minus price or cost paid."],
  ["allocation", "An assignment of goods, rooms, tasks, or resources."],
  ["coalition", "A group of players working together."],
  ["stable matching", "A matching with no pair who both prefer each other over their assigned partners."]
];
