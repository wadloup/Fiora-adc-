import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import NeonCard from "./ui/NeonCard";
import {
  narrationAudio,
  pageMeta,
  type PageName,
  voiceText,
} from "../data/siteData";
import {
  requestSpeakableStop,
  STOP_NARRATION_EVENT,
} from "../utils/audioControl";
import { cn } from "../utils/cn";
import { DEFAULT_CHAMPION_IMAGE, recoverImage } from "../utils/imageFallback";

type NarrationPanelProps = {
  page: PageName;
};

export default function NarrationPanel({ page }: NarrationPanelProps) {
  const config = pageMeta[page];
  const [auto, setAuto] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState(0.92);
  const [pitch, setPitch] = useState(0.84);
  const [displayText, setDisplayText] = useState(voiceText[page]);
  const tickerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

    setSpeaking(false);
    setDisplayText(voiceText[page]);
  }, [page]);

  const speak = useCallback(async () => {
    stop();
    requestSpeakableStop();

    const text = voiceText[page];
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
      } catch {
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
  }, [page, pitch, rate, recordedAudioSrc, selectedVoice, stop]);

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
      stop();
    };
  }, [selectedVoice, stop]);

  useEffect(() => {
    const stopRequested = () => {
      stop();
    };

    window.addEventListener(STOP_NARRATION_EVENT, stopRequested);

    return () => {
      window.removeEventListener(STOP_NARRATION_EVENT, stopRequested);
    };
  }, [stop]);

  useEffect(() => {
    setDisplayText(voiceText[page]);

    if (!auto) {
      stop();
      return undefined;
    }

    const timer = window.setTimeout(() => {
      void speak();
    }, 240);

    return () => window.clearTimeout(timer);
  }, [auto, page, speak, stop]);

  return (
    <NeonCard className="overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr]">
        <div className="relative min-h-[280px] overflow-hidden bg-black/40 lg:min-h-[320px]">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs uppercase tracking-[0.25em] text-red-300">
              Fiora
            </p>
            <p className="mt-1 font-semibold text-white">{config.mood}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-white/65">
              <span
                className={cn(
                  "inline-block h-2.5 w-2.5 rounded-full",
                  speaking
                    ? "bg-red-400 shadow-[0_0_12px_rgba(255,0,60,0.55)]"
                    : "bg-white/30"
                )}
              />
              {speaking ? "Narration live" : "Ready"}
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-gradient-to-br from-white/[0.03] to-red-500/[0.08] p-5 md:p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200">
              <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
              Narration
            </div>

            <button
              onClick={() => void speak()}
              className="rounded-full border border-red-500/30 bg-black/40 px-3 py-1.5 text-xs text-white hover:bg-red-500/10"
            >
              <span className="inline-flex items-center gap-2">
                <Volume2 className="h-3.5 w-3.5" />
                Speak
              </span>
            </button>

            <button
              onClick={stop}
              className="rounded-full border border-red-500/30 bg-black/40 px-3 py-1.5 text-xs text-white hover:bg-red-500/10"
            >
              <span className="inline-flex items-center gap-2">
                <VolumeX className="h-3.5 w-3.5" />
                Stop
              </span>
            </button>

            <button
              onClick={() => setAuto((value) => !value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs",
                auto
                  ? "border-red-500/40 bg-red-500/10 text-red-200"
                  : "border-white/15 bg-black/40 text-white"
              )}
            >
              Auto: {auto ? "ON" : "OFF"}
            </button>
          </div>

          {hasRecordedNarration ? null : (
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex flex-col gap-2 text-xs text-white/65">
                Voice
                <select
                  value={selectedVoice}
                  onChange={(event) => setSelectedVoice(event.target.value)}
                  className="rounded-xl border border-red-500/25 bg-black/45 px-3 py-2 text-sm text-white outline-none"
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

          <div className="relative rounded-[28px] border border-red-500/25 bg-black/35 p-5 shadow-[0_0_22px_rgba(255,0,60,0.12)] md:p-6">
            {recordedAudioSrc ? (
              <audio
                ref={audioRef}
                src={recordedAudioSrc}
                preload="auto"
                onEnded={() => setSpeaking(false)}
                onError={() => setSpeaking(false)}
              />
            ) : null}
            <p className="min-h-[132px] text-base leading-relaxed text-white md:text-lg lg:text-xl">
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
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60">
              {config.summary}
            </p>
          </div>
        </div>
      </div>
    </NeonCard>
  );
}
