import type { Album, Artist, HomeFeed, SearchResult, Track, PlaybackSource } from "./types";
import type { MusicProvider } from "./provider";
import ytdl from "ytdl-core";
import ytSearch from "yt-search";

const PROVIDER = "youtube";

// Simple caching for stream URLs
const streamCache = new Map<string, string>();

function mapArtist(video: any): Artist {
  const channelId = (video.author?.channel_id) || (video.author?.channelId) || (video.channelId) || "unknown";
  return {
    id: `yt-a-${channelId}`,
    name: video.author?.name ?? video.channel?.name ?? "Unknown",
    provider: PROVIDER,
    providerArtistId: channelId,
  };
}

function mapTrack(video: any): Track {
  const videoId = video.videoId || video.id?.videoId || "";
  const artist = mapArtist(video);
  return {
    id: `yt-t-${videoId}`,
    title: video.title ?? "Untitled",
    artists: [artist],
    durationMs: video.duration?.seconds
      ? video.duration.seconds * 1000
      : undefined,
    thumbnailUrl: video.thumbnail?.url,
    provider: PROVIDER,
    providerTrackId: videoId,
    playable: true,
  };
}

export class YoutubeProvider implements MusicProvider {
  async search(query: string): Promise<SearchResult> {
    const results = await ytSearch(query);
    const videos = results.videos ?? [];
    const tracks: Track[] = videos.map(mapTrack);
    return { tracks, albums: [], artists: [], playlists: [] };
  }

  async getTrack(id: string): Promise<Track> {
    const videoId = id.replace(/^yt-t-/, "");
    const info = await ytdl.getInfo(videoId);
    const video = info.videoDetails;
    return mapTrack({
      videoId,
      title: video.title,
      author: { name: video.author?.name },
      duration: { seconds: Math.floor(parseInt(video.lengthSeconds)) },
      thumbnail: { url: video.thumbnails?.[video.thumbnails.length - 1]?.url },
      channelId: (video.author as any)?.channelId ?? (video.author as any)?.id,
    });
  }

  async getAlbum(id: string): Promise<Album> {
    // YouTube does not have album concept; return empty placeholder
    return {
      id: `yt-al-${id}`,
      title: "YouTube Album",
      artists: [],
    } as Album;
  }

  async getArtist(id: string): Promise<Artist> {
    // Not directly supported; return minimal info
    return {
      id: `yt-a-${id}`,
      name: "YouTube Artist",
      provider: PROVIDER,
      providerArtistId: id,
    } as Artist;
  }

  async getHome(): Promise<HomeFeed> {
    // No dedicated home feed; return empty
    return {} as HomeFeed;
  }

  async getStream(track: Track): Promise<PlaybackSource> {
    const rawId = track.providerTrackId;
    if (!rawId) return { url: "" };
    const cached = streamCache.get(rawId);
    if (cached) return { url: cached };
    try {
      const info = await ytdl.getInfo(rawId);
      const format = info.formats.find(
        (f) => f.audioBitrate && f.mimeType?.includes("audio")
      );
      const url = format?.url ?? "";
      if (url) streamCache.set(rawId, url);
      return { url };
    } catch {
      return { url: "" };
    }
  }
}

export const youtubeProvider = new YoutubeProvider();
