"use client";

import Link from "next/link";
import { mockProvider } from "@/domain/mock-provider";

export default function AlbumsPage() {
  const albums = mockProvider.getAlbums();

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
          {albums.length} {albums.length === 1 ? "album" : "albums"}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(168px, 1fr))",
          gap: "20px",
        }}
      >
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/library/albums/${album.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
            className="cursor-pointer group"
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "1",
                border: "1px solid var(--border)",
                filter: "grayscale(1) contrast(1.05)",
                background: album.color
                  ? `linear-gradient(135deg, ${album.color}, ${album.color}dd)`
                  : "var(--ink-alt)",
              }}
              className="group-hover:!filter-none transition-all"
            />
            <div
              style={{
                fontWeight: 700,
                fontSize: "16px",
                marginTop: "12px",
                textTransform: "lowercase",
              }}
            >
              {album.title.toLowerCase()}
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "10px",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--cream-hint)",
                marginTop: "5px",
              }}
            >
              {album.artists.map((a) => a.name).join(", ")}
              {album.year ? ` \u00b7 ${album.year}` : ""}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
