import type {
  Album,
  Artist,
  HomeFeed,
  PlaybackSource,
  Playlist,
  SearchResult,
  Track,
} from "./types";

export interface MusicProvider {
  search(query: string): Promise<SearchResult>;
  getTrack(id: string): Promise<Track>;
  getAlbum(id: string): Promise<Album>;
  getArtist(id: string): Promise<Artist>;
  getHome(): Promise<HomeFeed>;
  getStream(track: Track): Promise<PlaybackSource>;
}

export interface LyricsProvider {
  search(track: Track): Promise<{ trackId: string; synced: boolean; lines: { startMs: number; endMs?: number; text: string }[] } | null>;
}
