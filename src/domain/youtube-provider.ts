import type { Album, Artist, HomeFeed, SearchResult, Track, PlaybackSource } from "./types";
import type { MusicProvider } from "./provider";

const PROVIDER = "youtube";

const streamCache = new Map<string, string>();

// Use Netlify function proxy instead of direct Invidious URL
const INVIDIOUS_INSTANCES = [
  "/.netlify/functions/invidious",
];

async function fetchFromInstances(endpoint: string) {
  for (const base of INVIDIOUS_INSTANCES) {
    try {
      const resp = await fetch(`${base}${endpoint}`);
      if (resp.ok) return await resp.json();
    } catch {}
  }
  throw new Error("All Invidious instances failed");
}


function mapArtist(item: any): Artist {
  const channelId = (item.author?.channelId) ?? (item.channelId) ?? "unknown";
  return {
    id: `yt-a-${channelId}`,
    name: item.author?.name ?? item.channel?.name ?? "Unknown",
    provider: PROVIDER,
    providerArtistId: channelId,
  };
}

function mapTrack(item: any): Track {
  const videoId = item.id ?? item.videoId;
  const artist = mapArtist(item);
  return {
    id: `yt-t-${videoId}`,
    title: item.title ?? "Untitled",
    artists: [artist],
    durationMs: item.lengthSeconds ? item.lengthSeconds * 1000 : undefined,
    thumbnailUrl: item.thumbnailUrl ?? item.videoThumbnails?.[0]?.url,
    provider: PROVIDER,
    providerTrackId: videoId,
    playable: true,
  };
}

export class YoutubeProvider implements MusicProvider {
  // Use public Invidious instance – no auth, works client‑side
  async search(query: string): Promise<SearchResult> {
    const resp = await fetch(`https://invidious.snopyta.org/api/v1/search?q=${encodeURIComponent(query)}&type=video`);
    const data = (await resp.json()) as any[];
    const tracks: Track[] = data.map(mapTrack);
    return { tracks, albums: [], artists: [], playlists: [] };
  }

  async getTrack(id: string): Promise<Track> {
    const videoId = id.replace(/^yt-t-/, "");
    // Use Invidious instances for track details
    const data = await fetchFromInstances(`/api/v1/videos/${videoId}`);
    return mapTrack(data);
  }

  async getAlbum(id: string): Promise<Album> {
    return { id: `yt-al-${id}`, title: "YouTube Album", artists: [] } as Album;
  }

  async getArtist(id: string): Promise<Artist> {
    return { id: `yt-a-${id}`, name: "YouTube Artist", provider: PROVIDER, providerArtistId: id } as Artist;
  }

  async getHome(): Promise<HomeFeed> {
    return {} as HomeFeed;
  }

  async getStream(track: Track): Promise<PlaybackSource> {
    const rawId = track.providerTrackId;
    if (!rawId) return { url: "" };
    const cached = streamCache.get(rawId);
    if (cached) return { url: cached };
    // Try Invidious instances first
    try {
      const data = await fetchFromInstances(`/api/v1/videos/${rawId}`);
      const format = (data?.adaptiveFormats ?? data?.formatStreams ?? []).find((f: any) => f.type?.includes("audio"));
      const url = format?.url ?? "";
      if (url) streamCache.set(rawId, url);
      return { url };
    } catch {
      // Fallback to ytdl-core (client‑side) if Invidious fails
      const { default: ytdl } = await import('ytdl-core');
      const info = await ytdl.getInfo(rawId);
      const format = info.formats.find((f: any) => f.audioBitrate && f.mimeType?.includes('audio'));
      const url = format?.url ?? '';
      if (url) streamCache.set(rawId, url);
      return { url };
    }
  }
}

export const youtubeProvider = new YoutubeProvider();
