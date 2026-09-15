import type { Track } from "@/domain/types";

interface MediaSessionHandlers {
  onPlay?: () => void;
  onPause?: () => void;
  onPreviousTrack?: () => void;
  onNextTrack?: () => void;
  onSeekTo?: (timeMs: number) => void;
  onSeekBackward?: (timeMs: number) => void;
  onSeekForward?: (timeMs: number) => void;
}

const SEEK_STEP_MS = 10_000;

export function isMediaSessionAvailable(): boolean {
  return typeof navigator !== "undefined" && "mediaSession" in navigator;
}

/**
 * Update Media Session metadata for the current track.
 */
export function updateMediaSessionMetadata(track: Track | null): void {
  if (!isMediaSessionAvailable() || !track) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album?.title || "",
    artwork: track.thumbnailUrl
      ? [{ src: track.thumbnailUrl, sizes: "512x512", type: "image/jpeg" }]
      : [],
  });
}

/**
 * Update Media Session playback state.
 */
export function updateMediaSessionState(
  state: "none" | "paused" | "playing"
): void {
  if (!isMediaSessionAvailable()) return;
  navigator.mediaSession.playbackState = state;
}

/**
 * Update Media Session position state (for seek bar on OS controls).
 */
export function updateMediaSessionPosition(
  currentTimeMs: number,
  durationMs: number
): void {
  if (!isMediaSessionAvailable()) return;
  if (durationMs <= 0) return;

  try {
    navigator.mediaSession.setPositionState({
      duration: durationMs / 1000,
      playbackRate: 1,
      position: Math.min(currentTimeMs / 1000, durationMs / 1000),
    });
  } catch {
    // Some browsers throw if position is invalid
  }
}

/**
 * Register Media Session action handlers.
 * Safe to call multiple times — replaces previous handlers.
 */
export function registerMediaSessionActions(
  handlers: MediaSessionHandlers
): void {
  if (!isMediaSessionAvailable()) return;

  const ms = navigator.mediaSession;

  ms.setActionHandler("play", () => handlers.onPlay?.());
  ms.setActionHandler("pause", () => handlers.onPause?.());
  ms.setActionHandler("previoustrack", () => handlers.onPreviousTrack?.());
  ms.setActionHandler("nexttrack", () => handlers.onNextTrack?.());

  ms.setActionHandler("seekto", (details) => {
    if (details.seekTime != null) {
      handlers.onSeekTo?.(Math.floor(details.seekTime * 1000));
    }
  });

  ms.setActionHandler("seekbackward", () => {
    handlers.onSeekBackward?.(SEEK_STEP_MS);
  });

  ms.setActionHandler("seekforward", () => {
    handlers.onSeekForward?.(SEEK_STEP_MS);
  });
}

/**
 * Clear all Media Session action handlers.
 */
export function clearMediaSessionActions(): void {
  if (!isMediaSessionAvailable()) return;
  const ms = navigator.mediaSession;

  const actions: MediaSessionAction[] = [
    "play",
    "pause",
    "previoustrack",
    "nexttrack",
    "seekto",
    "seekbackward",
    "seekforward",
  ];
  for (const action of actions) {
    try {
      ms.setActionHandler(action, null);
    } catch {
      // action not supported
    }
  }
}
