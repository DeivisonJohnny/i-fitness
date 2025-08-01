import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setStateTheme] = useState<"light" | "dark" | string>("light");

  useEffect(() => {
    const themeSaved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const themeInitial = themeSaved ?? (prefersDark ? "dark" : "light");

    setStateTheme(themeInitial);
    document.documentElement.classList.toggle("dark", themeInitial === "dark");
  }, []);

  const toggleTheme = () => {
    const themeSelected = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", themeSelected);
    setStateTheme(themeSelected);
    document.documentElement.classList.toggle("dark", themeSelected === "dark");
  };

  return { theme, toggleTheme };
};
