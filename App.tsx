"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Menu,
  Pause,
  Play,
  Search,
  SkipBack,
  SkipForward,
  Sword,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import AnimatedBackground from "./components/AnimatedBackground";
import HomeSupportShowcase from "./components/HomeSupportShowcase";
import MusicPlayer from "./components/MusicPlayer";
import NarrationPanel from "./components/NarrationPanel";
import PageContent from "./components/PageContent";
import ReportVoteBlock from "./components/ReportVoteBlock";
import NeonCard from "./components/ui/NeonCard";
import PageButton from "./components/ui/PageButton";
import {
  homeHeroImage,
  pageSubtitle,
  pages,
  type LaneSectionId,
  type PageName,
} from "./data/siteData";
import {
  defaultMusicTrackId,
  musicThemeMap,
  musicThemes,
  type MusicTrackId,
} from "./data/musicThemes";
import { recoverImage } from "./utils/imageFallback";
import { cn } from "./utils/cn";
import { trackGuidePageViewed } from "./utils/analytics";
import { requestAllVoiceStop } from "./utils/audioControl";
import { logVisitorPageView } from "./utils/visitLogger";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const laneRefs = useRef<Partial<Record<LaneSectionId, HTMLDivElement | null>>>(
    {}
  );

  const [selectedTrackId, setSelectedTrackId] =
    useState<MusicTrackId>(defaultMusicTrackId);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.06);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resumeOnTrackChangeRef = useRef(false);
  const musicVolumeRef = useRef(0.06);

  const currentTrack = musicThemeMap[selectedTrackId];
  const currentTrackIndex = musicThemes.findIndex(
    (track) => track.id === selectedTrackId
  );

  const filteredPages = useMemo(() => {
    if (!query.trim()) {
      return pages;
    }

    return pages.filter((page) =>
      page.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const playBackgroundMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    try {
      audio.volume = musicVolumeRef.current;
      audio.muted = false;
      await audio.play();
      setMusicPlaying(true);
      setMusicBlocked(false);
    } catch {
      setMusicPlaying(false);
      setMusicBlocked(true);
    }
  }, []);

  const pauseBackgroundMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.pause();
    setMusicPlaying(false);
  }, []);

  const toggleBackgroundMusic = useCallback(async () => {
    if (musicPlaying) {
      pauseBackgroundMusic();
      return;
    }

    await playBackgroundMusic();
  }, [musicPlaying, pauseBackgroundMusic, playBackgroundMusic]);

  const changeTrack = useCallback(
    (trackId: MusicTrackId) => {
      resumeOnTrackChangeRef.current = musicPlaying;
      setSelectedTrackId(trackId);
      setMusicBlocked(false);
    },
    [musicPlaying]
  );

  const goToPreviousTrack = useCallback(() => {
    const previousIndex =
      currentTrackIndex <= 0 ? musicThemes.length - 1 : currentTrackIndex - 1;
    changeTrack(musicThemes[previousIndex].id);
  }, [changeTrack, currentTrackIndex]);

  const goToNextTrack = useCallback(() => {
    const nextIndex =
      currentTrackIndex >= musicThemes.length - 1 ? 0 : currentTrackIndex + 1;
    changeTrack(musicThemes[nextIndex].id);
  }, [changeTrack, currentTrackIndex]);

  const handleMusicVolumeChange = useCallback((value: number) => {
    musicVolumeRef.current = value;
    setMusicVolume(value);

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = value;
  }, []);

  useEffect(() => {
    const unlock = () => {
      void playBackgroundMusic();
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [playBackgroundMusic]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.load();

    if (resumeOnTrackChangeRef.current) {
      resumeOnTrackChangeRef.current = false;
      void playBackgroundMusic();
    }
  }, [selectedTrackId, playBackgroundMusic]);

  useEffect(() => {
    trackGuidePageViewed(currentPage);
    logVisitorPageView(currentPage);
  }, [currentPage]);

  const goPage = (page: PageName) => {
    setCurrentPage(page);
    setMobileOpen(false);
    scrollTop();
  };

  const goLaneSection = (id: LaneSectionId) => {
    setCurrentPage("Lane Phase");
    setTimeout(() => {
      laneRefs.current[id]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  const searchBlock = (
    <div
      className={cn(
        "w-full",
        currentPage === "Home" ? "lg:w-[280px] lg:flex-none" : "lg:w-[360px]"
      )}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-300" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search section"
          className="w-full rounded-2xl border border-red-500/25 bg-black/40 py-3 pl-10 pr-4 text-white placeholder:text-white/40"
        />
      </div>
      {query ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {filteredPages.length ? (
            filteredPages.map((page) => (
              <button
                key={page}
                onClick={() => goPage(page)}
                className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-200"
              >
                {page}
              </button>
            ))
          ) : (
            <span className="text-sm text-white/50">Nothing found.</span>
          )}
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        loop
        preload="auto"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
        onCanPlay={() => setMusicBlocked(false)}
        onError={() => {
          setMusicPlaying(false);
          setMusicBlocked(true);
        }}
      />

      <AnimatedBackground theme={currentTrack} />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-6">
          <div className="flex shrink-0 items-center gap-3">
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-2 shadow-[0_0_18px_rgba(255,0,60,0.22)]">
              <Sword className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="whitespace-nowrap text-sm font-black uppercase tracking-[0.18em]">
                Fiora ADC
              </p>
              <p className="whitespace-nowrap text-xs text-white/55">
                Bot lane heresy
              </p>
            </div>
          </div>

          <nav className="hide-scrollbar hidden min-w-0 flex-1 overflow-x-auto xl:block">
            <div className="flex w-max min-w-full items-center justify-center gap-2 whitespace-nowrap">
              {pages.map((page) => (
                <PageButton
                  key={page}
                  label={page}
                  active={currentPage === page}
                  onClick={() => goPage(page)}
                />
              ))}
            </div>
          </nav>

          <button
            className="rounded-xl border border-red-500/30 p-2 xl:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/10 xl:hidden"
            >
              <div className="flex flex-col gap-2 bg-black/85 px-4 pb-4 pt-3">
                {pages.map((page) => (
                  <button
                    key={page}
                    onClick={() => goPage(page)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-left",
                      currentPage === page
                        ? "bg-red-500/15 text-red-300"
                        : "bg-white/5 text-white/80"
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl space-y-7 px-4 py-7 md:px-6 md:py-10">
        {musicBlocked ? (
          <NeonCard className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Music needs one click to start
                </p>
                <p className="text-sm text-white/65">
                  Autoplay was blocked by the browser. Current track:
                  <span className="ml-1 text-red-300">{currentTrack.label}</span>
                  <span className="ml-2 text-white/40">{currentTrack.src}</span>
                </p>
              </div>
              <button
                onClick={() => void playBackgroundMusic()}
                className="rounded-2xl border border-red-400/40 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200"
              >
                Start music
              </button>
            </div>
          </NeonCard>
        ) : null}

        <NeonCard noBlur className="p-4 md:p-5 lg:p-6">
          {currentPage === "Home" ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-red-300 md:text-xs">
                    Draft read
                  </p>
                  <h1 className="mt-2 max-w-[16ch] text-2xl font-black leading-tight md:max-w-none md:text-[2.1rem]">
                    <>
                      Fiora ADC. No autopilot, no free lane.
                      <span className="flex items-center gap-2 text-red-400">
                        SUPPORT CHECK BELOW
                        <ArrowDown className="h-7 w-7 text-white/80" />
                      </span>
                    </>
                  </h1>
                </div>

                {searchBlock}
              </div>

              <div className="grid gap-3 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start">
                <div className="min-w-0">
                  <ReportVoteBlock compact />
                </div>
                <MusicPlayer
                  className="hidden lg:flex lg:w-full lg:max-w-none"
                  tracks={musicThemes}
                  currentTrackId={selectedTrackId}
                  musicPlaying={musicPlaying}
                  musicVolume={musicVolume}
                  onToggle={() => void toggleBackgroundMusic()}
                  onTrackChange={changeTrack}
                  onVolumeChange={handleMusicVolumeChange}
                  onPrevious={goToPreviousTrack}
                  onNext={goToNextTrack}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-red-300 md:text-xs">
                    Draft read
                  </p>
                  <h1 className="mt-2 text-2xl font-black leading-tight md:text-[2.1rem]">
                    <>
                      {currentPage}
                      <span className="mt-1 block text-base font-medium text-white/70 md:text-lg">
                        {pageSubtitle[currentPage]}
                      </span>
                    </>
                  </h1>
                </div>
              </div>

              {searchBlock}
            </div>
          )}
        </NeonCard>

        {currentPage === "Home" ? (
          <NeonCard className="overflow-hidden">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[360px] overflow-hidden">
                <img
                  src={homeHeroImage}
                  alt="Aggressive Fiora"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={recoverImage}
                  style={{ objectPosition: "center 26%" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
                  <div className="max-w-3xl rounded-3xl border border-red-500/20 bg-black/35 p-5 backdrop-blur-sm md:p-6">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-300">
                      Draft priority
                    </p>
                    <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl">
                      ARE YOU THE SUPPORT?
                      <br />
                      CLICK HERE BEFORE I REPORT YOU
                    </h2>
                    <p className="mt-4 max-w-2xl text-white/75">
                      If you are the support, start here: engage timing, lane
                      sync, wave pressure, brush control, and the exact moments
                      Fiora can really go in.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <button
                        onClick={() => goPage("Fiora's Support")}
                        className="w-full rounded-2xl border border-red-400/40 bg-red-500/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-red-200 transition hover:scale-[1.02] hover:bg-red-500/20 sm:w-auto"
                      >
                        Go to Fiora's Support
                      </button>
                      <button
                        onClick={() => goLaneSection("support")}
                        className="w-full rounded-2xl border border-white/25 bg-black/45 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/90 transition hover:bg-white/10 sm:w-auto"
                      >
                        Open Lane Phase - Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <HomeSupportShowcase />
            </div>
          </NeonCard>
        ) : null}

        <NarrationPanel page={currentPage} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <PageContent
              currentPage={currentPage}
              laneRefs={laneRefs}
              goLaneSection={goLaneSection}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      <button
        onClick={requestAllVoiceStop}
        className="fixed right-4 top-24 z-[60] inline-flex min-h-[64px] items-center gap-3 rounded-2xl border border-red-400/45 bg-black/85 px-4 py-3 text-left text-white shadow-[0_0_28px_rgba(255,0,60,0.28)] backdrop-blur-xl transition hover:scale-[1.02] hover:bg-red-950/60 sm:right-5 sm:px-5 md:right-6"
        aria-label="Stop every voice"
      >
        <span className="rounded-xl border border-red-400/35 bg-red-500/15 p-2.5 text-red-300">
          <VolumeX className="h-5 w-5" />
        </span>
        <span className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-300">
            Global mute
          </span>
          <span className="text-sm font-black uppercase tracking-[0.08em] sm:text-base">
            Stop all voices
          </span>
        </span>
      </button>

      <div className="fixed right-4 top-[10.35rem] z-[59] hidden w-[280px] rounded-3xl border border-red-500/30 bg-black/85 p-4 shadow-[0_0_28px_rgba(255,0,60,0.22)] backdrop-blur-xl lg:block sm:right-5 md:right-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-red-300">
              Music control
            </p>
            <p className="mt-1 truncate text-sm font-bold text-white">
              {currentTrack.label}
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white/55">
            {currentTrackIndex + 1}/{musicThemes.length}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={goToPreviousTrack}
            className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-white/85 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200"
            aria-label="Previous track"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={() => void toggleBackgroundMusic()}
            className="inline-flex items-center justify-center rounded-2xl border border-red-500/35 bg-red-500/12 px-3 py-3 text-red-200 transition hover:bg-red-500/18"
            aria-label={musicPlaying ? "Pause music" : "Play music"}
          >
            {musicPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={goToNextTrack}
            className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-white/85 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200"
            aria-label="Next track"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Volume2 className="h-4 w-4 shrink-0 text-red-300" />
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            value={musicVolume}
            onInput={(event) =>
              handleMusicVolumeChange(
                Number((event.target as HTMLInputElement).value)
              )
            }
            className="music-slider w-full"
            aria-label="Adjust music volume"
          />
        </div>
      </div>

      <MusicPlayer
        tracks={musicThemes}
        currentTrackId={selectedTrackId}
        musicPlaying={musicPlaying}
        musicVolume={musicVolume}
        onToggle={() => void toggleBackgroundMusic()}
        onTrackChange={changeTrack}
        onVolumeChange={handleMusicVolumeChange}
        onPrevious={goToPreviousTrack}
        onNext={goToNextTrack}
        mobile
      />

      <button
        onClick={scrollTop}
        className="fixed bottom-5 right-5 z-50 rounded-full border border-red-500/40 bg-black/70 p-3 text-red-300 shadow-[0_0_18px_rgba(255,0,60,0.25)]"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <Analytics />
    </div>
  );
}

