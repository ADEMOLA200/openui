"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./site-primary-nav.module.css";

export const PRIMARY_SITE_NAV_ITEMS = [
  { title: "OpenUI Lang", href: "/docs/openui-lang" },
  { title: "Playground", href: "/playground" },
  { title: "API Reference", href: "/docs/api-reference" },
  { title: "Blog", href: "/blog" },
] as const;

export function SitePrimaryNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {PRIMARY_SITE_NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.link} ${isActive ? styles.linkActive : ""}`.trim()}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
