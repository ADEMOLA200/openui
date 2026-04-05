import { SiteMarketingHeader } from "@/components/site-marketing-header";
import { KeyRound } from "lucide-react";
import type { ReactNode } from "react";
import { Theme } from "../../constants";
import "./Header.css";

type HeaderProps = {
  theme: Theme;
  onThemeToggle: () => void;
  hasApiKey: boolean;
  onChangeKey: () => void;
};

export function Header({
  theme,
  onThemeToggle,
  hasApiKey,
  onChangeKey,
}: HeaderProps) {
  const themeLabel = { system: "System", light: "Light", dark: "Dark" }[theme];
  const extraActions: ReactNode = hasApiKey ? (
    <button
      className="header-btn header-icon-btn"
      onClick={onChangeKey}
      title="Change API Key"
      aria-label="Change API Key"
    >
      <KeyRound size={15} />
    </button>
  ) : null;

  return (
    <SiteMarketingHeader
      borderMode="always"
      extraActions={extraActions}
      themeToggle={{
        onToggle: onThemeToggle,
        title: `Theme: ${themeLabel}`,
        ariaLabel: `Switch theme (current: ${themeLabel})`,
      }}
    />
  );
}
