import type {
  Album,
  Artist,
  HomeFeed,
  Playlist,
  SearchResult,
  Track,
} from "./types";
import type { MusicProvider } from "./provider";

// ── Mock Artists ───────────────────────────────────────────────
const artists: Artist[] = [
  { id: "a1", name: "Ludovico Einaudi", provider: "mock", providerArtistId: "ea1" },
  { id: "a2", name: "Tom Odell", provider: "mock", providerArtistId: "ea2" },
  { id: "a3", name: "The Weeknd", provider: "mock", providerArtistId: "ea3" },
  { id: "a4", name: "Petit Biscuit", provider: "mock", providerArtistId: "ea4" },
  { id: "a5", name: "OneRepublic", provider: "mock", providerArtistId: "ea5" },
  { id: "a6", name: "Yiruma", provider: "mock", providerArtistId: "ea6" },
  { id: "a7", name: "Ariana Grande", provider: "mock", providerArtistId: "ea7" },
  { id: "a8", name: "Billie Eilish", provider: "mock", providerArtistId: "ea8" },
  { id: "a9", name: "Taylor Swift", provider: "mock", providerArtistId: "ea9" },
  { id: "a10", name: "Lady Gaga", provider: "mock", providerArtistId: "ea10" },
  { id: "a11", name: "Sabrina Carpenter", provider: "mock", providerArtistId: "ea11" },
  { id: "a12", name: "Fontaines D.C.", provider: "mock", providerArtistId: "ea12" },
  { id: "a13", name: "Mira Vale", provider: "mock", providerArtistId: "ea13" },
  { id: "a14", name: "Lunar State", provider: "mock", providerArtistId: "ea14" },
  { id: "a15", name: "The Echoes", provider: "mock", providerArtistId: "ea15" },
];

// ── Mock Tracks ────────────────────────────────────────────────
const tracks: Track[] = [
  { id: "t1", title: "Nuvole Bianche", artists: [artists[0]], durationMs: 357000, provider: "mock", providerTrackId: "mt1", playable: true, color: "#3b2d5c" },
  { id: "t2", title: "Experience", artists: [artists[0]], durationMs: 315000, provider: "mock", providerTrackId: "mt2", playable: true, color: "#2d4050" },
  { id: "t3", title: "Another Love", artists: [artists[1]], durationMs: 244000, provider: "mock", providerTrackId: "mt3", playable: true, color: "#4a3528" },
  { id: "t4", title: "Call Out My Name", artists: [artists[2]], durationMs: 228000, provider: "mock", providerTrackId: "mt4", playable: true, color: "#5c2d3b" },
  { id: "t5", title: "Sunset Lover", artists: [artists[3]], durationMs: 238000, provider: "mock", providerTrackId: "mt5", playable: true, color: "#2d4a5c" },
  { id: "t6", title: "Apologize", artists: [artists[4]], durationMs: 208000, provider: "mock", providerTrackId: "mt6", playable: true, color: "#3b3b2d" },
  { id: "t7", title: "River Flows In You", artists: [artists[5]], durationMs: 185000, provider: "mock", providerTrackId: "mt7", playable: true, color: "#2d3b4a" },
  { id: "t8", title: "I Was Never There", artists: [artists[2]], durationMs: 241000, provider: "mock", providerTrackId: "mt8", playable: true, color: "#4a2d3b" },
  { id: "t9", title: "Eternal Sunshine", artists: [artists[6]], durationMs: 210000, provider: "mock", providerTrackId: "mt9", playable: true, color: "#5c4a2d" },
  { id: "t10", title: "HIT ME HARD AND SOFT", artists: [artists[7]], durationMs: 230000, provider: "mock", providerTrackId: "mt10", playable: true, color: "#2d5c4a" },
  { id: "t11", title: "The Tortured Poets Department", artists: [artists[8]], durationMs: 260000, provider: "mock", providerTrackId: "mt11", playable: true, color: "#4a3b2d" },
  { id: "t12", title: "MAYHEM", artists: [artists[9]], durationMs: 225000, provider: "mock", providerTrackId: "mt12", playable: true, color: "#3b2d4a" },
  { id: "t13", title: "Short n' Sweet", artists: [artists[10]], durationMs: 195000, provider: "mock", providerTrackId: "mt13", playable: true, color: "#5c3b2d" },
  { id: "t14", title: "Romance", artists: [artists[11]], durationMs: 218000, provider: "mock", providerTrackId: "mt14", playable: true, color: "#2d3b5c" },
  { id: "t15", title: "Afterglow", artists: [artists[12]], durationMs: 250000, provider: "mock", providerTrackId: "mt15", playable: true, color: "#4a5c2d" },
  { id: "t16", title: "Night Drive", artists: [artists[13]], durationMs: 270000, provider: "mock", providerTrackId: "mt16", playable: true, color: "#1a2d4a" },
  { id: "t17", title: "Fragments", artists: [artists[14]], durationMs: 200000, provider: "mock", providerTrackId: "mt17", playable: true, color: "#3b4a2d" },
  { id: "t18", title: "Blue Hour", artists: [artists[12]], durationMs: 230000, provider: "mock", providerTrackId: "mt18", playable: true, color: "#2d4a3b" },
  { id: "t19", title: "Parallel Lines", artists: [artists[14]], durationMs: 245000, provider: "mock", providerTrackId: "mt19", playable: true, color: "#5c2d4a" },
  { id: "t20", title: "Open Skies", artists: [artists[12]], durationMs: 260000, provider: "mock", providerTrackId: "mt20", playable: true, color: "#4a2d5c" },
];

// ── Mock Albums ────────────────────────────────────────────────
const albums: Album[] = [
  { id: "al1", title: "Discover Weekly", artists: [artists[0]], year: 2024, tracks: [tracks[0], tracks[1]], color: "#3b2d5c" },
  { id: "al2", title: "Chill Mix", artists: [artists[3]], year: 2024, tracks: [tracks[4]], color: "#2d4a5c" },
  { id: "al3", title: "Focus Mix", artists: [artists[5]], year: 2024, tracks: [tracks[6]], color: "#2d3b4a" },
  { id: "al4", title: "Workout Mix", artists: [artists[4]], year: 2024, tracks: [tracks[5]], color: "#3b3b2d" },
  { id: "al5", title: "Feel Good Mix", artists: [artists[1]], year: 2024, tracks: [tracks[2]], color: "#4a3528" },
  { id: "al6", title: "Sad Songs", artists: [artists[2]], year: 2024, tracks: [tracks[3], tracks[7]], color: "#5c2d3b" },
  { id: "al7", title: "Eternal Sunshine", artists: [artists[6]], year: 2024, tracks: [tracks[8]], color: "#5c4a2d" },
  { id: "al8", title: "HIT ME HARD AND SOFT", artists: [artists[7]], year: 2024, tracks: [tracks[9]], color: "#2d5c4a" },
  { id: "al9", title: "The Tortured Poets Department", artists: [artists[8]], year: 2024, tracks: [tracks[10]], color: "#4a3b2d" },
  { id: "al10", title: "MAYHEM", artists: [artists[9]], year: 2025, tracks: [tracks[11]], color: "#3b2d4a" },
  { id: "al11", title: "Short n' Sweet", artists: [artists[10]], year: 2024, tracks: [tracks[12]], color: "#5c3b2d" },
  { id: "al12", title: "Romance", artists: [artists[11]], year: 2024, tracks: [tracks[13]], color: "#2d3b5c" },
  { id: "al13", title: "Afterglow", artists: [artists[12]], year: 2024, tracks: [tracks[14]], color: "#4a5c2d" },
  { id: "al14", title: "Night Drive", artists: [artists[13]], year: 2024, tracks: [tracks[15]], color: "#1a2d4a" },
  { id: "al15", title: "Fragments", artists: [artists[14]], year: 2024, tracks: [tracks[16]], color: "#3b4a2d" },
  { id: "al16", title: "Blue Hour", artists: [artists[12]], year: 2024, tracks: [tracks[17]], color: "#2d4a3b" },
  { id: "al17", title: "Parallel Lines", artists: [artists[14]], year: 2024, tracks: [tracks[18]], color: "#5c2d4a" },
  { id: "al18", title: "Open Skies", artists: [artists[12]], year: 2024, tracks: [tracks[19]], color: "#4a2d5c" },
];

// ── Mock Playlists ─────────────────────────────────────────────
const playlists: Playlist[] = [
  {
    id: "pl1", title: "Chill Vibes", tracks: tracks.slice(0, 5),
    createdAt: "2024-01-15", updatedAt: "2024-12-01",
  },
  {
    id: "pl2", title: "Coding Music", tracks: tracks.slice(5, 12),
    createdAt: "2024-02-10", updatedAt: "2024-11-20",
  },
  {
    id: "pl3", title: "Workout", tracks: tracks.slice(10, 15),
    createdAt: "2024-03-05", updatedAt: "2024-10-15",
  },
  {
    id: "pl4", title: "Liked Songs", tracks: [...tracks],
    createdAt: "2024-01-01", updatedAt: "2024-12-10",
  },
];

// ── Mock provider colors for playlist art ──────────────────────
const playlistColors: Record<string, string> = {
  pl1: "#1a3a4a",
  pl2: "#3a1a4a",
  pl3: "#4a3a1a",
  pl4: "#2a2a4a",
};

// ── Helper: get greeting based on time of day ──────────────────
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// ── Mock Music Provider ────────────────────────────────────────
export class MockMusicProvider implements MusicProvider {
  async search(query: string): Promise<SearchResult> {
    const q = query.toLowerCase();
    return {
      tracks: tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artists.some((a) => a.name.toLowerCase().includes(q))
      ),
      albums: albums.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.artists.some((a2) => a2.name.toLowerCase().includes(q))
      ),
      artists: artists.filter((a) => a.name.toLowerCase().includes(q)),
      playlists: playlists.filter((p) => p.title.toLowerCase().includes(q)),
    };
  }

  async getTrack(id: string): Promise<Track> {
    const track = tracks.find((t) => t.id === id);
    if (!track) throw new Error(`Track ${id} not found`);
    return track;
  }

  async getAlbum(id: string): Promise<Album> {
    const album = albums.find((a) => a.id === id);
    if (!album) throw new Error(`Album ${id} not found`);
    return album;
  }

  async getArtist(id: string): Promise<Artist> {
    const artist = artists.find((a) => a.id === id);
    if (!artist) throw new Error(`Artist ${id} not found`);
    return artist;
  }

  async getHome(): Promise<HomeFeed> {
    return {
      greeting: getGreeting(),
      featured: albums.slice(0, 6),
      recentlyPlayed: tracks.slice(0, 5),
      madeForYou: playlists,
      trending: tracks.slice(6, 12),
      recommendedAlbums: albums.slice(12, 18),
    };
  }

  async getStream(_track: Track): Promise<{ url: string }> {
    // Mock: return a silent audio placeholder
    return { url: "" };
  }

  /** Expose raw data for components that need lists */
  getTracks(): Track[] {
    return [...tracks];
  }

  getAlbums(): Album[] {
    return [...albums];
  }

  getArtists(): Artist[] {
    return [...artists];
  }

  getPlaylists(): Playlist[] {
    return [...playlists];
  }

  getPlaylistColor(id: string): string {
    return playlistColors[id] || "#2a2a3a";
  }

  async getLyrics(trackId: string): Promise<import("./types").Lyrics | null> {
    const track = tracks.find((t) => t.id === trackId);
    if (!track) return null;
    const lines: import("./types").LyricsLine[] = [
      { startMs: 0, endMs: 3000, text: "[instrumental intro]" },
      { startMs: 3000, endMs: 7500, text: "walking through the silence" },
      { startMs: 7500, endMs: 12000, text: "every shadow feels like home" },
      { startMs: 12000, endMs: 16500, text: "and the echoes keep on calling" },
      { startMs: 16500, endMs: 21000, text: "but I never answer back alone" },
      { startMs: 21000, endMs: 25500, text: "the city hums in frequencies" },
      { startMs: 25500, endMs: 30000, text: "only dreamers seem to hear" },
      { startMs: 30000, endMs: 34500, text: "every melody a memory" },
      { startMs: 34500, endMs: 39000, text: "every rhythm draws you near" },
      { startMs: 39000, endMs: 43500, text: "we are signals in the dark" },
      { startMs: 43500, endMs: 48000, text: "transmitting hope from heart to heart" },
      { startMs: 48000, endMs: 52500, text: "and when the frequency aligns" },
      { startMs: 52500, endMs: 57000, text: "you hear the echo of a start" },
      { startMs: 57000, endMs: 61500, text: "[instrumental bridge]" },
      { startMs: 61500, endMs: 66000, text: "fading into amber light" },
      { startMs: 66000, endMs: 70500, text: "where the music never stops" },
      { startMs: 70500, endMs: 75000, text: "and the silence is a song" },
      { startMs: 75000, endMs: 80000, text: "playing softly just for us" },
      { startMs: 80000, endMs: 85000, text: "[outro]" },
    ];
    return { trackId, synced: true, lines };
  }

  /** Get all tracks for library views */
  getAllTracks(): Track[] {
    return [...tracks];
  }
}

export const mockProvider = new MockMusicProvider();
