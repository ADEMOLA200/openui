"use client";

import { GitHubIcon } from "@/components/brand-logo";
import { useTheme } from "next-themes";
import { ClipboardCommandButton, PillLink } from "../../components/Button/Button";
import styles from "./HeroSection.module.css";

// CTAs
const primaryCTA = "npx @openuidev/cli@latest create";
const secondaryCTA = "Try Playground";
const DESKTOP_HERO_IMAGE = {
  light: "/homepage/hero-web.png",
  dark: "/homepage/hero-web-dark.png",
  width: 2040,
  height: 704,
} as const;
const MOBILE_HERO_IMAGE = {
  light: "/homepage/mobile-hero.png",
  dark: "/homepage/mobile-hero-dark.png",
  width: 804,
  height: 880,
} as const;

type HeroTheme = "light" | "dark";
// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

function NpmButton({ className = "" }: { className?: string }) {
  return (
    <ClipboardCommandButton
      command={primaryCTA}
      className={`${styles.npmButton} ${className}`.trim()}
      iconContainerClassName={styles.npmIconBadge}
      copyIconColor="white"
    >
      <span className={styles.npmDesktopLabel}>{primaryCTA}</span>
      <span className={styles.npmMobileLabel}>
        <span className={styles.npmTicker}>
          <span className={styles.npmTickerText}>{primaryCTA}</span>
          <span aria-hidden="true" className={styles.npmTickerText}>
            {primaryCTA}
          </span>
        </span>
      </span>
    </ClipboardCommandButton>
  );
}

function DesktopPlaygroundButton({ className = "" }: { className?: string }) {
  return (
    <PillLink
      href="/playground"
      className={`${styles.desktopPlaygroundButton} ${className}`.trim()}
      arrow={<span aria-hidden="true">→</span>}
    >
      <span>{secondaryCTA}</span>
    </PillLink>
  );
}

function MobilePlaygroundButton({ className = "" }: { className?: string }) {
  return (
    <PillLink
      href="/playground"
      className={`${styles.mobilePlaygroundButton} ${className}`.trim()}
      arrow={
        <span aria-hidden="true" className={styles.mobilePlaygroundArrow}>
          →
        </span>
      }
    >
      <span className={styles.mobilePlaygroundLabel}>{secondaryCTA}</span>
    </PillLink>
  );
}

// ---------------------------------------------------------------------------
// Desktop hero
// ---------------------------------------------------------------------------

function DesktopHero() {
  return (
    <div className={styles.desktopHero}>
      <div className={styles.desktopHeroInner}>
        <div className={styles.desktopHeroLockup}>
          <h1 className={styles.desktopTitle}>OpenUI</h1>
          <p className={styles.desktopSubtitle}>
            The Open Standard
            <br />
            for Generative UI
          </p>
        </div>

        <div className={styles.desktopCtaStack}>
          <NpmButton />
          <DesktopPlaygroundButton />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile hero
// ---------------------------------------------------------------------------

function MobileHero({ theme }: { theme: HeroTheme }) {
  const mobileHeroImage = theme === "dark" ? MOBILE_HERO_IMAGE.dark : MOBILE_HERO_IMAGE.light;

  return (
    <div className={styles.mobileHero}>
      <div className={styles.mobileHeroIntro}>
        <div className={styles.mobileHeroStack}>
          <a
            href="https://github.com/thesysdev/openui"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileGithubBanner}
          >
            <span className={styles.mobileGithubBannerLead}>
              <span aria-hidden="true" className={styles.mobileGithubBannerIcon}>
                <GitHubIcon />
              </span>
              <span>Star us on Github</span>
            </span>
            <span aria-hidden="true" className={styles.mobileGithubBannerArrow}>
              →
            </span>
          </a>

          <div className={styles.mobileBrandGroup}>
            <p className={styles.mobileTitle}>OpenUI</p>
          </div>

          {/* Subtitle */}
          <p className={styles.mobileSubtitle}>
            The Open Standard
            <br />
            for Generative UI
          </p>
        </div>
      </div>

      {/* CTA buttons */}
      <div className={styles.mobileCtaStack}>
        <MobilePlaygroundButton className={styles.mobileCtaButtonWidth} />
        <NpmButton className={styles.mobileCtaButtonWidth} />
      </div>

      {/* Mobile hero image */}
      <div className={styles.mobileIllustrationViewport}>
        <img
          src={mobileHeroImage}
          alt="OpenUI mobile hero preview"
          width={MOBILE_HERO_IMAGE.width}
          height={MOBILE_HERO_IMAGE.height}
          className={styles.mobileIllustrationImage}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop preview image
// ---------------------------------------------------------------------------

function PreviewImage({ theme }: { theme: HeroTheme }) {
  const desktopHeroImage = theme === "dark" ? DESKTOP_HERO_IMAGE.dark : DESKTOP_HERO_IMAGE.light;

  return (
    <div className={styles.previewSection}>
      <div className={styles.previewDesktopOnly}>
        <div className={styles.previewFrame}>
          <img
            src={desktopHeroImage}
            alt="OpenUI desktop hero preview"
            width={DESKTOP_HERO_IMAGE.width}
            height={DESKTOP_HERO_IMAGE.height}
            className={styles.previewImage}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tagline
// ---------------------------------------------------------------------------

function Tagline() {
  return (
    <div className={styles.taglineSection}>
      <div className={styles.taglineContainer}>
        <p className={styles.tagline}>
          An open source toolkit to make your <br className={styles.taglineBreak} />
          AI apps respond with your UI.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function HeroSection() {
  const { resolvedTheme } = useTheme();
  const theme: HeroTheme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <section className={styles.section}>
      <DesktopHero />
      <MobileHero theme={theme} />
      <PreviewImage theme={theme} />
      <Tagline />
    </section>
  );
}
