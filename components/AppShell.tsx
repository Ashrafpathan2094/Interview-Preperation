"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getTopicMeta } from "@/lib/topicMeta";

export interface NavItem {
  slug: string;
  name: string;
  count: number;
}

function Brand() {
  return (
    <Link href="/" className="brand">
      <span className="brand-mark" aria-hidden>
        ▞
      </span>
      Prep<span className="brand-accent">Hub</span>
    </Link>
  );
}

export default function AppShell({
  nav,
  children,
}: {
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes (link tapped).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open; Escape closes it.
  useEffect(() => {
    document.body.classList.toggle("nav-locked", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("nav-locked");
    };
  }, [open]);

  return (
    <div className="app-shell">
      {/* Mobile-only top bar */}
      <header className="topbar">
        <button
          className="menu-btn"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
        <Brand />
      </header>

      <div
        className={`drawer-overlay${open ? " is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <aside id="site-nav" className={`sidebar${open ? " is-open" : ""}`}>
        <Brand />
        <nav className="side-nav" aria-label="Topics">
          {nav.map((t) => {
            const meta = getTopicMeta(t.slug);
            const active = pathname === `/${t.slug}`;
            return (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                className={`nav-link${active ? " nav-link--active" : ""}`}
                style={{ "--tc": meta.color } as React.CSSProperties}
                aria-current={active ? "page" : undefined}
              >
                <span className="nav-dot" aria-hidden />
                <span className="nav-name">{t.name}</span>
                <span className="nav-count">{t.count}</span>
              </Link>
            );
          })}
        </nav>
        <p className="sidebar-foot">Built for 3+ yrs interviews</p>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
