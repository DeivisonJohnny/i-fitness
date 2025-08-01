"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useTheme as useThemeTailwind } from "@/hooks/useTheme";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { toggleTheme } = useThemeTailwind();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
        toggleTheme();
      }}
      className="h-9 w-9 bg-white dark:bg-background  text-black dark:text-white  "
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
