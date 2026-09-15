"use client";

import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { QueuePanel } from "./QueuePanel";
import { PlayerFooter } from "./PlayerFooter";
import { usePlayerStore } from "@/store/player-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const queueVisible = usePlayerStore((s) => s.queueVisible);
  const restoreState = usePlayerStore((s) => s.restoreState);

  // Restore persisted queue/volume on mount
  useEffect(() => {
    restoreState();
  }, [restoreState]);

  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        gridTemplateColumns: queueVisible
          ? "var(--rail) minmax(0,1fr) var(--aside)"
          : "var(--rail) minmax(0,1fr)",
        gridTemplateRows: "1fr var(--player)",
      }}
    >
      {/* Sidebar */}
      <div style={{ gridRow: "1/2" }} className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main
        className="overflow-y-auto"
        style={{ gridRow: "1/2" }}
      >
        {children}
      </main>

      {/* Queue panel */}
      {queueVisible && (
        <div style={{ gridRow: "1/2" }} className="hidden lg:block">
          <QueuePanel />
        </div>
      )}

      {/* Player footer */}
      <div style={{ gridColumn: "1/-1", gridRow: "2" }}>
        <PlayerFooter />
      </div>
    </div>
  );
}
