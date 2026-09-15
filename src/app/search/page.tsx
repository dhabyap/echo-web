"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { mockProvider } from "@/domain/mock-provider";
import { youtubeProvider } from "@/domain/youtube-provider";
import { usePlayerStore } from "@/store/player-store";
import { Topbar } from "@/components/Topbar";
import type { SearchResult, Track } from "@/domain/types";

function SearchContent() {
  const searchParams = useSearchParams()!;

  const { play } = usePlayerStore();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [activeTab, setActiveTab] = useState<"tracks" | "albums" | "artists" | "playlists">("tracks");
  const useMock = usePlayerStore((s) => s.providerName !== "deezer");
  const provider = useMock ? mockProvider : youtubeProvider;


  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    const r = await provider.search(q);
    setResults(r);
  }, []);

  useEffect(() => {
    setQuery(initialQuery);
    if (initialQuery) doSearch(initialQuery);
  }, [initialQuery, doSearch]);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const tabs = [
    { key: "tracks" as const, label: "tracks", count: results?.tracks.length || 0 },
    { key: "albums" as const, label: "albums", count: results?.albums.length || 0 },
    { key: "artists" as const, label: "artists", count: results?.artists.length || 0 },
    { key: "playlists" as const, label: "playlists", count: results?.playlists.length || 0 },
  ];

  return (
    <>
      <Topbar />

      {/* Search header */}
      <section style={{ padding: "36px 40px 8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "16px",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "14px",
            marginBottom: "22px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
              letterSpacing: ".14em",
              fontSize: "11px",
              color: "var(--orange)",
            }}
          >
            03
          </span>
          <h2
            style={{
              fontWeight: 900,
              fontSize: "30px",
              lineHeight: 1,
              letterSpacing: "-.03em",
              textTransform: "lowercase",
              margin: 0,
            }}
          >
            search
          </h2>
          {query && results && (
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "10px",
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "var(--cream-hint)",
              }}
            >
              {results.tracks.length + results.albums.length + results.artists.length + results.playlists.length} results
            </span>
          )}
        </div>
      </section>

      {/* Tabs */}
      {query && results && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            borderBottom: "1px solid var(--border)",
            marginLeft: "40px",
            marginRight: "40px",
          }}
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "20px 10px",
                fontFamily: "var(--mono)",
                textTransform: "uppercase",
                letterSpacing: ".14em",
                fontSize: "11px",
                color: activeTab === tab.key ? "var(--orange)" : "var(--cream-hint)",
                borderBottom: activeTab === tab.key ? "2px solid var(--orange)" : "2px solid transparent",
                marginBottom: "-1px",
                background: "none",
                borderLeft: i > 0 ? "1px solid var(--border)" : "none",
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{ marginLeft: "6px", opacity: 0.6 }}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <div style={{ padding: "0 40px" }}>
        {query && results ? (
          <>
            {/* Tracks */}
            {activeTab === "tracks" && (
              <div>
                {results.tracks.length > 0 ? (
                  results.tracks.map((track, i) => (
                    <SearchTrackRow key={track.id} track={track} index={i} allTracks={results.tracks} play={play} />
                  ))
                ) : (
                  <EmptyState message="no tracks found" />
                )}
              </div>
            )}

            {/* Albums */}
            {activeTab === "albums" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(168px, 1fr))", gap: "20px", paddingTop: "20px" }}>
                {results.albums.length > 0 ? (
                  results.albums.map((album) => (
                    <div key={album.id} className="cursor-pointer group">
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1",
                          border: "1px solid var(--border)",
                          filter: "grayscale(1) contrast(1.05)",
                          background: album.color ? `linear-gradient(135deg, ${album.color}, ${album.color}dd)` : "var(--ink-alt)",
                        }}
                        className="group-hover:!filter-none transition-all"
                      />
                      <div style={{ fontWeight: 700, fontSize: "16px", marginTop: "12px", textTransform: "lowercase" }}>
                        {album.title.toLowerCase()}
                      </div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--cream-hint)", marginTop: "5px" }}>
                        {album.artists.map((a) => a.name).join(", ")}
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="no albums found" />
                )}
              </div>
            )}

            {/* Artists */}
            {activeTab === "artists" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(168px, 1fr))", gap: "20px", paddingTop: "20px" }}>
                {results.artists.length > 0 ? (
                  results.artists.map((artist) => (
                    <div key={artist.id} className="cursor-pointer group" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          border: "1px solid var(--border)",
                          filter: "grayscale(1)",
                          background: `linear-gradient(135deg, hsl(${Math.abs(artist.id.charCodeAt(1) * 41) % 360}, 40%, 30%), hsl(${Math.abs(artist.id.charCodeAt(1) * 41 + 30) % 360}, 35%, 20%))`,
                        }}
                        className="group-hover:!filter-none transition-all"
                      />
                      <div style={{ fontWeight: 700, fontSize: "16px", marginTop: "12px", textTransform: "lowercase", textAlign: "center" }}>
                        {artist.name.toLowerCase()}
                      </div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--cream-hint)" }}>
                        artist
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="no artists found" />
                )}
              </div>
            )}

            {/* Playlists */}
            {activeTab === "playlists" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(168px, 1fr))", gap: "20px", paddingTop: "20px" }}>
                {results.playlists.length > 0 ? (
                  results.playlists.map((pl) => (
                    <div key={pl.id} className="cursor-pointer group">
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1",
                          border: "1px solid var(--border)",
                          filter: "grayscale(1) contrast(1.05)",
                          background: `linear-gradient(135deg, ${mockProvider.getPlaylistColor(pl.id)}, ${mockProvider.getPlaylistColor(pl.id)}dd)`,
                        }}
                        className="group-hover:!filter-none transition-all"
                      />
                      <div style={{ fontWeight: 700, fontSize: "16px", marginTop: "12px", textTransform: "lowercase" }}>
                        {pl.title.toLowerCase()}
                      </div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--cream-hint)", marginTop: "5px" }}>
                        {pl.tracks.length} tracks
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="no playlists found" />
                )}
              </div>
            )}
          </>
        ) : (
          <EmptyState
            message={query ? "searching..." : "start typing to search"}
          />
        )}
      </div>

      <div style={{ height: "32px" }} />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "var(--cream-muted)",
            fontFamily: "var(--mono)",
            fontSize: "11px",
            letterSpacing: ".14em",
            textTransform: "uppercase",
          }}
        >
          loading...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

function SearchTrackRow({
  track,
  index,
  allTracks,
  play,
}: {
  track: Track;
  index: number;
  allTracks: Track[];
  play: (track: Track, queue?: Track[]) => void;
}) {
  const { currentTrack, status } = usePlayerStore();
  const isCurrent = currentTrack?.id === track.id;
  const isPlaying = isCurrent && status === "playing";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "36px 1fr 200px 56px",
        gap: "16px",
        alignItems: "center",
        padding: "13px 0",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
      }}
      className="hover:!bg-[var(--ink-alt)] group"
      onClick={() => play(track, allTracks)}
    >
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: "11px",
          letterSpacing: ".1em",
          color: isPlaying ? "var(--orange)" : "var(--cream-hint)",
          paddingLeft: "4px",
        }}
        className="group-hover:!text-[var(--orange)]"
      >
        {isPlaying ? <span>/</span> : <span>{String(index + 1).padStart(2, "0")}</span>}
      </div>
      <div
        style={{
          fontWeight: 600,
          fontSize: "16px",
          textTransform: "lowercase",
          color: isPlaying ? "var(--orange)" : "var(--cream)",
          minWidth: 0,
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
          fontSize: "11px",
          letterSpacing: ".08em",
          color: "var(--cream-muted)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {track.artists.map((a) => a.name).join(", ")}
      </div>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: "11px",
          letterSpacing: ".08em",
          color: "var(--cream-muted)",
          textTransform: "uppercase",
          textAlign: "right",
        }}
      >
        {formatTimeInline(track.durationMs)}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 0",
        color: "var(--cream-muted)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "10px",
          letterSpacing: ".14em",
          textTransform: "uppercase",
        }}
      >
        {message}
      </span>
    </div>
  );
}

function formatTimeInline(ms?: number): string {
  if (!ms || ms <= 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
