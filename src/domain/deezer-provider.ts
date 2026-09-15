import type {
  Album,
  Artist,
  HomeFeed,
  SearchResult,
  Track,
} from "./types";
import type { MusicProvider } from "./provider";
import { fetchDeezer } from "@/lib/deezer";

const PROVIDER = "deezer";

// ── Deezer raw JSON shapes ──────────────────────────────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
type DeezerTrack = any;
type DeezerAlbum = any;
type DeezerArtist = any;
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Preview URL cache (keyed by Deezer track ID) ────────────────
const previewCache = new Map<string, string>();

// ── Mappers ─────────────────────────────────────────────────────

function mapArtist(raw: DeezerArtist): Artist {
  return {
    id: `dz-a-${raw.id}`,
    name: raw.name ?? "Unknown",
    thumbnailUrl: raw.picture_medium ?? raw.picture ?? undefined,
    provider: PROVIDER,
    providerArtistId: String(raw.id),
  };
}

function mapAlbum(raw: DeezerAlbum): Album {
  const artist: Artist = raw.artist
    ? mapArtist(raw.artist)
    : {
        id: "dz-a-unknown",
        name: "Unknown",
        provider: PROVIDER,
        providerArtistId: "0",
      };

  return {
    id: `dz-al-${raw.id}`,
    title: raw.title ?? "Unknown Album",
    artists: [artist],
    thumbnailUrl: raw.cover_medium ?? raw.cover ?? undefined,
    year: raw.release_date ? new Date(raw.release_date).getFullYear() : undefined,
    color: "#2d2d3a",
  };
}

function mapTrack(raw: DeezerTrack): Track {
  const artist: Artist = raw.artist
    ? mapArtist(raw.artist)
    : {
        id: "dz-a-unknown",
        name: "Unknown",
        provider: PROVIDER,
        providerArtistId: "0",
      };

  const album: Album | undefined = raw.album
    ? {
        id: `dz-al-${raw.album.id}`,
        title: raw.album.title ?? "Unknown",
        artists: [artist],
        thumbnailUrl: raw.album.cover_medium ?? raw.album.cover ?? undefined,
        color: "#2d2d3a",
      }
    : undefined;

  const trackId = String(raw.id);

  // Cache preview URL for getStream()
  if (raw.preview) {
    previewCache.set(trackId, raw.preview);
  }

  return {
    id: `dz-t-${trackId}`,
    title: raw.title ?? "Unknown",
    artists: [artist],
    album,
    durationMs: raw.duration ? raw.duration * 1000 : undefined,
    thumbnailUrl: raw.album?.cover_medium ?? raw.album?.cover ?? undefined,
    provider: PROVIDER,
    providerTrackId: trackId,
    playable: !!raw.preview,
    color: "#2d2d3a",
  };
}

// ── Provider ────────────────────────────────────────────────────

export class DeezerProvider implements MusicProvider {
  async search(query: string): Promise<SearchResult> {
    const encoded = encodeURIComponent(query);

    const [trackRes, albumRes, artistRes] = await Promise.all([
      fetchDeezer<{ data: DeezerTrack[] }>(`/search?q=${encoded}&limit=20`),
      fetchDeezer<{ data: DeezerAlbum[] }>(`/search/album?q=${encoded}&limit=10`),
      fetchDeezer<{ data: DeezerArtist[] }>(`/search/artist?q=${encoded}&limit=10`),
    ]);

    return {
      tracks: (trackRes.data ?? []).map(mapTrack),
      albums: (albumRes.data ?? []).map(mapAlbum),
      artists: (artistRes.data ?? []).map(mapArtist),
      playlists: [],
    };
  }

  async getTrack(id: string): Promise<Track> {
    const rawId = id.replace(/^dz-t-/, "");
    const raw = await fetchDeezer<DeezerTrack>(`/track/${rawId}`);
    return mapTrack(raw);
  }

  async getAlbum(id: string): Promise<Album> {
    const rawId = id.replace(/^dz-al-/, "");
    const raw = await fetchDeezer<DeezerAlbum>(`/album/${rawId}`);
    const album = mapAlbum(raw);

    if (raw.tracks?.data) {
      album.tracks = raw.tracks.data.map(mapTrack);
    }

    return album;
  }

  async getArtist(id: string): Promise<Artist> {
    const rawId = id.replace(/^dz-a-/, "");
    const raw = await fetchDeezer<DeezerArtist>(`/artist/${rawId}`);
    return mapArtist(raw);
  }

  async getHome(): Promise<HomeFeed> {
    const greeting = getGreeting();

    const [chartRes, albumRes] = await Promise.all([
      fetchDeezer<{ data: DeezerTrack[] }>(`/chart/0/tracks?limit=20`).catch(
        () => ({ data: [] as DeezerTrack[] }),
      ),
      fetchDeezer<{ data: DeezerAlbum[] }>(`/chart/0/albums?limit=18`).catch(
        () => ({ data: [] as DeezerAlbum[] }),
      ),
    ]);

    const trendingTracks = (chartRes.data ?? []).map(mapTrack);
    const albums = (albumRes.data ?? []).map(mapAlbum);

    return {
      greeting,
      trending: trendingTracks,
      recommendedAlbums: albums,
      featured: albums.slice(0, 6),
      recentlyPlayed: trendingTracks.slice(0, 5),
      madeForYou: [],
    };
  }

  async getStream(track: Track): Promise<{ url: string }> {
    const rawId = track.providerTrackId;
    if (!rawId || rawId === "0") return { url: "" };

    // Check cache first (populated during search/home/track fetch)
    const cached = previewCache.get(rawId);
    if (cached) return { url: cached };

    // Fall back to fetching
    try {
      const raw = await fetchDeezer<DeezerTrack>(`/track/${rawId}`);
      if (raw.preview) {
        previewCache.set(rawId, raw.preview);
      }
      return { url: raw.preview ?? "" };
    } catch {
      return { url: "" };
    }
  }

  async getLyrics(): Promise<null> {
    return null;
  }
}

// ── Helpers ─────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "good morning";
  if (h < 18) return "good afternoon";
  return "good evening";
}

export const deezerProvider = new DeezerProvider();
