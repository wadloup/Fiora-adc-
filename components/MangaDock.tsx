import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Columns2,
  Maximize2,
  Minus,
  PanelTopOpen,
  Pause,
  Play,
  Plus,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

const MANGA_PAGES = [
  { src: "/manga/planche-1.png", alt: "Manga page 1" },
  { src: "/manga/planche-2.png", alt: "Manga page 2" },
  { src: "/manga/planche-3.png", alt: "Manga page 3" },
  { src: "/manga/planche-4.png", alt: "Manga page 4" },
  { src: "/manga/planche-5.png", alt: "Manga page 5" },
  { src: "/manga/planche-6.png", alt: "Manga page 6" },
  { src: "/manga/planche-7.png", alt: "Manga page 7" },
  { src: "/manga/planche-8.png", alt: "Manga page 8" },
  { src: "/manga/planche-9.png", alt: "Manga page 9" },
  { src: "/manga/planche-10.png", alt: "Manga page 10" },
  { src: "/manga/planche-11.png", alt: "Manga page 11" },
  { src: "/manga/planche-12.png", alt: "Manga page 12" },
  { src: "/manga/planche-13.png", alt: "Manga page 13" },
  { src: "/manga/planche-14.png", alt: "Manga page 14" },
  { src: "/manga/planche-15.png", alt: "Manga page 15" },
  { src: "/manga/planche-16.png", alt: "Manga page 16" },
  { src: "/manga/planche-17.png", alt: "Manga page 17" },
  { src: "/manga/planche-18.png", alt: "Manga page 18" },
  { src: "/manga/planche-19.png", alt: "Manga page 19" },
  { src: "/manga/planche-20.png", alt: "Manga page 20" },
];

const ZOOM_STEPS = [0.75, 0.9, 1, 1.15, 1.35, 1.6, 1.9, 2.25];
const MANGA_TRACKS = [
  {
    title: "Big Bad Noisy",
    subtitle: "Sons of Amon",
    src: "/audio/big-bad-noisy-sons-of-amon.mp3",
  },
  {
    title: "GODS",
    subtitle: "NewJeans - Levitated Grooves Remix",
    src: "/audio/gods-newjeans-levitated-grooves-remix.mp3",
  },
  {
    title: "Rush Forward",
    subtitle: "Manga rush",
    src: "/audio/rush-forward.mp3",
  },
];
const DEFAULT_MANGA_TRACK_INDEX = 1;

type MangaViewMode = "single" | "double";

type MangaDockProps = {
  onOpen?: () => void;
  onClose?: () => void;
};

export default function MangaDock({ onOpen, onClose }: MangaDockProps) {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<MangaViewMode>("double");
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(2);
  const [mangaPlaying, setMangaPlaying] = useState(false);
  const [mangaVolume, setMangaVolume] = useState(0.42);
  const [activeTrackIndex, setActiveTrackIndex] = useState(DEFAULT_MANGA_TRACK_INDEX);
  const mangaAudioRef = useRef<HTMLAudioElement | null>(null);
  const pausedSiteMediaRef = useRef<HTMLMediaElement[]>([]);
  const pausedSpeechByMangaRef = useRef(false);
  const playAfterTrackChangeRef = useRef(false);
  const zoom = ZOOM_STEPS[zoomIndex];
  const activeTrack = MANGA_TRACKS[activeTrackIndex];
  const pageCountLabel = `${MANGA_PAGES.length} pages`;
  const previewTitle = `${MANGA_PAGES.length}-page preview`;

  const playMangaAudio = async () => {
    const audio = mangaAudioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = mangaVolume;

    try {
      await audio.play();
      setMangaPlaying(true);
    } catch {
      setMangaPlaying(false);
    }
  };

  const pauseMangaAudio = () => {
    const audio = mangaAudioRef.current;
    if (!audio) {
      return;
    }

    audio.pause();
    setMangaPlaying(false);
  };

  const pauseSiteMediaForManga = () => {
    if (typeof document === "undefined") {
      return;
    }

    const mangaAudio = mangaAudioRef.current;
    pausedSiteMediaRef.current = [];
    pausedSpeechByMangaRef.current = false;

    document.querySelectorAll<HTMLMediaElement>("audio, video").forEach((media) => {
      const isSilentVideo =
        media.tagName === "VIDEO" && (media.muted || media.volume === 0);

      if (media === mangaAudio || media.paused || media.ended || isSilentVideo) {
        return;
      }

      pausedSiteMediaRef.current.push(media);
      media.pause();
    });

    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      window.speechSynthesis.speaking &&
      !window.speechSynthesis.paused
    ) {
      window.speechSynthesis.pause();
      pausedSpeechByMangaRef.current = true;
    }
  };

  const resumeSiteMediaAfterManga = () => {
    pausedSiteMediaRef.current.forEach((media) => {
      if (!media.isConnected || media.ended) {
        return;
      }

      void media.play().catch(() => undefined);
    });
    pausedSiteMediaRef.current = [];

    if (
      pausedSpeechByMangaRef.current &&
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.resume();
    }
    pausedSpeechByMangaRef.current = false;
  };

  const openReader = () => {
    onOpen?.();
    pauseSiteMediaForManga();
    setOpen(true);

    const audio = mangaAudioRef.current;
    if (activeTrackIndex !== DEFAULT_MANGA_TRACK_INDEX) {
      playAfterTrackChangeRef.current = true;
      setActiveTrackIndex(DEFAULT_MANGA_TRACK_INDEX);
      return;
    }

    if (audio) {
      audio.currentTime = 0;
    }

    void playMangaAudio();
  };

  const close = () => {
    pauseMangaAudio();
    resumeSiteMediaAfterManga();
    setOpen(false);
    onClose?.();
  };

  const showSinglePage = (index: number) => {
    setActivePageIndex(index);
    setViewMode("single");
  };

  const previousMangaPage = () => {
    setViewMode("single");
    setActivePageIndex(
      (current) => (current - 1 + MANGA_PAGES.length) % MANGA_PAGES.length
    );
  };

  const nextMangaPage = () => {
    setViewMode("single");
    setActivePageIndex((current) => (current + 1) % MANGA_PAGES.length);
  };

  const zoomOut = () => setZoomIndex((current) => Math.max(0, current - 1));
  const zoomIn = () =>
    setZoomIndex((current) => Math.min(ZOOM_STEPS.length - 1, current + 1));
  const resetZoom = () => setZoomIndex(2);

  const selectMangaTrack = (trackIndex: number) => {
    const audio = mangaAudioRef.current;
    playAfterTrackChangeRef.current = mangaPlaying || Boolean(audio && !audio.paused);
    setActiveTrackIndex(
      (trackIndex + MANGA_TRACKS.length) % MANGA_TRACKS.length
    );
  };

  const previousMangaTrack = () => selectMangaTrack(activeTrackIndex - 1);
  const nextMangaTrack = () => selectMangaTrack(activeTrackIndex + 1);

  const toggleMangaAudio = () => {
    if (mangaPlaying) {
      pauseMangaAudio();
      return;
    }

    void playMangaAudio();
  };

  const changeMangaVolume = (value: number) => {
    setMangaVolume(value);

    if (mangaAudioRef.current) {
      mangaAudioRef.current.volume = value;
    }
  };

  useEffect(() => {
    const audio = mangaAudioRef.current;
    if (!audio) {
      return;
    }

    audio.load();
    audio.currentTime = 0;

    if (!playAfterTrackChangeRef.current) {
      return;
    }

    playAfterTrackChangeRef.current = false;

    audio
      .play()
      .then(() => setMangaPlaying(true))
      .catch(() => setMangaPlaying(false));
  }, [activeTrackIndex]);

  useEffect(() => {
    const audio = mangaAudioRef.current;
    return () => {
      audio?.pause();
      resumeSiteMediaAfterManga();
    };
  }, []);

  const visiblePages =
    viewMode === "double" ? MANGA_PAGES : [MANGA_PAGES[activePageIndex]];

  return (
    <>
      <motion.button
        type="button"
        onClick={openReader}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="manga-dock-card fixed right-4 top-[24.7rem] z-[58] hidden w-[430px] overflow-hidden rounded-3xl border border-red-500/30 bg-[rgba(8,8,10,0.94)] p-5 text-left text-white shadow-[0_0_28px_rgba(255,0,60,0.18)] transition hover:border-red-400/45 hover:bg-[rgba(20,8,12,0.96)] lg:block sm:right-5 md:right-6"
        aria-label="Open manga pages"
      >
        <audio
          ref={mangaAudioRef}
          src={activeTrack.src}
          loop
          preload="none"
          onPlay={() => setMangaPlaying(true)}
          onPause={() => setMangaPlaying(false)}
          onEnded={() => setMangaPlaying(false)}
          onError={() => setMangaPlaying(false)}
        />
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-red-300">
              Read - Manga
            </p>
            <p className="mt-1 truncate text-xl font-black uppercase tracking-[0.06em] text-white">
              Just for my pleasure
            </p>
          </div>
          <span className="rounded-2xl border border-red-400/25 bg-red-500/12 p-2 text-red-200">
            <BookOpen className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/35">
          <img
            src="/manga/planche-1-preview.jpg"
            alt="Manga page 1 preview"
            className="h-[270px] w-full object-cover object-top opacity-90 transition duration-200 hover:opacity-100"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
            {pageCountLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-200">
            Open
            <Maximize2 className="h-3.5 w-3.5" />
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[95] bg-black/82 px-4 py-5 backdrop-blur-md md:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              onClick={close}
              className="fixed right-5 top-5 z-[96] rounded-2xl border border-white/15 bg-black/65 p-3 text-white/88 transition hover:border-red-400/40 hover:text-red-100"
              aria-label="Close manga pages"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-full max-w-[96rem] flex-col gap-3 lg:flex-row">
              <aside className="hide-scrollbar shrink-0 overflow-y-auto rounded-3xl border border-red-500/24 bg-[rgba(12,5,8,0.76)] p-3 text-white shadow-[0_0_26px_rgba(255,0,60,0.16)] lg:h-full lg:w-[18.5rem]">
                <div className="rounded-2xl border border-white/10 bg-black/24 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-300">
                    Manga board
                  </p>
                  <h2 className="mt-1 text-2xl font-black uppercase tracking-[0.04em] text-white">
                    {viewMode === "double"
                      ? previewTitle
                      : `Page ${activePageIndex + 1}`}
                  </h2>
                  <p className="mt-2 inline-flex rounded-2xl border border-red-400/25 bg-red-500/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-red-100">
                    {pageCountLabel}
                  </p>
                </div>

                <div className="mt-3 space-y-3 rounded-2xl border border-white/10 bg-black/24 p-3">
                  <div className="grid grid-cols-[2.5rem_1fr_2.5rem] gap-2">
                    <button
                      type="button"
                      onClick={previousMangaTrack}
                      className="rounded-2xl border border-white/12 bg-white/[0.04] p-2 text-white/78 transition hover:border-red-400/35 hover:text-red-100"
                      aria-label="Previous manga music"
                    >
                      <SkipBack className="mx-auto h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={toggleMangaAudio}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/35 bg-red-500/14 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-red-100 transition hover:bg-red-500/20"
                    >
                      {mangaPlaying ? (
                        <Pause className="h-3.5 w-3.5" />
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                      {mangaPlaying ? "Pause" : "Play"}
                    </button>

                    <button
                      type="button"
                      onClick={nextMangaTrack}
                      className="rounded-2xl border border-white/12 bg-white/[0.04] p-2 text-white/78 transition hover:border-red-400/35 hover:text-red-100"
                      aria-label="Next manga music"
                    >
                      <SkipForward className="mx-auto h-4 w-4" />
                    </button>
                  </div>

                  <label className="block rounded-2xl border border-white/12 bg-white/[0.04] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/68">
                    <span className="text-red-200">Music</span>
                    <select
                      value={activeTrackIndex}
                      onChange={(event) =>
                        selectMangaTrack(Number(event.target.value))
                      }
                      className="mt-1 w-full border-0 bg-transparent text-xs font-black uppercase tracking-[0.06em] text-white outline-none"
                      aria-label="Choose manga music"
                    >
                      {MANGA_TRACKS.map((track, index) => (
                        <option
                          key={track.src}
                          value={index}
                          className="bg-black text-white"
                        >
                          {track.title} - {track.subtitle}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.04] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/68">
                    <Volume2 className="h-3.5 w-3.5 shrink-0 text-red-200" />
                    <input
                      type="range"
                      min="0"
                      max="0.8"
                      step="0.01"
                      value={mangaVolume}
                      onChange={(event) =>
                        changeMangaVolume(Number(event.target.value))
                      }
                      className="control-slider w-full"
                      aria-label="Manga music volume"
                    />
                  </label>

                  <div className="inline-flex w-full items-center justify-between gap-1 rounded-2xl border border-white/12 bg-white/[0.04] p-1">
                    <button
                      type="button"
                      onClick={zoomOut}
                      disabled={zoomIndex === 0}
                      className="rounded-xl p-2 text-white/78 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                      aria-label="Zoom out"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={resetZoom}
                      className="inline-flex min-w-[84px] items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/72 transition hover:text-white"
                      aria-label="Reset zoom"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      {Math.round(zoom * 100)}%
                    </button>
                    <button
                      type="button"
                      onClick={zoomIn}
                      disabled={zoomIndex === ZOOM_STEPS.length - 1}
                      className="rounded-xl p-2 text-white/78 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                      aria-label="Zoom in"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-white/10 bg-black/24 p-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300">
                    Pages
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setViewMode("double")}
                      className={cn(
                        "inline-flex h-10 items-center justify-center gap-1.5 rounded-2xl border px-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition",
                        viewMode === "double"
                          ? "border-red-400/45 bg-red-500/16 text-red-100"
                          : "border-white/12 bg-white/[0.04] text-white/68 hover:text-white"
                      )}
                    >
                      <Columns2 className="h-3.5 w-3.5" />
                      All
                    </button>

                    {MANGA_PAGES.map((_, index) => (
                      <button
                        key={`single-page-${index}`}
                        type="button"
                        onClick={() => showSinglePage(index)}
                        className={cn(
                          "inline-flex h-10 items-center justify-center gap-1.5 rounded-2xl border px-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition",
                          viewMode === "single" && activePageIndex === index
                            ? "border-red-400/45 bg-red-500/16 text-red-100"
                            : "border-white/12 bg-white/[0.04] text-white/68 hover:text-white"
                        )}
                      >
                        <PanelTopOpen className="h-3.5 w-3.5" />
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="min-h-0 flex-1 overflow-auto rounded-3xl border border-white/10 bg-black/36 p-3 md:p-4">
                <div
                  className={cn(
                    "mx-auto grid w-max origin-top gap-4 transition-transform duration-200 ease-out",
                    viewMode === "double" ? "xl:grid-cols-2" : "grid-cols-1"
                  )}
                  style={{ transform: `scale(${zoom})` }}
                >
                  {visiblePages.map((page) => {
                    const realIndex = MANGA_PAGES.findIndex(
                      (entry) => entry.src === page.src
                    );

                    return (
                      <button
                        key={page.src}
                        type="button"
                        onClick={() => {
                          if (viewMode === "double") {
                            showSinglePage(realIndex);
                          }
                        }}
                        className={cn(
                          "overflow-hidden rounded-2xl border border-white/10 bg-black/45 text-left shadow-[0_18px_60px_rgba(0,0,0,0.35)]",
                          viewMode === "double"
                            ? "w-[min(82vw,520px)] xl:w-[520px]"
                            : "w-[min(92vw,920px)] lg:w-[min(72vw,940px)] xl:w-[920px]",
                          viewMode === "double"
                            ? "cursor-zoom-in transition hover:border-red-400/45 hover:shadow-[0_18px_70px_rgba(255,0,60,0.18)]"
                            : "cursor-default"
                        )}
                        aria-label={`Open page ${realIndex + 1} in single-page mode`}
                      >
                        <div className="border-b border-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-200">
                          Page {realIndex + 1}
                        </div>
                        <img
                          src={page.src}
                          alt={page.alt}
                          className="block w-full object-contain"
                          loading="eager"
                          decoding="async"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pointer-events-none fixed bottom-8 right-8 z-[96] flex items-center gap-4">
                <button
                  type="button"
                  onClick={previousMangaPage}
                  className="pointer-events-auto inline-flex min-w-[168px] items-center justify-center gap-4 rounded-[1.65rem] border-2 border-white/40 bg-black px-8 py-5 text-lg font-black uppercase tracking-[0.18em] text-white shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_28px_rgba(255,255,255,0.18)] ring-1 ring-white/20 backdrop-blur-xl transition hover:scale-[1.03] hover:border-red-200/80 hover:bg-red-950 hover:text-red-50 hover:shadow-[0_22px_70px_rgba(0,0,0,0.95),0_0_36px_rgba(255,80,120,0.34)]"
                  aria-label="Previous manga page"
                >
                  <SkipBack className="h-7 w-7" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextMangaPage}
                  className="pointer-events-auto inline-flex min-w-[168px] items-center justify-center gap-4 rounded-[1.65rem] border-2 border-red-200/80 bg-red-950 px-8 py-5 text-lg font-black uppercase tracking-[0.18em] text-red-50 shadow-[0_20px_60px_rgba(0,0,0,0.86),0_0_42px_rgba(255,0,72,0.5)] ring-1 ring-red-200/30 backdrop-blur-xl transition hover:scale-[1.03] hover:border-white/85 hover:bg-red-900 hover:shadow-[0_22px_70px_rgba(0,0,0,0.94),0_0_54px_rgba(255,40,100,0.68)]"
                  aria-label="Next manga page"
                >
                  Next
                  <SkipForward className="h-7 w-7" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
