"use client";

import { ThemeProvider } from "@openuidev/react-ui/ThemeProvider";
import { useTheme } from "next-themes";
import { useEffect, type ReactNode } from "react";

const FONT_FAMILY = 'var(--font-inter), "Inter", "Segoe UI", Arial, sans-serif';
const FONT_CODE = 'var(--font-geist-mono), "SFMono-Regular", Menlo, monospace';

const fontOverrides = {
  fontBody: FONT_FAMILY,
  fontCode: FONT_CODE,
  fontHeading: FONT_FAMILY,
  fontLabel: FONT_FAMILY,
  fontNumbers: FONT_FAMILY,
};

type WebsiteThemeProviderProps = {
  children: ReactNode;
};

export function WebsiteThemeProvider({ children }: WebsiteThemeProviderProps) {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  return (
    <ThemeProvider mode={mode} lightTheme={fontOverrides}>
      {children}
    </ThemeProvider>
  );
}
