"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mockProvider } from "@/domain/mock-provider";
import { AlbumArt } from "./AlbumArt";
import { usePlayerStore } from "@/store/player-store";

const navItems = [
  { ic: "01", label: "home", href: "/" },
  { ic: "03", label: "search", href: "/search" },
];

const libraryItems = [
  { ic: "\u2661", label: "favorites", href: "/library/favorites" },
  { ic: "\u266b", label: "browse", href: "/library/browse" },
  { ic: "\u25a3", label: "albums", href: "/library/albums" },
  { ic: "\u25cf", label: "artists", href: "/library/artists" },
  { ic: "\u2630", label: "queue", href: "/library/queue" },
  { ic: "\u2261", label: "tracks", href: "/library/tracks" },
];

export function Sidebar() {
  const pathname = usePathname();
  const playlists = mockProvider.getPlaylists();
  const useMock = usePlayerStore((s) => s.useMock);
  const toggleProvider = usePlayerStore((s) => s.toggleProvider);

  return (
    <aside
      className="flex flex-col overflow-y-auto"
      style={{
        borderRight: "1px solid var(--border)",
        padding: "0 0 24px",
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: "24px 22px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "baseline",
          gap: "10px",
        }}
      >
        <span
          style={{
            fontWeight: 900,
            fontSize: "26px",
            letterSpacing: "-.03em",
            textTransform: "lowercase",
          }}
        >
          echoweb
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "10px",
            letterSpacing: ".14em",
            color: "var(--cream-hint)",
            textTransform: "uppercase",
          }}
        >
          v0.1
        </span>
      </div>

      {/* Discover nav */}
      <div style={{ padding: "20px 0 4px" }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            textTransform: "uppercase",
            letterSpacing: ".14em",
            fontSize: "10px",
            color: "var(--cream-hint)",
            padding: "0 22px 12px",
          }}
        >
          discover
        </div>
        <nav className="grid" style={{ gap: 0 }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                width: "100%",
                textAlign: "left",
                padding: "10px 22px",
                color: pathname === item.href ? "var(--cream)" : "var(--cream-muted)",
                fontSize: "16px",
                textDecoration: "none",
                borderLeft: pathname === item.href ? "2px solid var(--orange)" : "2px solid transparent",
                background: pathname === item.href ? "var(--ink-alt)" : "transparent",
              }}
              className="hover:!bg-[var(--ink-alt)] hover:!text-[var(--cream)]"
            >
              <span
                style={{
                  width: "18px",
                  fontFamily: "var(--mono)",
                  fontSize: "13px",
                  color: "var(--orange)",
                  textAlign: "center",
                }}
              >
                {item.ic}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Hairline */}
      <div style={{ height: "1px", background: "var(--border)", margin: "0" }} />

      {/* Library nav */}
      <div style={{ padding: "20px 0 4px" }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            textTransform: "uppercase",
            letterSpacing: ".14em",
            fontSize: "10px",
            color: "var(--cream-hint)",
            padding: "0 22px 12px",
          }}
        >
          library
        </div>
        <nav className="grid" style={{ gap: 0 }}>
          {libraryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                width: "100%",
                textAlign: "left",
                padding: "10px 22px",
                color: pathname === item.href ? "var(--cream)" : "var(--cream-muted)",
                fontSize: "16px",
                textDecoration: "none",
                borderLeft: pathname === item.href ? "2px solid var(--orange)" : "2px solid transparent",
                background: pathname === item.href ? "var(--ink-alt)" : "transparent",
              }}
              className="hover:!bg-[var(--ink-alt)] hover:!text-[var(--cream)]"
            >
              <span
                style={{
                  width: "18px",
                  fontFamily: "var(--mono)",
                  fontSize: "13px",
                  color: "var(--orange)",
                  textAlign: "center",
                }}
              >
                {item.ic}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Hairline */}
      <div style={{ height: "1px", background: "var(--border)", margin: "0" }} />

      {/* Playlists */}
      <div style={{ padding: "20px 0 4px" }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            textTransform: "uppercase",
            letterSpacing: ".14em",
            fontSize: "10px",
            color: "var(--cream-hint)",
            padding: "0 22px 12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>your playlists</span>
          <button style={{ color: "var(--orange)", fontFamily: "var(--mono)", fontSize: "12px" }} aria-label="New playlist">
            +
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {playlists.map((pl) => (
            <div
              key={pl.id}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                padding: "9px 22px",
                cursor: "pointer",
              }}
              className="hover:!bg-[var(--ink-alt)]"
            >
              <AlbumArt
                color={mockProvider.getPlaylistColor(pl.id)}
                size={40}
                title={pl.title}
              />
              <div>
                <div style={{ display: "block", fontWeight: 600, fontSize: "15px", lineHeight: 1.2 }}>
                  {pl.title.toLowerCase()}
                </div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "10px",
                    letterSpacing: ".1em",
                    color: "var(--cream-hint)",
                    textTransform: "uppercase",
                  }}
                >
                  {pl.tracks.length} tracks
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hairline */}
      <div style={{ height: "1px", background: "var(--border)", margin: "0" }} />

      {/* Provider toggle */}
      <div style={{ padding: "20px 22px" }}>
        <button
          onClick={toggleProvider}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "10px 0",
            fontFamily: "var(--mono)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            cursor: "pointer",
            background: useMock ? "#f5f0e6" : "var(--orange)",
            color: useMock ? "#2d2d3a" : "var(--ink)",
            border: "1px solid var(--border)",
            transition: "background 0.2s, color 0.2s",
          }}
          className="hover:!opacity-80"
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: useMock ? "#999" : "#0f0",
              display: "inline-block",
            }}
          />
          {useMock ? "mock provider" : "deezer live"}
        </button>
      </div>
    </aside>
  );
}
