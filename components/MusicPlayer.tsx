import { Music2, Pause } from "lucide-react";
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
          className="max-w-[148px] rounded-xl border border-red-500/30 bg-black/60 px-2 py-1 text-xs text-white outline-none"
          aria-label="Select music track"
        >
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
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
    <div className={cn("flex shrink-0 items-center gap-2", className)}>
      <button
        onClick={onToggle}
        className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-white transition hover:bg-red-500/15"
      >
        <span className="inline-flex items-center gap-2">
          {musicPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Music2 className="h-4 w-4" />
          )}
          {musicPlaying ? "Music ON" : "Music OFF"}
        </span>
      </button>

      <div className="rounded-xl border border-red-500/30 bg-black/50 px-3 py-2">
        <p className="text-[10px] uppercase tracking-[0.18em] text-red-300">
          Theme
        </p>
        <select
          value={currentTrackId}
          onChange={(event) =>
            onTrackChange(event.target.value as MusicTrackId)
          }
          className="mt-1 w-[220px] bg-transparent text-sm text-white outline-none"
          aria-label="Select music track"
        >
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-24">
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
  );
}
