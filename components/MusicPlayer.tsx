import { ChevronLeft, ChevronRight, Music2, Pause } from "lucide-react";
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
  mobile?: boolean;
  className?: string;
};

export default function MusicPlayer({
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
  mobile = false,
  className,
}: MusicPlayerProps) {
  if (mobile) {
    return (
      <div className="fixed bottom-5 left-5 z-50 flex items-center gap-3 rounded-2xl border border-red-500/35 bg-black/75 px-3 py-2 shadow-[0_0_18px_rgba(255,0,60,0.22)] backdrop-blur-xl xl:hidden">
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

        <select
          value={currentTrackId}
          onChange={(event) =>
            onTrackChange(event.target.value as MusicTrackId)
          }
          className="music-select max-w-[148px] rounded-xl border border-red-500/30 bg-black/60 px-2 py-1 text-xs text-white outline-none"
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

        <input
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={musicVolume}
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          className="w-20"
          aria-label="Adjust music volume"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-3 rounded-3xl border border-red-500/25 bg-white/[0.04] p-4 shadow-[0_0_24px_rgba(255,0,60,0.12)] backdrop-blur-md",
        compact ? "w-full max-w-[320px]" : "w-full max-w-[420px]",
        className
      )}
    >
      <div className="flex flex-wrap items-start gap-2">
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

        <div
          className={cn(
            "min-w-0 rounded-xl border border-red-500/30 bg-black/50",
            compact ? "flex-1 px-2.5 py-2" : "flex-1 px-3 py-2"
          )}
        >
          <p
            className={cn(
              "uppercase text-red-300",
              compact ? "text-[9px] tracking-[0.16em]" : "text-[10px] tracking-[0.18em]"
            )}
          >
            Theme
          </p>
          <select
            value={currentTrackId}
            onChange={(event) =>
              onTrackChange(event.target.value as MusicTrackId)
            }
            className={cn(
              "music-select mt-1 w-full bg-transparent pr-5 text-white outline-none",
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

        <div className={compact ? "w-[84px]" : "w-24"}>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            value={musicVolume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            aria-label="Adjust music volume"
          />
        </div>
      </div>

      {onPrevious && onNext ? (
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onPrevious}
            className={cn(
              "inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 text-white/85 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200",
              compact ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-2 text-xs"
            )}
          >
            <ChevronLeft className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
            Previous
          </button>

          <button
            onClick={onNext}
            className={cn(
              "inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 text-white/85 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200",
              compact ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-2 text-xs"
            )}
          >
            Next
            <ChevronRight className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
