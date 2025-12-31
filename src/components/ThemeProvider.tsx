"use client";

import { useEffect } from "react";

type Theme = "light" | "dark" | "nature";

interface ThemeProviderProps {
  theme: Theme;
}

export function ThemeProvider({ theme }: ThemeProviderProps) {
  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
