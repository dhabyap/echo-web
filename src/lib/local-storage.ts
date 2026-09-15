import type { Track } from "@/domain/types";

const PREFIX = "echoweb_";

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // quota exceeded or private browsing — silently ignore
  }
}

// ── Queue ──────────────────────────────────────────────────────
export function saveQueue(queue: Track[], index: number): void {
  // Only store minimal track data to avoid bloating localStorage
  const minimal = queue.map((t) => ({
    id: t.id,
    title: t.title,
    artists: t.artists,
    durationMs: t.durationMs,
    thumbnailUrl: t.thumbnailUrl,
    provider: t.provider,
    providerTrackId: t.providerTrackId,
    playable: t.playable,
    color: t.color,
  }));
  safeSet("queue", minimal);
  safeSet("queueIndex", index);
}

export function loadQueue(): { queue: Track[]; index: number } {
  const queue = safeGet<Track[]>("queue", []);
  const index = safeGet<number>("queueIndex", -1);
  return { queue, index: Math.min(index, queue.length - 1) };
}

// ── Volume ─────────────────────────────────────────────────────
export function saveVolume(v: number): void {
  safeSet("volume", v);
}

export function loadVolume(): number {
  return safeGet<number>("volume", 0.78);
}

// ── Recently Played ────────────────────────────────────────────
export function saveRecentlyPlayed(tracks: Track[]): void {
  const minimal = tracks.map((t) => ({
    id: t.id,
    title: t.title,
    artists: t.artists,
    durationMs: t.durationMs,
    thumbnailUrl: t.thumbnailUrl,
    provider: t.provider,
    providerTrackId: t.providerTrackId,
    playable: t.playable,
    color: t.color,
  }));
  safeSet("recentlyPlayed", minimal);
}

export function loadRecentlyPlayed(): Track[] {
  return safeGet<Track[]>("recentlyPlayed", []);
}

// ── Autoplay ───────────────────────────────────────────────────
export function saveAutoplay(v: boolean): void {
  safeSet("autoplay", v);
}

export function loadAutoplay(): boolean {
  return safeGet<boolean>("autoplay", true);
}

// ── Favorites ──────────────────────────────────────────────
export function saveFavorites(ids: string[]): void {
  safeSet("favorites", ids);
}

export function loadFavorites(): string[] {
  return safeGet<string[]>("favorites", []);
}
