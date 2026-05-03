# Game Theory Playground

An Apple-style interactive learning website for beginner-friendly game theory concepts.

## Features

- 10 interactive simulations: rent splitting, Prisoner's Dilemma, Nash equilibrium, Vickrey auction, envy-free allocation, Shapley value, Bertrand competition, tragedy of the commons, ultimatum game, and matching markets.
- English and Chinese entry points: `/` and `/zh`.
- Animated UI with Framer Motion, D3 heatmaps, payoff matrices, sliders, draggable rankings, counters, and progress tracking.
- All calculations run in the browser with reusable TypeScript logic in `lib/gameTheory.ts`.
- Responsive dark/light glassmorphism interface.

## Tech Stack

Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, D3.js, lucide-react, and shadcn-style local UI components.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Build

```bash
npm run build
```

## Notes

This workspace includes `scripts/readlink-patch.cjs` so Next.js can build reliably from the current Windows `G:` drive filesystem.
