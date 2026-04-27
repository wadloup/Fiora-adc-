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
  { src: "/manga/planche-21.png", alt: "Manga page 21" },
  { src: "/manga/planche-22.png", alt: "Manga page 22" },
  { src: "/manga/planche-23.png", alt: "Manga page 23" },
  { src: "/manga/planche-24.png", alt: "Manga page 24" },
  { src: "/manga/planche-25.png", alt: "Manga page 25" },
  { src: "/manga/planche-26.png", alt: "Manga page 26" },
  { src: "/manga/planche-27.png", alt: "Manga page 27" },
  { src: "/manga/planche-28.png", alt: "Manga page 28" },
  { src: "/manga/planche-29.png", alt: "Manga page 29" },
  { src: "/manga/planche-30.png", alt: "Manga page 30" },
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
  openRequest?: number;
};

export default function MangaDock({
  onOpen,
  onClose,
  openRequest = 0,
}: MangaDockProps) {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<MangaViewMode>("single");
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(2);
  const [mangaPlaying, setMangaPlaying] = useState(false);
  const [mangaVolume, setMangaVolume] = useState(0.42);
  const [activeTrackIndex, setActiveTrackIndex] = useState(DEFAULT_MANGA_TRACK_INDEX);
  const mangaAudioRef = useRef<HTMLAudioElement | null>(null);
  const pausedSiteMediaRef = useRef<HTMLMediaElement[]>([]);
  const pausedSpeechByMangaRef = useRef(false);
  const playAfterTrackChangeRef = useRef(false);
  const handledOpenRequestRef = useRef(openRequest);
  const openReaderRef = useRef<(() => void) | null>(null);
  const closeReaderRef = useRef<(() => void) | null>(null);
  const zoom = ZOOM_STEPS[zoomIndex];
  const activeTrack = MANGA_TRACKS[activeTrackIndex];
  const pageCountLabel = `${MANGA_PAGES.length} pages`;
  const previewTitle = `${MANGA_PAGES.length}-page preview`;
  const readerProgress = ((activePageIndex + 1) / MANGA_PAGES.length) * 100;

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
    setViewMode("single");
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

  openReaderRef.current = openReader;

  const close = () => {
    pauseMangaAudio();
    resumeSiteMediaAfterManga();
    setOpen(false);
    onClose?.();
  };

  closeReaderRef.current = close;

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

  useEffect(() => {
    if (!openRequest || openRequest === handledOpenRequestRef.current) {
      return;
    }

    handledOpenRequestRef.current = openRequest;
    openReaderRef.current?.();
  }, [openRequest]);

  useEffect(() => {
    if (!open || viewMode !== "single" || typeof window === "undefined") {
      return;
    }

    const nearbyPages = [
      MANGA_PAGES[(activePageIndex - 1 + MANGA_PAGES.length) % MANGA_PAGES.length],
      MANGA_PAGES[(activePageIndex + 1) % MANGA_PAGES.length],
    ];

    nearbyPages.forEach((page) => {
      const image = new Image();
      image.src = page.src;
    });
  }, [activePageIndex, open, viewMode]);

  useEffect(() => {
    if (!open || typeof window === "undefined") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeReaderRef.current?.();
        return;
      }

      if (event.key === "ArrowLeft") {
        previousMangaPage();
        return;
      }

      if (event.key === "ArrowRight") {
        nextMangaPage();
        return;
      }

      if (event.key === "+" || event.key === "=") {
        zoomIn();
        return;
      }

      if (event.key === "-") {
        zoomOut();
        return;
      }

      if (event.key === "0") {
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePageIndex, open, viewMode, zoomIndex]);

  const visiblePages =
    viewMode === "double" ? MANGA_PAGES : [MANGA_PAGES[activePageIndex]];

  return (
    <>
      <motion.button
        type="button"
        onClick={openReader}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="manga-dock-card fixed right-4 top-[24.7rem] z-[58] hidden w-[var(--manga-dock-width)] overflow-hidden rounded-3xl border border-red-500/30 bg-[rgba(8,8,10,0.94)] p-5 text-left text-white shadow-[0_0_28px_rgba(255,0,60,0.18)] transition hover:border-red-400/45 hover:bg-[rgba(20,8,12,0.96)] lg:block"
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
            className="h-[310px] w-full object-cover object-top opacity-90 transition duration-200 hover:opacity-100"
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
            className="fixed inset-0 z-[95] overflow-hidden bg-[radial-gradient(circle_at_16%_12%,rgba(255,24,82,0.2),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(56,189,248,0.18),transparent_28%),linear-gradient(135deg,rgba(12,2,6,0.96),rgba(0,0,0,0.9)_52%,rgba(4,12,16,0.95))] px-3 py-3 text-white backdrop-blur-xl md:px-5 md:py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="intro-cinematic-grid pointer-events-none fixed inset-0 opacity-25" />
            <div className="pointer-events-none fixed inset-x-0 top-0 h-28 bg-gradient-to-b from-white/[0.07] to-transparent" />

            <div className="mx-auto flex h-full max-h-[calc(100dvh-2rem)] max-w-[104rem] flex-col gap-3">
              <div className="relative z-[96] overflow-hidden rounded-3xl border border-white/12 bg-black/58 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-red-400/70 via-cyan-200/70 to-transparent" />
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-300">
                      Fiora manga reader
                    </p>
                    <div className="mt-1 flex flex-wrap items-end gap-x-4 gap-y-1">
                      <h2 className="text-2xl font-black uppercase tracking-[0.04em] md:text-3xl">
                        Just for my pleasure
                      </h2>
                      <p className="pb-1 text-xs font-black uppercase tracking-[0.18em] text-white/48">
                        {viewMode === "double"
                          ? previewTitle
                          : `Page ${activePageIndex + 1} / ${MANGA_PAGES.length}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={previousMangaPage}
                      className="inline-flex min-w-[7.25rem] items-center justify-center gap-2.5 rounded-[1.15rem] border border-white/24 bg-white/[0.065] px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/82 shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:border-red-200/65 hover:bg-red-500/14 hover:text-red-50 md:min-w-[8.5rem] md:px-5 md:py-3.5 md:text-xs"
                      aria-label="Previous manga page"
                    >
                      <SkipBack className="h-5 w-5" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextMangaPage}
                      className="inline-flex min-w-[7.25rem] items-center justify-center gap-2.5 rounded-[1.15rem] border border-red-200/65 bg-red-500/18 px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-red-50 shadow-[0_12px_34px_rgba(0,0,0,0.32),0_0_28px_rgba(255,0,72,0.25)] transition hover:-translate-y-0.5 hover:border-white/80 hover:bg-red-500/26 md:min-w-[8.5rem] md:px-5 md:py-3.5 md:text-xs"
                      aria-label="Next manga page"
                    >
                      Next
                      <SkipForward className="h-5 w-5" />
                    </button>
                    <span className="rounded-2xl border border-white/12 bg-white/[0.055] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">
                      {activeTrack.title}
                    </span>
                    <span className="rounded-2xl border border-red-300/25 bg-red-500/12 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-red-100">
                      {Math.round(zoom * 100)}% zoom
                    </span>
                    <button
                      type="button"
                      onClick={close}
                      className="rounded-2xl border border-white/15 bg-black/55 p-3 text-white/88 transition hover:border-red-400/50 hover:text-red-100"
                      aria-label="Close manga pages"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 via-red-200 to-cyan-200 shadow-[0_0_18px_rgba(255,70,110,0.55)]"
                    style={{ width: viewMode === "double" ? "100%" : `${readerProgress}%` }}
                  />
                </div>
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[17rem_minmax(0,1fr)]">
              <aside className="flex max-h-[34dvh] min-h-0 shrink-0 flex-col overflow-hidden rounded-3xl border border-red-500/24 bg-[rgba(12,5,8,0.72)] p-3 text-white shadow-[0_0_32px_rgba(255,0,60,0.16)] backdrop-blur-2xl lg:max-h-none">
                <div className="rounded-2xl border border-white/10 bg-black/24 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-300">
                    Manga board
                  </p>
                  <h2 className="mt-1 text-xl font-black uppercase tracking-[0.04em] text-white">
                    {viewMode === "double"
                      ? previewTitle
                      : `Page ${activePageIndex + 1}`}
                  </h2>
                  <p className="mt-2 inline-flex rounded-2xl border border-red-400/25 bg-red-500/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-red-100">
                    {pageCountLabel}
                  </p>
                </div>

                <div className="mt-3 space-y-2.5 rounded-2xl border border-white/10 bg-black/24 p-2.5">
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

                <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/24 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300">
                      Pages
                    </p>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/55">
                      {viewMode === "single"
                        ? `${activePageIndex + 1}/${MANGA_PAGES.length}`
                        : "All"}
                    </span>
                  </div>
                  <div className="manga-page-scroll min-h-0 overflow-y-auto pr-1">
                    <div className="grid grid-cols-5 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setViewMode("double")}
                      className={cn(
                        "col-span-5 inline-flex h-9 items-center justify-center gap-1.5 rounded-2xl border px-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition",
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
                        aria-current={
                          viewMode === "single" && activePageIndex === index
                            ? "page"
                            : undefined
                        }
                        className={cn(
                          "inline-flex h-8 items-center justify-center gap-1 rounded-xl border px-1 text-[9px] font-black uppercase tracking-[0.08em] transition",
                          viewMode === "single" && activePageIndex === index
                            ? "border-red-400/45 bg-red-500/16 text-red-100"
                            : "border-white/12 bg-white/[0.04] text-white/68 hover:text-white"
                        )}
                      >
                        <PanelTopOpen className="h-3 w-3" />
                        {index + 1}
                      </button>
                    ))}
                    </div>
                  </div>
                </div>
              </aside>

              <div className="relative min-h-0 flex-1 overflow-auto rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.075),transparent_24%),rgba(0,0,0,0.48)] p-3 shadow-[inset_0_0_44px_rgba(255,255,255,0.035)] md:p-4">
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
                          loading={
                            viewMode === "single" || realIndex < 2
                              ? "eager"
                              : "lazy"
                          }
                          decoding="async"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
