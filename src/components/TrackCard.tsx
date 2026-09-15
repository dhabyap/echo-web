"use client";

import type { Track } from "@/domain/types";
import { usePlayerStore } from "@/store/player-store";
import { formatTime } from "@/lib/format";
export function TrackCard({
  track,
  index,
  allTracks,
  showHeart = true,
}: {
  track: Track;
  index?: number;
  allTracks?: Track[];
  showHeart?: boolean;
}) {
  const { play, currentTrack, status, favoriteIds, toggleFavorite } = usePlayerStore();
  const isCurrent = currentTrack?.id === track.id;
  const isPlaying = isCurrent && status === "playing";
  const isFav = favoriteIds.includes(track.id);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: showHeart
          ? "28px 36px 36px 1fr 200px 56px"
          : "36px 36px 1fr 200px 56px",
        gap: "12px",
        alignItems: "center",
        padding: "13px 0",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
      }}
      className="hover:!bg-[var(--ink-alt)] group"
    >
      {/* Heart */}
      {showHeart && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(track.id);
          }}
          style={{
            fontFamily: "var(--mono)",
            fontSize: "16px",
            color: isFav ? "var(--orange)" : "var(--cream-hint)",
            textAlign: "center",
            background: "none",
            border: 0,
            cursor: "pointer",
            padding: 0,
          }}
          className="hover:!text-[var(--orange)]"
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          {isFav ? "\u2665" : "\u2661"}
        </button>
      )}

      {/* Number / playing indicator */}
      <div
        onClick={() => play(track, allTracks)}
        style={{
          fontFamily: "var(--mono)",
          fontSize: "11px",
          letterSpacing: ".1em",
          color: isPlaying ? "var(--orange)" : "var(--cream-hint)",
          paddingLeft: "4px",
        }}
        className="group-hover:!text-[var(--orange)]"
      >
        {isPlaying ? (
          <span>/</span>
        ) : index !== undefined ? (
          <span>{String(index + 1).padStart(2, "0")}</span>
        ) : null}
      </div>

      {/* Album art thumbnail */}
      <div
        onClick={() => play(track, allTracks)}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: 0,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {track.thumbnailUrl ? (
          <img
            src={track.thumbnailUrl}
            alt={track.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(1) contrast(1.05)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: track.color
                ? `linear-gradient(135deg, ${track.color}, ${track.color}dd)`
                : "var(--ink-alt)",
              filter: "grayscale(1) contrast(1.05)",
            }}
          />
        )}
      </div>

      {/* Title */}
      <div
        onClick={() => play(track, allTracks)}
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
        {track.title}
      </div>

      {/* Artist */}
      <div
        onClick={() => play(track, allTracks)}
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

      {/* Duration */}
      <div
        onClick={() => play(track, allTracks)}
        style={{
          fontFamily: "var(--mono)",
          fontSize: "11px",
          letterSpacing: ".08em",
          color: "var(--cream-muted)",
          textTransform: "uppercase",
          textAlign: "right",
        }}
      >
        {formatTime(track.durationMs)}
      </div>
    </div>
  );
}
