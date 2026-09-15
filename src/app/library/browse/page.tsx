"use client";

import { mockProvider } from "@/domain/mock-provider";
import { HorizontalCard } from "@/components/HorizontalCard";
import { usePlayerStore } from "@/store/player-store";

const sectionNumbers = ["01", "02", "03"];

export default function BrowsePage() {
  const artists = mockProvider.getArtists();
  const albums = mockProvider.getAlbums();
  const playlists = mockProvider.getPlaylists();
  const play = usePlayerStore((s) => s.play);

  return (
    <div style={{ paddingTop: "28px" }}>
      {/* Artists section */}
      <section style={{ marginBottom: "36px" }}>
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
            {sectionNumbers[0]}
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
            artists
          </h2>
          <span style={{ flex: 1 }} />
        </div>
        <div
          className="hide-scrollbar"
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "144px",
            gap: "20px",
            overflow: "auto",
            paddingBottom: "6px",
          }}
        >
          {artists.slice(0, 10).map((artist) => (
            <div
              key={artist.id}
              className="cursor-pointer group"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "144px" }}
            >
              <div
                style={{
                  width: "144px",
                  height: "144px",
                  border: "1px solid var(--border)",
                  filter: "grayscale(1)",
                  background: `linear-gradient(135deg, hsl(${Math.abs(artist.id.charCodeAt(1) * 41) % 360}, 40%, 30%), hsl(${Math.abs(artist.id.charCodeAt(1) * 41 + 30) % 360}, 35%, 20%))`,
                }}
                className="group-hover:!filter-none transition-all"
              />
              <div style={{ fontWeight: 700, fontSize: "14px", marginTop: "10px", textTransform: "lowercase", textAlign: "center" }}>
                {artist.name.toLowerCase()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Playlists section */}
      <section style={{ marginBottom: "36px" }}>
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
            {sectionNumbers[1]}
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
            playlists
          </h2>
          <span style={{ flex: 1 }} />
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
          {playlists.map((pl, i) => (
            <HorizontalCard
              key={pl.id}
              title={pl.title}
              subtitle={`${pl.tracks.length} tracks`}
              color={`hsl(${Math.abs(pl.id.charCodeAt(2) * 37) % 360}, 35%, 22%)`}
              tracks={pl.tracks}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Albums section */}
      <section style={{ marginBottom: "36px" }}>
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
            {sectionNumbers[2]}
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
          {albums.slice(0, 12).map((album, i) => (
            <HorizontalCard
              key={album.id}
              title={album.title}
              subtitle={album.artists.map((a) => a.name).join(", ")}
              color={album.color}
              tracks={album.tracks}
              index={i}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
