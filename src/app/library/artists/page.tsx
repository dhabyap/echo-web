"use client";

import Link from "next/link";
import { mockProvider } from "@/domain/mock-provider";

export default function ArtistsPage() {
  const artists = mockProvider.getArtists();

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
          {artists.length} {artists.length === 1 ? "artist" : "artists"}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(144px, 1fr))",
          gap: "20px",
        }}
      >
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/library/artists/${artist.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
            className="cursor-pointer group"
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "1",
                border: "1px solid var(--border)",
                filter: "grayscale(1)",
                background: `linear-gradient(135deg, hsl(${Math.abs(artist.id.charCodeAt(1) * 41) % 360}, 40%, 30%), hsl(${Math.abs(artist.id.charCodeAt(1) * 41 + 30) % 360}, 35%, 20%))`,
              }}
              className="group-hover:!filter-none transition-all"
            />
            <div
              style={{
                fontWeight: 700,
                fontSize: "14px",
                marginTop: "10px",
                textTransform: "lowercase",
                textAlign: "center",
              }}
            >
              {artist.name.toLowerCase()}
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "10px",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--cream-hint)",
                marginTop: "5px",
                textAlign: "center",
              }}
            >
              artist
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
