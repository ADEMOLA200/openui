"use client";

import { cn } from "@/lib/cn";
import { SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import styles from "./theme-toggle.module.css";

type ThemeToggleProps = {
  className?: string;
  onToggle?: () => void;
  title?: string;
  ariaLabel?: string;
};

export function ThemeToggle({ className, onToggle, title, ariaLabel }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const defaultLabel = `Switch to ${nextTheme} mode`;

  return (
    <button
      type="button"
      className={cn(styles.button, className)}
      aria-label={ariaLabel ?? defaultLabel}
      title={title ?? ariaLabel ?? defaultLabel}
      onClick={onToggle ?? (() => setTheme(nextTheme))}
      data-theme-toggle=""
    >
      <SunMoon className={styles.icon} strokeWidth={1.5} />
    </button>
  );
}
