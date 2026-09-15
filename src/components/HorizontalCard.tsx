"use client";

import type { Track } from "@/domain/types";
import { usePlayerStore } from "@/store/player-store";

export function HorizontalCard({
  title,
  subtitle,
  color,
  thumbnailUrl,
  tracks,
  index,
}: {
  title: string;
  subtitle?: string;
  color?: string;
  thumbnailUrl?: string;
  tracks?: Track[];
  index?: number;
}) {
  const { play } = usePlayerStore();

  const handlePlay = () => {
    if (tracks && tracks.length > 0) {
      play(tracks[0], tracks);
    }
  };

  return (
    <article className="min-w-0 cursor-pointer group">
      <div
        className="relative"
        style={{ border: "1px solid var(--border)" }}
      >
        {/* Index badge */}
        {index !== undefined && (
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              fontFamily: "var(--mono)",
              fontSize: "10px",
              letterSpacing: ".1em",
              color: "var(--cream-hint)",
              background: "var(--ink)",
              padding: "4px 7px",
              borderRight: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              zIndex: 1,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        {/* Album art — show <img> if thumbnailUrl exists, else gradient fallback */}
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            loading="lazy"
            style={{
              width: "100%",
              aspectRatio: "1",
              objectFit: "cover",
              display: "block",
              filter: "grayscale(1) contrast(1.05)",
            }}
            className="group-hover:!filter-none transition-all"
          />
        ) : (
          <div
            style={{
              width: "100%",
              aspectRatio: "1",
              background: color
                ? `linear-gradient(135deg, ${color}, ${color}dd)`
                : "var(--ink-alt)",
              filter: "grayscale(1) contrast(1.05)",
            }}
            className="group-hover:!filter-none transition-all"
          />
        )}
        {/* Play fab */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: "34px",
            height: "34px",
            background: "var(--orange)",
            color: "var(--ink)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--mono)",
            fontSize: "12px",
          }}
          className="opacity-0 group-hover:!opacity-100 transition-opacity"
        >
          &gt;
        </button>
      </div>
      <div
        style={{
          fontWeight: 700,
          fontSize: "16px",
          marginTop: "12px",
          textTransform: "lowercase",
          letterSpacing: "-.01em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: "10px",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "var(--cream-hint)",
            marginTop: "5px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {subtitle}
        </div>
      )}
    </article>
  );
}
