// Domain models — platform-independent types for EchoWeb

export type Artist = {
  id: string;
  name: string;
  thumbnailUrl?: string;
  provider: string;
  providerArtistId: string;
};

export type Album = {
  id: string;
  title: string;
  artists: Artist[];
  thumbnailUrl?: string;
  year?: number;
  tracks?: Track[];
  /** Solid-color fallback for album art (hex) */
  color?: string;
};

export type Track = {
  id: string;
  title: string;
  artists: Artist[];
  album?: Album;
  durationMs?: number;
  thumbnailUrl?: string;
  provider: string;
  providerTrackId: string;
  playable?: boolean;
  /** Solid-color fallback for album art (hex) */
  color?: string;
  /** Whether user has favorited this track */
  isFavorite?: boolean;
};

export type Playlist = {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  tracks: Track[];
  createdAt: string;
  updatedAt: string;
};

export type LyricsWord = {
  startMs: number;
  endMs: number;
  text: string;
};

export type LyricsLine = {
  startMs: number;
  endMs?: number;
  text: string;
  words?: LyricsWord[];
};

export type Lyrics = {
  trackId: string;
  synced: boolean;
  lines: LyricsLine[];
};

// Provider types
export type PlaybackSource = {
  url: string;
  /** MIME type if known */
  mimeType?: string;
};

export type SearchResult = {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
};

export type HomeFeed = {
  greeting?: string;
  featured?: Album[];
  recentlyPlayed?: Track[];
  madeForYou?: Playlist[];
  trending?: Track[];
  recommendedAlbums?: Album[];
};

// Player state
export type RepeatMode = "off" | "one" | "all";

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";

export type PlayerState = {
  status: PlayerStatus;
  currentTrack?: Track;
  currentTimeMs: number;
  durationMs: number;
  volume: number;
  queue: Track[];
  queueIndex: number;
  shuffle: boolean;
  repeat: RepeatMode;
};
