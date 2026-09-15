"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePlayerStore } from "@/store/player-store";
import { formatTime } from "@/lib/format";
import { mockProvider } from "@/domain/mock-provider";
import type { Lyrics } from "@/domain/types";

export function QueuePanel() {
  const {
    currentTrack,
    queue,
    queueIndex,
    currentTimeMs,
    durationMs,
    seek,
    status,
    autoplay,
    toggleAutoplay,
    playTrackAtIndex,
    clearQueue,
  } = usePlayerStore();

  const [activeTab, setActiveTab] = useState<"queue" | "lyrics">("queue");
  const [lyrics, setLyrics] = useState<Lyrics | null>(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => { setMounted(true); }, []);

  const nextTracks = queue.slice(queueIndex + 1);

  // Fetch lyrics when track changes
  useEffect(() => {
    if (!currentTrack) {
      setLyrics(null);
      return;
    }
    let cancelled = false;
    setLoadingLyrics(true);
    mockProvider.getLyrics(currentTrack.id).then((result) => {
      if (!cancelled) {
        setLyrics(result);
        setLoadingLyrics(false);
      }
    });
    return () => { cancelled = true; };
  }, [currentTrack?.id]);

  // Find current lyric line index
  const currentLineIndex = lyrics
    ? (() => {
        for (let i = lyrics.lines.length - 1; i >= 0; i--) {
          if (currentTimeMs >= lyrics.lines[i].startMs) return i;
        }
        return 0;
      })()
    : -1;

  // Auto-scroll to current line
  const scrollToLine = useCallback((index: number) => {
    const el = lineRefs.current.get(index);
    if (el && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const elTop = el.offsetTop;
      const elHeight = el.offsetHeight;
      const containerHeight = container.clientHeight;
      const scrollTop = elTop - containerHeight / 2 + elHeight / 2;
      container.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (activeTab === "lyrics" && currentLineIndex >= 0) {
      scrollToLine(currentLineIndex);
    }
  }, [currentLineIndex, activeTab, scrollToLine]);

  const handleLineClick = (startMs: number) => {
    seek(startMs);
  };

  return (
    <aside
      style={{
        borderLeft: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => setActiveTab("queue")}
          style={{
            padding: "20px 10px",
            fontFamily: "var(--mono)",
            textTransform: "uppercase",
            letterSpacing: ".14em",
            fontSize: "11px",
            color: activeTab === "queue" ? "var(--orange)" : "var(--cream-hint)",
            borderBottom: activeTab === "queue" ? "2px solid var(--orange)" : "2px solid transparent",
            marginBottom: "-1px",
            background: "none",
          }}
        >
          queue
        </button>
        <button
          onClick={() => setActiveTab("lyrics")}
          style={{
            padding: "20px 10px",
            fontFamily: "var(--mono)",
            textTransform: "uppercase",
            letterSpacing: ".14em",
            fontSize: "11px",
            color: activeTab === "lyrics" ? "var(--orange)" : "var(--cream-hint)",
            borderBottom: activeTab === "lyrics" ? "2px solid var(--orange)" : "2px solid transparent",
            marginBottom: "-1px",
            background: "none",
            borderLeft: "1px solid var(--border)",
          }}
        >
          lyrics
        </button>
      </div>

      {/* Scrollable pane */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Now playing */}
        <div
          style={{
            padding: "24px 22px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {currentTrack ? (
            <>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  border: "1px solid var(--border)",
                  filter: "grayscale(1) contrast(1.05)",
                  background: currentTrack.color
                    ? `linear-gradient(135deg, ${currentTrack.color}, ${currentTrack.color}dd)`
                    : "var(--ink-alt)",
                }}
              />
              <div
                style={{
                  fontWeight: 900,
                  fontSize: "34px",
                  lineHeight: 0.95,
                  letterSpacing: "-.03em",
                  textTransform: "lowercase",
                  marginTop: "18px",
                }}
              >
                {currentTrack.title.toLowerCase()}
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "var(--cream-muted)",
                  marginTop: "10px",
                }}
              >
                {currentTrack.artists.map((a) => a.name).join(", ")}
              </div>

              {/* Seek */}
              <div style={{ marginTop: "18px" }}>
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "var(--mono)",
                    fontSize: "10px",
                    letterSpacing: ".1em",
                    color: "var(--cream-hint)",
                    marginTop: "8px",
                  }}
                >
                  <span>{formatTime(currentTimeMs)}</span>
                  <span>{formatTime(durationMs)}</span>
                </div>
              </div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "24px 0",
                color: "var(--cream-muted)",
                fontSize: "14px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "10px",
                }}
              >
                no track playing
              </span>
            </div>
          )}
        </div>

        {/* Queue tab content */}
        {activeTab === "queue" && (
          <>
            {/* Queue header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 22px 12px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  textTransform: "uppercase",
                  letterSpacing: ".14em",
                  fontSize: "10px",
                  color: "var(--cream-hint)",
                }}
              >
                next in queue
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
                clear
              </button>
            </div>

            {/* Queue items */}
            <div>
              {nextTracks.length > 0 ? (
                nextTracks.map((track, i) => {
                  const absoluteIndex = queueIndex + 1 + i;
                  return (
                    <div
                      key={`${track.id}-${absoluteIndex}`}
                      onClick={() => playTrackAtIndex(absoluteIndex)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "26px 40px 1fr auto",
                        gap: "12px",
                        alignItems: "center",
                        padding: "10px 22px",
                        borderTop: "1px solid var(--border)",
                        cursor: "pointer",
                      }}
                      className="hover:!bg-[var(--ink-alt)] group"
                    >
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: "10px",
                          letterSpacing: ".1em",
                          color: "var(--cream-hint)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          filter: "grayscale(1)",
                          background:
                            track.color || "var(--ink-alt)",
                        }}
                        className="group-hover:!filter-none transition-all"
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "15px",
                            textTransform: "lowercase",
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
                          {track.artists
                            .map((a) => a.name)
                            .join(", ")}
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: "10px",
                          letterSpacing: ".1em",
                          color: "var(--cream-hint)",
                        }}
                      >
                        {formatTime(track.durationMs)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: "16px 22px",
                    textAlign: "center",
                    fontFamily: "var(--mono)",
                    fontSize: "10px",
                    color: "var(--cream-hint)",
                  }}
                >
                  queue is empty
                </div>
              )}
            </div>

            {/* Autoplay */}
            {mounted && (
            <div
              onClick={toggleAutoplay}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 22px",
                borderTop: "1px solid var(--border)",
                fontFamily: "var(--mono)",
                textTransform: "uppercase",
                letterSpacing: ".14em",
                fontSize: "10px",
                color: "var(--cream-muted)",
                cursor: "pointer",
              }}
            >
              <span>autoplay</span>
              <div
                style={{
                  width: "38px",
                  height: "18px",
                  background: autoplay
                    ? "var(--orange)"
                    : "var(--border)",
                  padding: "2px",
                  display: "flex",
                  justifyContent: autoplay ? "flex-end" : "flex-start",
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    background: autoplay ? "var(--ink)" : "var(--cream-muted)",
                    transition: "all 0.2s",
                  }}
                />
              </div>
            </div>
            )}
          </>
        )}

        {/* Lyrics tab content */}
        {activeTab === "lyrics" && (
          <div
            ref={lyricsContainerRef}
            style={{ padding: "24px 22px" }}
          >
            {loadingLyrics ? (
              <div
                style={{
                  textAlign: "center",
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "var(--cream-hint)",
                  padding: "40px 0",
                }}
              >
                loading lyrics...
              </div>
            ) : lyrics && lyrics.lines.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {lyrics.lines.map((line, i) => {
                  const isCurrent = i === currentLineIndex;
                  const isPast = i < currentLineIndex;
                  const opacity = isCurrent ? 1.0 : isPast ? 0.7 : 0.3;

                  return (
                    <div
                      key={`${line.startMs}-${i}`}
                      ref={(el) => {
                        if (el) lineRefs.current.set(i, el);
                        else lineRefs.current.delete(i);
                      }}
                      onClick={() => handleLineClick(line.startMs)}
                      style={{
                        fontFamily: isCurrent ? "var(--sans)" : "var(--sans)",
                        fontWeight: isCurrent ? 800 : 500,
                        fontSize: isCurrent ? "22px" : "16px",
                        lineHeight: 1.4,
                        color: isCurrent
                          ? "var(--cream)"
                          : "var(--cream-muted)",
                        opacity,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        textTransform: "lowercase",
                        letterSpacing: isCurrent ? "-.02em" : "0",
                      }}
                      className="hover:!opacity-100"
                    >
                      {line.text}
                    </div>
                  );
                })}
              </div>
            ) : currentTrack ? (
              <div
                style={{
                  textAlign: "center",
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "var(--cream-hint)",
                  padding: "40px 0",
                }}
              >
                no lyrics available
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "var(--cream-hint)",
                  padding: "40px 0",
                }}
              >
                play a track to see lyrics
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
