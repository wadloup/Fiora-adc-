import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Headphones, Volume2, VolumeX } from "lucide-react";
import { useId } from "react";
import NeonCard from "./ui/NeonCard";
import {
  narrationAudio,
  pageMeta,
  type PageName,
  voiceText,
} from "../data/siteData";
import {
  areVoicesMuted,
  PAUSE_SITE_AUDIO_EVENT,
  RESUME_SITE_AUDIO_EVENT,
  requestSpeakableStop,
  START_NARRATION_EVENT,
  STOP_NARRATION_EVENT,
  VOICE_MUTE_STATE_EVENT,
} from "../utils/audioControl";
import { cn } from "../utils/cn";
import { DEFAULT_CHAMPION_IMAGE, recoverImage } from "../utils/imageFallback";

type NarrationPanelProps = {
  page: PageName;
};

export default function NarrationPanel({ page }: NarrationPanelProps) {
  const config = pageMeta[page];
  const [auto, setAuto] = useState(true);
  const [voicesMuted, setVoicesMuted] = useState(() => areVoicesMuted());
  const [speaking, setSpeaking] = useState(false);
  const [awaitingInteraction, setAwaitingInteraction] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState(0.92);
  const [pitch, setPitch] = useState(0.84);
  const [displayText, setDisplayText] = useState(voiceText[page]);
  const [expanded, setExpanded] = useState(false);
  const tickerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const briefPanelId = useId();
  const pausedByMangaRef = useRef(false);
  const speechPausedByMangaRef = useRef(false);
  const recordedAudioSrc = narrationAudio[page];
  const hasRecordedNarration = Boolean(recordedAudioSrc);

  const stop = useCallback(() => {
    if (tickerRef.current) {
      window.clearInterval(tickerRef.current);
      tickerRef.current = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setAwaitingInteraction(false);
    setSpeaking(false);
    setDisplayText(voiceText[page]);
  }, [page]);

  const speak = useCallback(async (options?: { manual?: boolean }) => {
    const manual = options?.manual ?? false;
    stop();
    requestSpeakableStop();

    const text = voiceText[page];
    if (voicesMuted && !manual) {
      setDisplayText(text);
      setAwaitingInteraction(false);
      return;
    }

    if (recordedAudioSrc) {
      const audio = audioRef.current;
      if (!audio) {
        setDisplayText(text);
        setSpeaking(false);
        return;
      }

      setDisplayText(text);
      setSpeaking(true);
      audio.currentTime = 0;

      try {
        await audio.play();
        setAwaitingInteraction(false);
      } catch {
        if (auto) {
          setAwaitingInteraction(true);
        }
        setSpeaking(false);
      }

      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setDisplayText(text);
      setSpeaking(false);
      return;
    }

    setDisplayText("");

    const utterance = new SpeechSynthesisUtterance(text);
    const availableVoices = window.speechSynthesis.getVoices();
    const chosenVoice = availableVoices.find(
      (voice) => voice.voiceURI === selectedVoice
    );
    const englishVoice = availableVoices.find((voice) =>
      voice.lang.toLowerCase().startsWith("en")
    );

    utterance.voice = chosenVoice || englishVoice || null;
    utterance.lang = (chosenVoice || englishVoice)?.lang || "en-US";
    utterance.rate = rate;
    utterance.pitch = pitch;
    setSpeaking(true);

    let index = 0;
    tickerRef.current = window.setInterval(() => {
      index += 2;
      setDisplayText(text.slice(0, index));
      if (index >= text.length && tickerRef.current) {
        window.clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
    }, 18);

    utterance.onend = () => {
      if (tickerRef.current) {
        window.clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
      setSpeaking(false);
      setDisplayText(text);
    };

    utterance.onerror = () => {
      if (tickerRef.current) {
        window.clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
      setSpeaking(false);
      setDisplayText(text);
    };

    window.speechSynthesis.speak(utterance);
  }, [auto, page, pitch, rate, recordedAudioSrc, selectedVoice, stop, voicesMuted]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return undefined;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      if (!selectedVoice && availableVoices.length) {
        const englishVoice = availableVoices.find((voice) =>
          voice.lang.toLowerCase().startsWith("en")
        );

        setSelectedVoice((englishVoice || availableVoices[0]).voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  useEffect(() => {
    const audio = audioRef.current;

    return () => {
      if (tickerRef.current) {
        window.clearInterval(tickerRef.current);
        tickerRef.current = null;
      }

      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    const stopRequested = () => {
      stop();
    };

    const startRequested = (event: Event) => {
      const customEvent = event as CustomEvent<{ manual?: boolean }>;
      void speak({ manual: customEvent.detail?.manual ?? false });
    };

    const muteStateChanged = (event: Event) => {
      const customEvent = event as CustomEvent<{ muted?: boolean }>;
      setVoicesMuted(Boolean(customEvent.detail?.muted));
    };

    const pauseRequested = () => {
      const audio = audioRef.current;

      if (recordedAudioSrc && audio && !audio.paused && !audio.ended) {
        audio.pause();
        pausedByMangaRef.current = true;
        setSpeaking(false);
        return;
      }

      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        window.speechSynthesis.speaking &&
        !window.speechSynthesis.paused
      ) {
        window.speechSynthesis.pause();
        speechPausedByMangaRef.current = true;
        setSpeaking(false);
      }
    };

    const resumeRequested = () => {
      const audio = audioRef.current;

      if (pausedByMangaRef.current && audio) {
        pausedByMangaRef.current = false;
        setSpeaking(true);
        void audio.play().catch(() => setSpeaking(false));
        return;
      }

      if (
        speechPausedByMangaRef.current &&
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        speechPausedByMangaRef.current = false;
        window.speechSynthesis.resume();
        setSpeaking(true);
      }
    };

    window.addEventListener(STOP_NARRATION_EVENT, stopRequested);
    window.addEventListener(START_NARRATION_EVENT, startRequested as EventListener);
    window.addEventListener(VOICE_MUTE_STATE_EVENT, muteStateChanged as EventListener);
    window.addEventListener(PAUSE_SITE_AUDIO_EVENT, pauseRequested);
    window.addEventListener(RESUME_SITE_AUDIO_EVENT, resumeRequested);

    return () => {
      window.removeEventListener(STOP_NARRATION_EVENT, stopRequested);
      window.removeEventListener(
        START_NARRATION_EVENT,
        startRequested as EventListener
      );
      window.removeEventListener(
        VOICE_MUTE_STATE_EVENT,
        muteStateChanged as EventListener
      );
      window.removeEventListener(PAUSE_SITE_AUDIO_EVENT, pauseRequested);
      window.removeEventListener(RESUME_SITE_AUDIO_EVENT, resumeRequested);
    };
  }, [recordedAudioSrc, speak, stop]);

  useEffect(() => {
    setDisplayText(voiceText[page]);
    setExpanded(false);

    if (!auto) {
      stop();
      return undefined;
    }

    const timer = window.setTimeout(() => {
      void speak();
    }, 240);

    return () => window.clearTimeout(timer);
  }, [auto, page, speak, stop]);

  useEffect(() => {
    if (!awaitingInteraction) {
      return undefined;
    }

    const retryAfterInteraction = () => {
      setAwaitingInteraction(false);
      void speak();
    };

    window.addEventListener("pointerdown", retryAfterInteraction, {
      once: true,
    });
    window.addEventListener("keydown", retryAfterInteraction, {
      once: true,
    });

    return () => {
      window.removeEventListener("pointerdown", retryAfterInteraction);
      window.removeEventListener("keydown", retryAfterInteraction);
    };
  }, [awaitingInteraction, speak]);

  return (
    <NeonCard className="overflow-hidden">
      {recordedAudioSrc ? (
        <audio
          ref={audioRef}
          src={recordedAudioSrc}
          preload="none"
          onEnded={() => setSpeaking(false)}
          onError={() => setSpeaking(false)}
        />
      ) : null}

      <div className="grid min-h-[116px] grid-cols-[92px_minmax(0,1fr)] md:grid-cols-[132px_minmax(0,1fr)]">
        <div className="relative overflow-hidden border-r border-white/10 bg-black/40">
          <motion.img
            key={config.image}
            src={config.image}
            alt={`Fiora ${page}`}
            initial={{ opacity: 0.8, scale: 1.04 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: speaking ? [0, -4, 0, -2, 0] : [0, -1, 0],
            }}
            transition={{
              duration: speaking ? 1.3 : 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => recoverImage(event, DEFAULT_CHAMPION_IMAGE)}
            style={{ objectPosition: config.position || "center 14%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/8 to-transparent" />
          <span
            className={cn(
              "absolute bottom-3 left-3 h-2.5 w-2.5 rounded-full border border-black/40",
              speaking
                ? "bg-red-400 shadow-[0_0_12px_rgba(255,0,60,0.65)]"
                : "bg-white/40"
            )}
          />
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-3 bg-gradient-to-br from-white/[0.025] to-red-500/[0.065] p-3 md:p-4">
          <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-normal">
                <span className="inline-flex items-center gap-1.5 text-red-200">
                  <Headphones className="h-3.5 w-3.5" />
                  Page brief
                </span>
                <span className="text-white/24">/</span>
                <span className="text-white/52">{config.mood}</span>
                <span className={speaking ? "text-red-200" : "text-white/38"}>
                  {speaking ? "Playing" : "Ready"}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/72">
              {config.summary}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void speak({ manual: true })}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-red-400/32 bg-red-500/[0.1] px-3 text-xs font-black uppercase tracking-normal text-red-100 transition hover:border-red-200/55 hover:bg-red-500/[0.17] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/60"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Play</span>
              </button>

              <button
                type="button"
                onClick={stop}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/12 bg-black/35 text-white/68 transition hover:border-white/28 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/60"
                aria-label="Stop page narration"
                title="Stop narration"
              >
                <VolumeX className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setAuto((value) => !value)}
                aria-pressed={auto}
                className={cn(
                  "inline-flex h-9 items-center rounded-md border px-2.5 text-[10px] font-black uppercase tracking-normal transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/60",
                  auto
                    ? "border-red-400/34 bg-red-500/[0.1] text-red-100"
                    : "border-white/12 bg-black/35 text-white/52"
                )}
              >
                Auto {auto ? "on" : "off"}
              </button>

              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                aria-controls={briefPanelId}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-white/14 bg-white/[0.045] px-3 text-xs font-black uppercase tracking-normal text-white/74 transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/60"
              >
                <span>{expanded ? "Hide" : "Open"}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expanded ? "rotate-180" : ""
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            id={briefPanelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/10 bg-black/32"
          >
            <div className="space-y-4 p-4 md:p-5">
              {hasRecordedNarration ? null : (
                <div className="grid gap-4 border-b border-white/10 pb-4 md:grid-cols-3">
                  <label className="flex flex-col gap-2 text-xs text-white/65">
                    Voice
                    <select
                      value={selectedVoice}
                      onChange={(event) => setSelectedVoice(event.target.value)}
                      className="rounded-md border border-red-500/25 bg-black/45 px-3 py-2 text-sm text-white outline-none"
                    >
                      {voices
                        .filter((voice) => voice.lang.toLowerCase().startsWith("en"))
                        .map((voice) => (
                          <option key={voice.voiceURI} value={voice.voiceURI}>
                            {voice.name}
                          </option>
                        ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 text-xs text-white/65">
                    Rate: {rate.toFixed(2)}
                    <input
                      type="range"
                      min="0.75"
                      max="1.05"
                      step="0.01"
                      value={rate}
                      onChange={(event) => setRate(Number(event.target.value))}
                      className="control-slider"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-xs text-white/65">
                    Pitch: {pitch.toFixed(2)}
                    <input
                      type="range"
                      min="0.7"
                      max="1.1"
                      step="0.01"
                      value={pitch}
                      onChange={(event) => setPitch(Number(event.target.value))}
                      className="control-slider"
                    />
                  </label>
                </div>
              )}

              <p className="text-base leading-relaxed text-white md:text-lg">
                {displayText}
                {speaking ? (
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.9 }}
                    className="ml-1 text-red-300"
                  >
                    |
                  </motion.span>
                ) : null}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </NeonCard>
  );
}
