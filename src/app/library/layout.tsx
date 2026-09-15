"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Topbar } from "@/components/Topbar";

const tabs = [
  { label: "browse", href: "/library/browse" },
  { label: "favorites", href: "/library/favorites" },
  { label: "albums", href: "/library/albums" },
  { label: "artists", href: "/library/artists" },
  { label: "queue", href: "/library/queue" },
  { label: "tracks", href: "/library/tracks" },
];

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  const pathname: string = usePathname() ?? "";




  // Find active tab
  const activeHref = tabs.find((t) => pathname.startsWith(t.href))?.href || "/library/browse";

  return (
    <>
      <Topbar />

      {/* Hero */}
      <section
        style={{
          background: "var(--ink-alt)",
          padding: "40px 40px 0",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "8px" }}>
          <span
            style={{
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
              letterSpacing: ".14em",
              fontSize: "11px",
              color: "var(--orange)",
            }}
          >
            library
          </span>
        </div>
        <h1
          style={{
            fontWeight: 900,
            fontSize: "42px",
            lineHeight: 1,
            letterSpacing: "-.03em",
            textTransform: "lowercase",
            margin: 0,
          }}
        >
          your music
        </h1>
      </section>

      {/* Tabs */}
      <div
        className="hide-scrollbar"
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          marginLeft: "40px",
          marginRight: "40px",
          overflow: "auto",
        }}
      >
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              padding: "20px 18px",
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
              letterSpacing: ".14em",
              fontSize: "11px",
              color: activeHref === tab.href ? "var(--orange)" : "var(--cream-hint)",
              borderBottom: activeHref === tab.href ? "2px solid var(--orange)" : "2px solid transparent",
              marginBottom: "-1px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              borderLeft: tab.href !== tabs[0].href ? "1px solid var(--border)" : "none",
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "0 40px" }}>
        {children}
      </div>

      <div style={{ height: "32px" }} />
    </>
  );
}
