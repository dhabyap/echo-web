import type { Track } from "@/domain/types";

export type AudioEngineEvents = {
  onTimeUpdate?: (timeMs: number) => void;
  onDurationChange?: (durationMs: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (message: string) => void;
};

/**
 * Singleton audio engine wrapping a single HTMLAudioElement.
 * The store owns queue/logic; the engine handles raw audio.
 */
class AudioEngine {
  private _audio: HTMLAudioElement | null = null;
  private _events: AudioEngineEvents = {};
  private _track: Track | null = null;
  private _initialized = false;

  /** Lazily create the audio element (must run in browser) */
  init(): void {
    if (this._initialized) return;
    if (typeof window === "undefined") return;

    this._audio = new Audio();
    this._audio.preload = "metadata";

    this._audio.addEventListener("timeupdate", () => {
      if (!this._audio) return;
      this._events.onTimeUpdate?.(Math.floor(this._audio.currentTime * 1000));
    });

    this._audio.addEventListener("durationchange", () => {
      if (!this._audio) return;
      this._events.onDurationChange?.(
        Math.floor((this._audio.duration || 0) * 1000)
      );
    });

    this._audio.addEventListener("play", () => {
      this._events.onPlay?.();
    });

    this._audio.addEventListener("pause", () => {
      // Only fire pause for real pauses, not end-of-track (ended fires first)
      this._events.onPause?.();
    });

    this._audio.addEventListener("ended", () => {
      this._events.onEnded?.();
    });

    this._audio.addEventListener("error", () => {
      const msg = this._audio?.error?.message || "Playback error";
      this._events.onError?.(msg);
    });

    this._initialized = true;
  }

  get isInitialized(): boolean {
    return this._initialized;
  }

  /** Attach event callbacks */
  on(events: AudioEngineEvents): void {
    this._events = { ...this._events, ...events };
  }

  /** Remove all event callbacks */
  off(): void {
    this._events = {};
  }

  /** The raw HTMLAudioElement (for Media Session, etc.) */
  get audio(): HTMLAudioElement | null {
    return this._audio;
  }

  /** Current track being played through this engine */
  get currentTrack(): Track | null {
    return this._track;
  }

  /** Load and play a track by URL */
  async playUrl(url: string, track: Track): Promise<void> {
    if (!this._audio) this.init();
    if (!this._audio) return;

    this._track = track;

    if (!url) {
      // No real audio source (mock mode) — just fire events for UI
      this._events.onDurationChange?.(track.durationMs || 0);
      this._events.onPlay?.();
      return;
    }

    // Pause before changing source to avoid race conditions
    if (!this._audio.paused) {
      this._audio.pause();
    }

    this._audio.src = url;
    this._audio.load();

    try {
      await this._audio.play();
    } catch (err) {
      // Autoplay policy or network error
      const msg = err instanceof Error ? err.message : "Playback failed";
      this._events.onError?.(msg);
    }
  }

  pause(): void {
    if (this._audio && !this._audio.paused) {
      this._audio.pause();
    }
  }

  resume(): void {
    if (this._audio && this._audio.paused && this._audio.src) {
      this._audio.play().catch(() => {});
    }
  }

  seek(timeMs: number): void {
    if (this._audio) {
      this._audio.currentTime = timeMs / 1000;
    }
  }

  setVolume(v: number): void {
    const clamped = Math.max(0, Math.min(1, v));
    if (this._audio) {
      this._audio.volume = clamped;
    }
  }

  get currentTimeMs(): number {
    return this._audio ? Math.floor(this._audio.currentTime * 1000) : 0;
  }

  get durationMs(): number {
    return this._audio
      ? Math.floor((this._audio.duration || 0) * 1000)
      : 0;
  }

  /** Stop and clear current playback */
  stop(): void {
    if (this._audio) {
      this._audio.pause();
      this._audio.removeAttribute("src");
      this._audio.load();
    }
    this._track = null;
  }
}

// Singleton
export const audioEngine = new AudioEngine();
