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
        glow: "0 20px 60px rgba(0, 0, 0, 0.16)",
        glass: "0 18px 44px rgba(0, 0, 0, 0.12)"
      },
      backgroundImage: {
        "aurora-soft":
          "linear-gradient(135deg, rgba(255,255,255,1), rgba(239,239,239,0.94))",
        "aurora-dark":
          "linear-gradient(135deg, #050505, #111111 58%, #050505)"
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
