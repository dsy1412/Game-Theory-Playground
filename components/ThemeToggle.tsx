"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("gtp-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldDark = stored ? stored === "dark" : prefersDark;
    setDark(shouldDark);
    document.documentElement.classList.toggle("dark", shouldDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("gtp-theme", next ? "dark" : "light");
  }

  return (
    <Button variant="secondary" size="icon" aria-label="Toggle theme" onClick={toggle}>
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
