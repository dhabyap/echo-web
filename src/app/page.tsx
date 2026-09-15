"use client";

import { useState, useEffect } from "react";
import { mockProvider } from "@/domain/mock-provider";
import { deezerProvider } from "@/domain/deezer-provider";
import { usePlayerStore } from "@/store/player-store";
import { HorizontalCard } from "@/components/HorizontalCard";
import { TrackCard } from "@/components/TrackCard";
import { Topbar } from "@/components/Topbar";
import type { HomeFeed } from "@/domain/types";

const sectionNumbers = ["01", "02", "03", "04"];

export default function Home() {
  const [feed, setFeed] = useState<HomeFeed | null>(null);
  const play = usePlayerStore((s) => s.play);
  const useMock = usePlayerStore((s) => s.useMock);

  useEffect(() => {
    const provider = useMock ? mockProvider : deezerProvider;
    provider.getHome().then(setFeed).catch(() => {
      // Fall back to mock on error
      mockProvider.getHome().then(setFeed);
    });
  }, [useMock]);

  if (!feed) {
    return (
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
    );
  }

  let sectionIdx = 0;

  return (
    <>
      <Topbar />
      {/* HERO — orange register */}
      <section
        style={{
          background: "var(--orange)",
          color: "var(--ink)",
          padding: "52px 40px 46px",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "20px",
            right: "24px",
            fontFamily: "var(--mono)",
            fontSize: "10px",
            letterSpacing: ".14em",
            color: "var(--on-orange-faint)",
            textTransform: "uppercase",
          }}
        >
          no. 01 · {useMock ? "mock provider" : "deezer live"}
        </span>
        <div style={{ width: "36px", height: "2px", background: "var(--ink)", marginBottom: "20px" }} />
        <div
          style={{
            fontFamily: "var(--mono)",
            textTransform: "uppercase",
            letterSpacing: ".14em",
            fontSize: "11px",
            color: "var(--on-orange-hint)",
            marginBottom: "14px",
          }}
        >
          personalized feed
        </div>
        <h1
          style={{
            fontWeight: 900,
            fontSize: "clamp(52px, 7.5vw, 104px)",
            lineHeight: 0.88,
            letterSpacing: "-.04em",
            textTransform: "lowercase",
            margin: 0,
          }}
        >
          {feed.greeting?.toLowerCase()}
        </h1>
        <p
          style={{
            color: "var(--on-orange-muted)",
            fontSize: "18px",
            marginTop: "16px",
            maxWidth: "46ch",
          }}
        >
          Music for a better you
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "30px", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              if (feed.recentlyPlayed?.length) {
                play(feed.recentlyPlayed[0], feed.recentlyPlayed);
              }
            }}
            style={{
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
              letterSpacing: ".14em",
              fontSize: "11px",
              padding: "13px 22px",
              background: "var(--ink)",
              color: "var(--orange)",
              border: "1px solid var(--ink)",
            }}
            className="hover:!bg-[var(--cream)] hover:!text-[var(--ink)] hover:!border-[var(--cream)]"
          >
            resume
          </button>
          <button
            onClick={() => {
              if (feed.trending?.length) {
                play(feed.trending[0], feed.trending);
              } else if (feed.recentlyPlayed?.length) {
                // Shuffle: play random from all available tracks
                const all = feed.recentlyPlayed;
                const idx = Math.floor(Math.random() * all.length);
                play(all[idx], all);
              }
            }}
            style={{
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
              letterSpacing: ".14em",
              fontSize: "11px",
              padding: "13px 22px",
              border: "1px solid var(--on-orange-border)",
              background: "none",
              color: "var(--ink)",
            }}
            className="hover:!bg-[var(--ink)] hover:!text-[var(--orange)] hover:!border-[var(--ink)]"
          >
            shuffle all
          </button>
        </div>
      </section>

      {/* Made for you */}
      {feed.madeForYou && feed.madeForYou.length > 0 && (
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
              {sectionNumbers[sectionIdx++]}
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
              made for you
            </h2>
            <span style={{ flex: 1 }} />
            <button
              style={{
                fontFamily: "var(--mono)",
                textTransform: "uppercase",
                letterSpacing: ".14em",
                fontSize: "10px",
                color: "var(--cream-hint)",
              }}
              className="hover:!text-[var(--orange)]"
            >
              see all
            </button>
            <div style={{ display: "flex", border: "1px solid var(--border)" }}>
              <button
                style={{
                  width: "30px",
                  height: "26px",
                  fontFamily: "var(--mono)",
                  fontSize: "12px",
                  color: "var(--cream-muted)",
                  borderRight: "1px solid var(--border)",
                }}
                className="hover:!bg-[var(--orange)] hover:!text-[var(--ink)]"
              >
                &lt;
              </button>
              <button
                style={{
                  width: "30px",
                  height: "26px",
                  fontFamily: "var(--mono)",
                  fontSize: "12px",
                  color: "var(--cream-muted)",
                }}
                className="hover:!bg-[var(--orange)] hover:!text-[var(--ink)]"
              >
                &gt;
              </button>
            </div>
          </div>
          <div
            className="hide-scrollbar"
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridAutoColumns: "168px",
              gap: "20px",
              overflow: "auto",
              paddingBottom: "6px",
            }}
          >
            {feed.madeForYou.map((pl, i) => (
              <HorizontalCard
                key={pl.id}
                title={pl.title}
                subtitle={`mixtape · ${pl.tracks.length} tracks`}
                color={`hsl(${Math.abs(pl.id.charCodeAt(2) * 37) % 360}, 35%, 22%)`}
                tracks={pl.tracks}
                index={i}
              />
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      {feed.trending && feed.trending.length > 0 && (
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
              {sectionNumbers[sectionIdx++] || "02"}
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
              trending this week
            </h2>
            <span style={{ flex: 1 }} />
            <button
              style={{
                fontFamily: "var(--mono)",
                textTransform: "uppercase",
                letterSpacing: ".14em",
                fontSize: "10px",
                color: "var(--cream-hint)",
              }}
              className="hover:!text-[var(--orange)]"
            >
              see all
            </button>
            <div style={{ display: "flex", border: "1px solid var(--border)" }}>
              <button
                style={{
                  width: "30px",
                  height: "26px",
                  fontFamily: "var(--mono)",
                  fontSize: "12px",
                  color: "var(--cream-muted)",
                  borderRight: "1px solid var(--border)",
                }}
                className="hover:!bg-[var(--orange)] hover:!text-[var(--ink)]"
              >
                &lt;
              </button>
              <button
                style={{
                  width: "30px",
                  height: "26px",
                  fontFamily: "var(--mono)",
                  fontSize: "12px",
                  color: "var(--cream-muted)",
                }}
                className="hover:!bg-[var(--orange)] hover:!text-[var(--ink)]"
              >
                &gt;
              </button>
            </div>
          </div>
          <div
            className="hide-scrollbar"
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridAutoColumns: "168px",
              gap: "20px",
              overflow: "auto",
              paddingBottom: "6px",
            }}
          >
            {feed.trending.map((track, i) => (
              <HorizontalCard
                key={track.id}
                title={track.title}
                subtitle={track.artists.map((a) => a.name).join(", ")}
                color={track.color}
                thumbnailUrl={track.thumbnailUrl}
                tracks={[track]}
                index={i}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recommended albums */}
      {feed.recommendedAlbums && feed.recommendedAlbums.length > 0 && (
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
              {sectionNumbers[sectionIdx++] || "03"}
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
              albums
            </h2>
            <span style={{ flex: 1 }} />
            <button
              style={{
                fontFamily: "var(--mono)",
                textTransform: "uppercase",
                letterSpacing: ".14em",
                fontSize: "10px",
                color: "var(--cream-hint)",
              }}
              className="hover:!text-[var(--orange)]"
            >
              see all
            </button>
            <div style={{ display: "flex", border: "1px solid var(--border)" }}>
              <button
                style={{
                  width: "30px",
                  height: "26px",
                  fontFamily: "var(--mono)",
                  fontSize: "12px",
                  color: "var(--cream-muted)",
                  borderRight: "1px solid var(--border)",
                }}
                className="hover:!bg-[var(--orange)] hover:!text-[var(--ink)]"
              >
                &lt;
              </button>
              <button
                style={{
                  width: "30px",
                  height: "26px",
                  fontFamily: "var(--mono)",
                  fontSize: "12px",
                  color: "var(--cream-muted)",
                }}
                className="hover:!bg-[var(--orange)] hover:!text-[var(--ink)]"
              >
                &gt;
              </button>
            </div>
          </div>
          <div
            className="hide-scrollbar"
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridAutoColumns: "168px",
              gap: "20px",
              overflow: "auto",
              paddingBottom: "6px",
            }}
          >
            {feed.recommendedAlbums.map((album, i) => (
              <HorizontalCard
                key={album.id}
                title={album.title}
                subtitle={album.artists.map((a) => a.name).join(", ")}
                color={album.color}
                thumbnailUrl={album.thumbnailUrl}
                tracks={album.tracks}
                index={i}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recently played */}
      {feed.recentlyPlayed && feed.recentlyPlayed.length > 0 && (
        <section style={{ padding: "36px 40px 8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "16px",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "14px",
              marginBottom: "0",
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
              {sectionNumbers[sectionIdx++] || "04"}
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
              recently played
            </h2>
            <span style={{ flex: 1 }} />
            <button
              style={{
                fontFamily: "var(--mono)",
                textTransform: "uppercase",
                letterSpacing: ".14em",
                fontSize: "10px",
                color: "var(--cream-hint)",
              }}
              className="hover:!text-[var(--orange)]"
            >
              clear history
            </button>
          </div>
          <div style={{ borderTop: "1px solid var(--border)" }}>
            {feed.recentlyPlayed.map((track, i) => (
              <TrackCard
                key={track.id}
                track={track}
                index={i}
                allTracks={feed.recentlyPlayed}
              />
            ))}
          </div>
        </section>
      )}

      {/* Spacer */}
      <div style={{ height: "32px" }} />
    </>
  );
}
