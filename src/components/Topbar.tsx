"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/store/player-store";

export function Topbar() {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const useMock = usePlayerStore((s) => s.useMock);
  const toggleProvider = usePlayerStore((s) => s.toggleProvider);

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        display: "flex",
        alignItems: "stretch",
        background: "var(--ink)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <label
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "0 24px",
          height: "64px",
          borderRight: "1px solid var(--border)",
        }}
      >
        <span style={{ fontFamily: "var(--mono)", color: "var(--orange)", fontSize: "15px" }}>/</span>
        <input
          id="search-input"
          type="text"
          placeholder="search tracks, artists, albums, playlists"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit(e);
          }}
          style={{
            flex: 1,
            background: "none",
            border: 0,
            outline: 0,
            fontSize: "16px",
            color: "var(--cream)",
          }}
          className="placeholder:!text-[var(--cream-hint)]"
        />
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "10px",
            letterSpacing: ".12em",
            color: "var(--cream-hint)",
            border: "1px solid var(--border)",
            padding: "5px 8px",
            textTransform: "uppercase",
          }}
        >
          ctrl k
        </span>
      </label>

      {/* Provider toggle badge */}
      {mounted && (
      <button
        onClick={toggleProvider}
        title={useMock ? "Switch to Deezer (live)" : "Switch to Mock (offline)"}
        style={{
          minWidth: "72px",
          display: "grid",
          placeItems: "center",
          borderRight: "1px solid var(--border)",
          fontFamily: "var(--mono)",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          cursor: "pointer",
          background: useMock ? "#f5f0e6" : "var(--orange)",
          color: useMock ? "#2d2d3a" : "var(--ink)",
          border: 0,
          padding: "0 12px",
          transition: "background 0.2s, color 0.2s",
        }}
        className="hover:!opacity-80"
      >
        {useMock ? "mock" : "live"}
      </button>
      )}

      <button
        style={{
          width: "64px",
          display: "grid",
          placeItems: "center",
          borderRight: "1px solid var(--border)",
          fontFamily: "var(--mono)",
          fontSize: "14px",
          color: "var(--cream-muted)",
        }}
        className="hover:!text-[var(--orange)]"
        aria-label="Notifications"
      >
        !
      </button>

      <button
        style={{
          width: "64px",
          display: "grid",
          placeItems: "center",
          borderRight: "1px solid var(--border)",
          fontFamily: "var(--mono)",
          fontSize: "14px",
          color: "var(--cream-muted)",
        }}
        className="hover:!text-[var(--orange)]"
        aria-label="Settings"
      >
        =
      </button>

      <div
        style={{
          width: "64px",
          display: "grid",
          placeItems: "center",
          fontWeight: 900,
          fontSize: "18px",
          background: "var(--orange)",
          color: "var(--ink)",
        }}
      >
        d
      </div>
    </div>
  );
}
