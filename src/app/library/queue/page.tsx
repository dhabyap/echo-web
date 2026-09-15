"use client";

import { usePlayerStore } from "@/store/player-store";
import { formatTime } from "@/lib/format";

export default function QueuePage() {
  const {
    queue,
    queueIndex,
    currentTrack,
    playTrackAtIndex,
    removeFromQueue,
    clearQueue,
  } = usePlayerStore();

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newQueue = [...queue];
    [newQueue[index - 1], newQueue[index]] = [newQueue[index], newQueue[index - 1]];
    usePlayerStore.setState({ queue: newQueue });
  };

  const handleMoveDown = (index: number) => {
    if (index >= queue.length - 1) return;
    const newQueue = [...queue];
    [newQueue[index], newQueue[index + 1]] = [newQueue[index + 1], newQueue[index]];
    usePlayerStore.setState({ queue: newQueue });
  };

  return (
    <div style={{ paddingTop: "28px" }}>
      {/* Queue header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "11px",
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "var(--cream-hint)",
          }}
        >
          {queue.length} {queue.length === 1 ? "track" : "tracks"} in queue
        </span>
        <button
          onClick={clearQueue}
          style={{
            fontFamily: "var(--mono)",
            textTransform: "uppercase",
            letterSpacing: ".14em",
            fontSize: "10px",
            color: "var(--orange)",
          }}
          className="hover:!text-[var(--cream)]"
        >
          clear all
        </button>
      </div>

      {/* Queue items */}
      {queue.length > 0 ? (
        <div>
          {queue.map((track, i) => {
            const isCurrent = i === queueIndex;
            return (
              <div
                key={`${track.id}-${i}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "50px 36px 1fr 120px 56px",
                  gap: "12px",
                  alignItems: "center",
                  padding: "12px 0",
                  borderTop: "1px solid var(--border)",
                  background: isCurrent ? "var(--ink-alt)" : "transparent",
                }}
              >
                {/* Reorder buttons */}
                <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                  <button
                    onClick={() => handleMoveUp(i)}
                    disabled={i === 0}
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "11px",
                      color: i === 0 ? "var(--cream-hint)" : "var(--cream-muted)",
                      background: "none",
                      border: 0,
                      cursor: i === 0 ? "default" : "pointer",
                      padding: "2px 4px",
                    }}
                    className={i > 0 ? "hover:!text-[var(--orange)]" : ""}
                    aria-label="Move up"
                  >
                    {"\u2191"}
                  </button>
                  <button
                    onClick={() => handleMoveDown(i)}
                    disabled={i === queue.length - 1}
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "11px",
                      color: i === queue.length - 1 ? "var(--cream-hint)" : "var(--cream-muted)",
                      background: "none",
                      border: 0,
                      cursor: i === queue.length - 1 ? "default" : "pointer",
                      padding: "2px 4px",
                    }}
                    className={i < queue.length - 1 ? "hover:!text-[var(--orange)]" : ""}
                    aria-label="Move down"
                  >
                    {"\u2193"}
                  </button>
                </div>

                {/* Index */}
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "11px",
                    letterSpacing: ".1em",
                    color: isCurrent ? "var(--orange)" : "var(--cream-hint)",
                    textAlign: "center",
                  }}
                >
                  {isCurrent ? "/" : String(i + 1).padStart(2, "0")}
                </div>

                {/* Track info */}
                <div
                  style={{ minWidth: 0, cursor: "pointer" }}
                  onClick={() => playTrackAtIndex(i)}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "15px",
                      textTransform: "lowercase",
                      color: isCurrent ? "var(--orange)" : "var(--cream)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {track.title.toLowerCase()}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "10px",
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "var(--cream-hint)",
                    }}
                  >
                    {track.artists.map((a) => a.name).join(", ")}
                  </div>
                </div>

                {/* Duration */}
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "11px",
                    letterSpacing: ".08em",
                    color: "var(--cream-muted)",
                    textAlign: "right",
                  }}
                >
                  {formatTime(track.durationMs)}
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromQueue(i)}
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "11px",
                    color: "var(--cream-hint)",
                    background: "none",
                    border: 0,
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  className="hover:!text-[var(--orange)]"
                  aria-label="Remove from queue"
                >
                  {"\u00d7"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 0",
            color: "var(--cream-muted)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "11px",
              letterSpacing: ".14em",
              textTransform: "uppercase",
            }}
          >
            queue is empty
          </span>
        </div>
      )}
    </div>
  );
}
