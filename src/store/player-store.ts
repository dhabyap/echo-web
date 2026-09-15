import { create } from "zustand";
import type { PlayerStatus, RepeatMode, Track } from "@/domain/types";
import { audioEngine } from "@/lib/audio-engine";
import {
  updateMediaSessionMetadata,
  updateMediaSessionState,
  updateMediaSessionPosition,
  registerMediaSessionActions,
} from "@/lib/media-session";
import {
  saveQueue,
  loadQueue,
  saveVolume,
  loadVolume,
  saveRecentlyPlayed,
  loadRecentlyPlayed,
  saveAutoplay,
  loadAutoplay,
  saveFavorites,
  loadFavorites,
} from "@/lib/local-storage";
import { mockProvider } from "@/domain/mock-provider";
import { deezerProvider } from "@/domain/deezer-provider";
import { youtubeProvider } from "@/domain/youtube-provider";
import type { MusicProvider } from "@/domain/provider";

/** Resolve current provider from providerName flag */
function getProvider(providerName: string): MusicProvider {
  switch (providerName) {
    case "youtube":
      return youtubeProvider;
    case "deezer":
      return deezerProvider;
    case "mock":
    default:
      return mockProvider;
  }
}

export type PlayerStore = {
  status: PlayerStatus;
  currentTrack: Track | null;
  currentTimeMs: number;
  durationMs: number;
  volume: number;
  queue: Track[];
  queueIndex: number;
  shuffle: boolean;
  repeat: RepeatMode;
  queueVisible: boolean;
  autoplay: boolean;
  recentlyPlayed: Track[];
  audioReady: boolean;
  favoriteIds: string[];
  providerName: "mock" | "deezer" | "youtube";

  // Actions
  initAudio: () => void;
  play: (track: Track, queue?: Track[]) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  seek: (ms: number) => void;
  setVolume: (v: number) => void;
  next: () => void;
  previous: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleQueue: () => void;
  toggleAutoplay: () => void;
  playTrackAtIndex: (index: number) => void;
  toggleFavorite: (trackId: string) => void;
  toggleProvider: () => void;
  /** Restore persisted state (queue, volume, recently played) */
  restoreState: () => void;
};

function pickNextIndex(
  queue: Track[],
  current: number,
  shuffle: boolean,
  repeat: RepeatMode
): number | null {
  if (queue.length === 0) return null;

  if (shuffle) {
    if (queue.length === 1) {
      return repeat === "off" ? null : 0;
    }
    let idx: number;
    do {
      idx = Math.floor(Math.random() * queue.length);
    } while (idx === current);
    return idx;
  }

  if (current < queue.length - 1) return current + 1;
  if (repeat === "all") return 0;
  return null; // end of queue
}

function pickPrevIndex(
  queue: Track[],
  current: number,
  currentTimeMs: number
): { index: number; restart: boolean } {
  if (queue.length === 0) return { index: current, restart: false };
  if (currentTimeMs > 3000) return { index: current, restart: true };
  const idx = current > 0 ? current - 1 : queue.length - 1;
  return { index: idx, restart: false };
}

/** Add track to recently played, dedup by id, keep last 50 */
function addRecent(track: Track, existing: Track[]): Track[] {
  const filtered = existing.filter((t) => t.id !== track.id);
  return [track, ...filtered].slice(0, 50);
}

/** Async stream fetch + play helper */
function fetchAndPlay(
  provider: MusicProvider,
  track: Track,
  volume: number,
): void {
  void (async () => {
    try {
      const source = await provider.getStream(track);
      audioEngine.setVolume(volume);
      await audioEngine.playUrl(source.url, track);
    } catch {
      usePlayerStore.setState({ status: "error" });
    }
  })();
}

export const usePlayerStore = create<PlayerStore>((set, get) => {
  // Load persisted volume
  const savedVolume = loadVolume();
  const savedAutoplay = loadAutoplay();
  const savedFavoriteIds = loadFavorites();

  return {
    status: "idle",
    currentTrack: null,
    currentTimeMs: 0,
    durationMs: 0,
    volume: savedVolume,
    queue: [],
    queueIndex: -1,
    shuffle: false,
    repeat: "off",
    queueVisible: true,
    autoplay: savedAutoplay,
    recentlyPlayed: loadRecentlyPlayed(),
    audioReady: false,
    favoriteIds: savedFavoriteIds,
    providerName: "youtube",

    restoreState: () => {
      const { queue, index } = loadQueue();
      if (queue.length > 0 && index >= 0 && index < queue.length) {
        set({
          queue,
          queueIndex: index,
          currentTrack: queue[index],
          status: "idle",
          currentTimeMs: 0,
          durationMs: queue[index].durationMs || 0,
        });
      }
    },

    toggleProvider: () => set((s) => ({ providerName: s.providerName === "mock" ? "deezer" : s.providerName === "deezer" ? "youtube" : "mock" })),

    initAudio: () => {
      if (audioEngine.isInitialized) return;

      audioEngine.init();
      audioEngine.setVolume(get().volume);

      audioEngine.on({
        onTimeUpdate: (timeMs) => {
          set({ currentTimeMs: timeMs });
          const { durationMs } = get();
          updateMediaSessionPosition(timeMs, durationMs);
        },
        onDurationChange: (durationMs) => {
          set({ durationMs });
        },
        onPlay: () => {
          set({ status: "playing", audioReady: true });
          updateMediaSessionState("playing");
        },
        onPause: () => {
          set({ status: "paused" });
          updateMediaSessionState("paused");
        },
        onEnded: () => {
          const { autoplay, repeat, queue, queueIndex, shuffle } = get();
          if (repeat === "one") {
            const track = queue[queueIndex];
            if (track) {
              void get().play(track);
            }
            return;
          }
          if (!autoplay) {
            set({ status: "paused" });
            updateMediaSessionState("paused");
            return;
          }
          get().next();
        },
        onError: (message) => {
          console.warn("[AudioEngine]", message);
          const { currentTrack } = get();
          if (currentTrack && audioEngine.audio?.src) {
            set({ status: "error" });
          }
        },
      });

      registerMediaSessionActions({
        onPlay: () => get().togglePlay(),
        onPause: () => get().togglePlay(),
        onPreviousTrack: () => get().previous(),
        onNextTrack: () => get().next(),
        onSeekTo: (timeMs) => get().seek(timeMs),
        onSeekBackward: (timeMs) => {
          const { currentTimeMs } = get();
          get().seek(Math.max(0, currentTimeMs - timeMs));
        },
        onSeekForward: (timeMs) => {
          const { currentTimeMs, durationMs } = get();
          get().seek(Math.min(durationMs, currentTimeMs + timeMs));
        },
      });

      set({ audioReady: true });
    },

    play: (track, queue) => {
      let newQueue: Track[];
      let newIdx: number;

      if (queue) {
        newQueue = queue;
        newIdx = queue.findIndex((t) => t.id === track.id);
        if (newIdx < 0) newIdx = 0;
      } else {
        const { queue: existingQueue } = get();
        const existingIdx = existingQueue.findIndex(
          (t) => t.id === track.id
        );
        if (existingIdx >= 0) {
          newQueue = existingQueue;
          newIdx = existingIdx;
        } else {
          newQueue = [...existingQueue, track];
          newIdx = existingQueue.length;
        }
      }

      set({
        currentTrack: track,
        queue: newQueue,
        queueIndex: newIdx,
        currentTimeMs: 0,
        durationMs: track.durationMs || 0,
        status: "loading",
      });

      updateMediaSessionMetadata(track);

      set((s) => ({
        recentlyPlayed: addRecent(track, s.recentlyPlayed),
      }));

      saveQueue(newQueue, newIdx);
      saveRecentlyPlayed(get().recentlyPlayed);

      // Resolve provider based on stored name
    const provider = getProvider(get().providerName);

      fetchAndPlay(provider, track, get().volume);
    },

    pause: () => {
      audioEngine.pause();
    },

    resume: () => {
      const { currentTrack, queue, queueIndex, status, providerName } = get();
      if (status === "paused" && currentTrack) {
        audioEngine.resume();
      } else if (currentTrack) {
        get().play(currentTrack);
      } else if (queue.length > 0 && queueIndex >= 0) {
        get().play(queue[queueIndex]);
      }
    },

    togglePlay: () => {
      const { status } = get();
      if (status === "playing") {
        get().pause();
      } else if (status === "paused") {
        audioEngine.resume();
      } else {
        get().resume();
      }
    },

    seek: (ms) => {
      const clamped = Math.max(0, Math.min(ms, get().durationMs || ms));
      audioEngine.seek(clamped);
      set({ currentTimeMs: clamped });
    },

    setVolume: (v) => {
      const clamped = Math.max(0, Math.min(1, v));
      audioEngine.setVolume(clamped);
      set({ volume: clamped });
      saveVolume(clamped);
    },

    next: () => {
      const { queue, queueIndex, shuffle, repeat, providerName } = get();
      const nextIdx = pickNextIndex(queue, queueIndex, shuffle, repeat);
      if (nextIdx === null) {
        set({ status: "idle" });
        audioEngine.stop();
        updateMediaSessionState("none");
        return;
      }
      const track = queue[nextIdx];
      set({
        currentTrack: track,
        queueIndex: nextIdx,
        currentTimeMs: 0,
        durationMs: track.durationMs || 0,
        status: "loading",
      });
      saveQueue(queue, nextIdx);
      updateMediaSessionMetadata(track);

      // Use proxy for Invidious to avoid CORS
      const provider = getProvider(providerName);
      fetchAndPlay(provider, track, get().volume);
    },

    previous: () => {
      const { queue, queueIndex, currentTimeMs, providerName } = get();
      const { index, restart } = pickPrevIndex(queue, queueIndex, currentTimeMs);

      if (restart) {
        audioEngine.seek(0);
        set({ currentTimeMs: 0 });
        return;
      }

      const track = queue[index];
      set({
        currentTrack: track,
        queueIndex: index,
        currentTimeMs: 0,
        durationMs: track.durationMs || 0,
        status: "loading",
      });
      saveQueue(queue, index);
      updateMediaSessionMetadata(track);

      // Use proxy for Invidious to avoid CORS
      const provider = getProvider(providerName);
      fetchAndPlay(provider, track, get().volume);
    },

    playTrackAtIndex: (index) => {
      const { queue, providerName } = get();
      if (index < 0 || index >= queue.length) return;
      const track = queue[index];
      set({
        currentTrack: track,
        queueIndex: index,
        currentTimeMs: 0,
        durationMs: track.durationMs || 0,
        status: "loading",
      });
      saveQueue(queue, index);
      updateMediaSessionMetadata(track);

      // Use proxy for Invidious to avoid CORS
      const provider = getProvider(providerName);
      fetchAndPlay(provider, track, get().volume);
    },

    toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),

    cycleRepeat: () =>
      set((s) => ({
        repeat:
          s.repeat === "off"
            ? "all"
            : s.repeat === "all"
              ? "one"
              : "off",
      })),

    setQueue: (tracks) => {
      set({ queue: tracks, queueIndex: -1 });
      saveQueue(tracks, -1);
    },

    addToQueue: (track) =>
      set((s) => {
        const newQueue = [...s.queue, track];
        saveQueue(newQueue, s.queueIndex);
        return { queue: newQueue };
      }),

    removeFromQueue: (index) =>
      set((s) => {
        const newQueue = s.queue.filter((_, i) => i !== index);
        let newIndex = s.queueIndex;
        if (index < s.queueIndex) newIndex--;
        if (index === s.queueIndex) {
          const safeIdx = Math.min(newIndex, newQueue.length - 1);
          saveQueue(newQueue, safeIdx);
          return {
            queue: newQueue,
            queueIndex: safeIdx,
            currentTrack: newQueue[safeIdx] || null,
          };
        }
        saveQueue(newQueue, newIndex);
        return { queue: newQueue, queueIndex: newIndex };
      }),

    clearQueue: () => {
      audioEngine.stop();
      set({ queue: [], queueIndex: -1, currentTrack: null, status: "idle" });
      updateMediaSessionState("none");
      updateMediaSessionMetadata(null);
      saveQueue([], -1);
    },

    toggleQueue: () => set((s) => ({ queueVisible: !s.queueVisible })),

    toggleAutoplay: () =>
      set((s) => {
        const next = !s.autoplay;
        saveAutoplay(next);
        return { autoplay: next };
      }),

    toggleFavorite: (trackId) =>
      set((s) => {
        const exists = s.favoriteIds.includes(trackId);
        const next = exists
          ? s.favoriteIds.filter((id) => id !== trackId)
          : [...s.favoriteIds, trackId];
        saveFavorites(next);
        return { favoriteIds: next };
      }),
  };
});
