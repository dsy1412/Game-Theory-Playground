import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(59, 130, 246, 0.22)",
        glass: "0 20px 70px rgba(15, 23, 42, 0.14)"
      },
      backgroundImage: {
        "aurora-soft":
          "radial-gradient(circle at 18% 20%, rgba(45, 212, 191, 0.20), transparent 28%), radial-gradient(circle at 82% 8%, rgba(99, 102, 241, 0.18), transparent 30%), linear-gradient(135deg, rgba(255,255,255,0.95), rgba(241,245,249,0.72))",
        "aurora-dark":
          "radial-gradient(circle at 12% 16%, rgba(45, 212, 191, 0.18), transparent 30%), radial-gradient(circle at 86% 12%, rgba(147, 197, 253, 0.15), transparent 32%), linear-gradient(135deg, #020617, #111827 58%, #0f172a)"
      },
      animation: {
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2.8s ease-in-out infinite"
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.62" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
