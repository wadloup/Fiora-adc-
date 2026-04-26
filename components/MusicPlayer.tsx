import { memo } from "react";
import { Music2, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import type { MusicTheme, MusicTrackId } from "../data/musicThemes";
import { cn } from "../utils/cn";

type MusicPlayerProps = {
  tracks: MusicTheme[];
  currentTrackId: MusicTrackId;
  musicPlaying: boolean;
  musicVolume: number;
  onToggle: () => void;
  onTrackChange: (trackId: MusicTrackId) => void;
  onVolumeChange: (value: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  compact?: boolean;
  dock?: boolean;
  mobile?: boolean;
  className?: string;
};

function MusicPlayer({
  tracks,
  currentTrackId,
  musicPlaying,
  musicVolume,
  onToggle,
  onTrackChange,
  onVolumeChange,
  onPrevious,
  onNext,
  compact = false,
  dock = false,
  mobile = false,
  className,
}: MusicPlayerProps) {
  const currentTrackIndex = tracks.findIndex((track) => track.id === currentTrackId);

  if (dock) {
    const currentTrack = tracks[currentTrackIndex] ?? tracks[0];

    return (
      <div
        className={cn(
          "flex w-full max-w-[330px] shrink-0 flex-col gap-3 rounded-3xl border border-red-500/28 bg-[rgba(18,7,10,0.72)] p-4 shadow-[0_0_26px_rgba(255,0,60,0.16)] backdrop-blur-xl",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-200">
              Music control
            </p>
            <p className="mt-1 truncate text-sm font-black text-white">
              {currentTrack.label}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/55">
            {currentTrackIndex + 1}/{tracks.length}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] text-white/80 transition hover:border-red-300/40 hover:bg-red-500/10"
            aria-label="Previous track"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-red-400/35 bg-red-500/[0.08] text-red-100 transition hover:bg-red-500/[0.14]"
            aria-label="Toggle background music"
          >
            {musicPlaying ? <Pause className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] text-white/80 transition hover:border-red-300/40 hover:bg-red-500/10"
            aria-label="Next track"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Volume2 className="h-4 w-4 shrink-0 text-red-200" />
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            value={musicVolume}
            onInput={(event) =>
              onVolumeChange(Number((event.target as HTMLInputElement).value))
            }
            className="music-slider w-full"
            aria-label="Adjust music volume"
          />
        </div>
      </div>
    );
  }

  if (mobile) {
    return (
      <div className="fixed bottom-5 left-5 z-50 flex max-w-[calc(100vw-5.5rem)] items-center gap-2 rounded-2xl border border-red-500/35 bg-[rgba(8,8,10,0.92)] px-3 py-2 shadow-[0_0_18px_rgba(255,0,60,0.22)] lg:hidden">
        <button
          onClick={onToggle}
          className="text-red-300"
          aria-label="Toggle background music"
        >
          {musicPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Music2 className="h-5 w-5" />
          )}
        </button>

        {onPrevious ? (
          <button
            onClick={onPrevious}
            className="rounded-xl border border-white/15 bg-white/5 p-1.5 text-white/80"
            aria-label="Previous track"
          >
            <SkipBack className="h-4 w-4" />
          </button>
        ) : null}

        <select
          value={currentTrackId}
          onChange={(event) =>
            onTrackChange(event.target.value as MusicTrackId)
          }
          className="music-select min-w-0 flex-1 rounded-xl border border-red-500/30 bg-black/60 px-2 py-1 text-xs text-white outline-none"
          aria-label="Select music track"
        >
          {tracks.map((track) => (
            <option
              key={track.id}
              value={track.id}
              style={{ backgroundColor: "#140709", color: "#ffffff" }}
            >
              {track.label}
            </option>
          ))}
        </select>

        {onNext ? (
          <button
            onClick={onNext}
            className="rounded-xl border border-white/15 bg-white/5 p-1.5 text-white/80"
            aria-label="Next track"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        ) : null}

        <input
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={musicVolume}
          onInput={(event) =>
            onVolumeChange(Number((event.target as HTMLInputElement).value))
          }
          className="music-slider w-16 shrink-0"
          aria-label="Adjust music volume"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-3 rounded-3xl border border-red-500/25 bg-[rgba(18,7,10,0.76)] p-3.5 shadow-[0_0_24px_rgba(255,0,60,0.12)] md:p-4",
        compact ? "w-full max-w-[320px]" : "w-full max-w-[420px]",
        className
      )}
    >
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-red-300/80">
          Music mood
        </p>
        <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
          <h3
            className={cn(
              "font-black uppercase leading-none text-white",
              compact ? "text-xl tracking-[0.08em]" : "text-[1.7rem] tracking-[0.1em]"
            )}
          >
            Choose your vibe
          </h3>
          <p className="pb-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
            I have a preference for LILIUM 2/5
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onToggle}
          className={cn(
            "rounded-xl border border-red-500/30 bg-red-500/10 text-white transition hover:bg-red-500/15",
            compact ? "px-2.5 py-2 text-[11px]" : "px-3 py-2 text-xs"
          )}
        >
          <span className="inline-flex items-center gap-2">
            {musicPlaying ? (
              <Pause className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
            ) : (
              <Music2 className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
            )}
            {musicPlaying ? "Music ON" : "Music OFF"}
          </span>
        </button>

        <div className="min-w-[120px] flex-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-red-300">
              Volume
            </p>
            <span className="text-[10px] text-white/50">
              {Math.round(musicVolume * 200)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            value={musicVolume}
            onInput={(event) =>
              onVolumeChange(Number((event.target as HTMLInputElement).value))
            }
            className="music-slider w-full"
            aria-label="Adjust music volume"
          />
        </div>
      </div>

      <div
        className={cn(
          "min-w-0 rounded-2xl border border-red-500/30 bg-black/50",
          compact ? "px-2.5 py-2" : "px-3 py-2"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "uppercase text-red-300",
              compact
                ? "text-[9px] tracking-[0.16em]"
                : "text-[10px] tracking-[0.18em]"
            )}
          >
            Theme
          </p>
          <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
            {currentTrackIndex + 1}/{tracks.length}
          </span>
        </div>
        <select
          value={currentTrackId}
          onChange={(event) =>
            onTrackChange(event.target.value as MusicTrackId)
          }
          className={cn(
            "music-select mt-1 w-full appearance-none bg-transparent pr-5 text-white outline-none",
            compact ? "text-xs" : "text-sm"
          )}
          aria-label="Select music track"
        >
          {tracks.map((track) => (
            <option
              key={track.id}
              value={track.id}
              style={{ backgroundColor: "#140709", color: "#ffffff" }}
            >
              {track.label}
            </option>
          ))}
        </select>
      </div>

      {onPrevious && onNext ? (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onPrevious}
            className={cn(
              "inline-flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/5 text-white/85 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200",
              compact ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-2 text-xs"
            )}
          >
            <SkipBack className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
            Previous
          </button>

          <button
            onClick={onNext}
            className={cn(
              "inline-flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/5 text-white/85 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200",
              compact ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-2 text-xs"
            )}
          >
            Next
            <SkipForward className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default memo(MusicPlayer);
