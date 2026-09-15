"use client";

import { usePlayerStore } from "@/store/player-store";
import { TrackCard } from "@/components/TrackCard";
import { mockProvider } from "@/domain/mock-provider";

export default function FavoritesPage() {
  const { favoriteIds } = usePlayerStore();
  const allTracks = mockProvider.getAllTracks();
  const favoriteTracks = allTracks.filter((t) => favoriteIds.includes(t.id));

  return (
    <div style={{ paddingTop: "28px" }}>
      <div style={{ marginBottom: "20px" }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "11px",
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "var(--cream-hint)",
          }}
        >
          {favoriteTracks.length} {favoriteTracks.length === 1 ? "track" : "tracks"}
        </span>
      </div>

      {favoriteTracks.length > 0 ? (
        <div>
          {favoriteTracks.map((track, i) => (
            <TrackCard
              key={track.id}
              track={track}
              index={i}
              allTracks={favoriteTracks}
              showHeart={true}
            />
          ))}
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
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: "24px",
              color: "var(--cream-hint)",
              marginBottom: "16px",
            }}
          >
            {"\u2661"}
          </div>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "11px",
              letterSpacing: ".14em",
              textTransform: "uppercase",
            }}
          >
            no favorite tracks yet
          </span>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "10px",
              letterSpacing: ".1em",
              color: "var(--cream-hint)",
              marginTop: "8px",
            }}
          >
            click the heart icon on any track to add it here
          </span>
        </div>
      )}
    </div>
  );
}
