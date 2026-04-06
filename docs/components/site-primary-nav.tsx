"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./site-primary-nav.module.css";

export const PRIMARY_SITE_NAV_ITEMS = [
  { title: "Docs", href: "/docs" },
  { title: "Playground", href: "/playground" },
  { title: "Blogs", href: "/blog" },
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
