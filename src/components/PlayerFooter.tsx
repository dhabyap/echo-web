"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/store/player-store";
import { formatTime } from "@/lib/format";
export function PlayerFooter() {
  const {
    status,
    currentTrack,
    currentTimeMs,
    durationMs,
    volume,
    shuffle,
    repeat,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleShuffle,
    cycleRepeat,
    initAudio,
    favoriteIds,
    toggleFavorite,
  } = usePlayerStore();

  // Initialize audio engine on mount
  useEffect(() => {
    initAudio();
  }, [initAudio]);

  const isPlaying = status === "playing";
  const isFav = currentTrack ? favoriteIds.includes(currentTrack.id) : false;

  return (
    <footer
      style={{
        display: "grid",
        gridTemplateColumns: "var(--rail) minmax(0,1fr) 300px",
        alignItems: "center",
        borderTop: "1px solid var(--border)",
        background: "var(--ink)",
        height: "100%",
      }}
    >
      {/* Left: Track info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "0 20px",
          height: "100%",
          borderRight: "1px solid var(--border)",
          minWidth: 0,
        }}
      >
        {currentTrack ? (
          <>
            <div
              style={{
                width: "52px",
                height: "52px",
                filter: "grayscale(1)",
                background: currentTrack.color
                  ? `linear-gradient(135deg, ${currentTrack.color}, ${currentTrack.color}dd)`
                  : "var(--ink-alt)",
                borderRadius: 0,
                flexShrink: 0,
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "lowercase",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentTrack.title.toLowerCase()}
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
                {currentTrack.artists.map((a) => a.name).join(", ")}
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: "10px",
              color: "var(--cream-hint)",
            }}
          >
            no track selected
          </div>
        )}
      </div>

      {/* Center: Controls + progress */}
      <div style={{ padding: "0 28px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "22px",
          }}
        >
          <button
            onClick={toggleShuffle}
            style={{
              fontFamily: "var(--mono)",
              fontSize: "13px",
              color: shuffle ? "var(--orange)" : "var(--cream-muted)",
            }}
            className="hover:!text-[var(--orange)]"
          >
            X
          </button>
          <button
            onClick={previous}
            style={{
              fontFamily: "var(--mono)",
              fontSize: "13px",
              color: "var(--cream-muted)",
            }}
            className="hover:!text-[var(--orange)]"
          >
            &lt;&lt;
          </button>
          <button
            onClick={togglePlay}
            style={{
              width: "42px",
              height: "42px",
              background: "var(--orange)",
              color: "var(--ink)",
              display: "grid",
              placeItems: "center",
              fontSize: "14px",
              fontFamily: "var(--mono)",
            }}
            className="hover:!bg-[var(--cream)]"
          >
            {isPlaying ? "II" : ">"}
          </button>
          <button
            onClick={next}
            style={{
              fontFamily: "var(--mono)",
              fontSize: "13px",
              color: "var(--cream-muted)",
            }}
            className="hover:!text-[var(--orange)]"
          >
            &gt;&gt;
          </button>
          <button
            onClick={cycleRepeat}
            style={{
              fontFamily: "var(--mono)",
              fontSize: "13px",
              color:
                repeat !== "off" ? "var(--orange)" : "var(--cream-muted)",
            }}
            className="hover:!text-[var(--orange)]"
            title={`Repeat: ${repeat}`}
          >
            {repeat === "one" ? "O1" : "O"}
          </button>
        </div>

        {/* Progress bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 1fr 40px",
            alignItems: "center",
            gap: "12px",
            marginTop: "10px",
            fontFamily: "var(--mono)",
            fontSize: "10px",
            letterSpacing: ".1em",
            color: "var(--cream-hint)",
          }}
        >
          <span>{formatTime(currentTimeMs)}</span>
          <input
            type="range"
            min={0}
            max={durationMs || 100}
            value={Math.min(currentTimeMs, durationMs || currentTimeMs)}
            onChange={(e) => seek(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "var(--orange)",
            }}
          />
          <span style={{ textAlign: "right" }}>
            {formatTime(durationMs)}
          </span>
        </div>
      </div>

      {/* Right: Volume + extras */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "16px",
          padding: "0 20px",
          height: "100%",
          borderLeft: "1px solid var(--border)",
          fontFamily: "var(--mono)",
          fontSize: "12px",
          color: "var(--cream-muted)",
        }}
      >
        {/* Heart icon */}
        {currentTrack && (
          <button
            onClick={() => toggleFavorite(currentTrack.id)}
            style={{
              fontFamily: "var(--mono)",
              fontSize: "16px",
              color: isFav ? "var(--orange)" : "var(--cream-muted)",
              background: "none",
              border: 0,
              cursor: "pointer",
            }}
            className="hover:!text-[var(--orange)]"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            {isFav ? "\u2665" : "\u2661"}
          </button>
        )}
        <button className="hidden md:block hover:!text-[var(--orange)]">
          queue
        </button>
        <button className="hidden md:block hover:!text-[var(--orange)]">
          lyrics
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ width: "90px", accentColor: "var(--orange)" }}
        />
        <button className="hover:!text-[var(--orange)]">[ ]</button>
      </div>
    </footer>
  );
}
