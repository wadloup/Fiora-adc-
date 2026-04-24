import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import NeonCard from "./NeonCard";
import { cn } from "../../utils/cn";
import { trackSpeakableBlockPlayed } from "../../utils/analytics";
import {
  ACTIVE_SPEAKABLE_EVENT,
  PAUSE_SITE_AUDIO_EVENT,
  RESUME_SITE_AUDIO_EVENT,
  requestNarrationStop,
  setActiveSpeakable,
  STOP_SPEAKABLE_EVENT,
} from "../../utils/audioControl";

let activeSpeakableId: string | null = null;
let activeRecordedAudio: HTMLAudioElement | null = null;
let activeRecordedAudioPausedByManga = false;
let activeSpeechPausedByManga = false;

function playActivationSound() {
  if (typeof window === "undefined") {
    return;
  }

  type AudioWindow = Window &
    typeof globalThis & {
      webkitAudioContext?: typeof AudioContext;
    };

  const audioWindow = window as AudioWindow;
  const AudioContextCtor =
    audioWindow.AudioContext ?? audioWindow.webkitAudioContext;

  if (!AudioContextCtor) {
    return;
  }

  try {
    const context = new AudioContextCtor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(520, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      760,
      context.currentTime + 0.08
    );

    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.03, context.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.13);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.13);
    oscillator.onended = () => {
      void context.close();
    };
  } catch {
    // Ignore audio feedback failures and keep speech interaction working.
  }
}

function stopSpeakable() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  if (activeRecordedAudio) {
    activeRecordedAudio.pause();
    activeRecordedAudio.currentTime = 0;
    activeRecordedAudio = null;
  }

  activeSpeakableId = null;
  setActiveSpeakable(null);
  activeRecordedAudioPausedByManga = false;
  activeSpeechPausedByManga = false;
}

type SpeakableCardProps = {
  text: string;
  audioSrc?: string;
  analyticsLabel?: string;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export default function SpeakableCard({
  text,
  audioSrc,
  analyticsLabel,
  className,
  contentClassName,
  children,
}: SpeakableCardProps) {
  const speakableId = useId();
  const [active, setActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const updateActiveState = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string | null }>;
      setActive(customEvent.detail?.id === speakableId);
    };

    const stopRequested = () => {
      if (activeSpeakableId === speakableId) {
        stopSpeakable();
      }
    };

    const pauseRequested = () => {
      if (activeSpeakableId !== speakableId) {
        return;
      }

      if (activeRecordedAudio && !activeRecordedAudio.paused) {
        activeRecordedAudio.pause();
        activeRecordedAudioPausedByManga = true;
        return;
      }

      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        window.speechSynthesis.speaking &&
        !window.speechSynthesis.paused
      ) {
        window.speechSynthesis.pause();
        activeSpeechPausedByManga = true;
      }
    };

    const resumeRequested = () => {
      if (activeSpeakableId !== speakableId) {
        return;
      }

      if (activeRecordedAudioPausedByManga && activeRecordedAudio) {
        activeRecordedAudioPausedByManga = false;
        void activeRecordedAudio.play().catch(() => {
          activeRecordedAudio = null;
          activeSpeakableId = null;
          setActiveSpeakable(null);
        });
        return;
      }

      if (
        activeSpeechPausedByManga &&
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        activeSpeechPausedByManga = false;
        window.speechSynthesis.resume();
      }
    };

    window.addEventListener(
      ACTIVE_SPEAKABLE_EVENT,
      updateActiveState as EventListener
    );
    window.addEventListener(STOP_SPEAKABLE_EVENT, stopRequested);
    window.addEventListener(PAUSE_SITE_AUDIO_EVENT, pauseRequested);
    window.addEventListener(RESUME_SITE_AUDIO_EVENT, resumeRequested);

    return () => {
      window.removeEventListener(
        ACTIVE_SPEAKABLE_EVENT,
        updateActiveState as EventListener
      );
      window.removeEventListener(STOP_SPEAKABLE_EVENT, stopRequested);
      window.removeEventListener(PAUSE_SITE_AUDIO_EVENT, pauseRequested);
      window.removeEventListener(RESUME_SITE_AUDIO_EVENT, resumeRequested);

      if (activeSpeakableId === speakableId) {
        stopSpeakable();
      }
    };
  }, [speakableId]);

  const handleSpeak = () => {
    if (!text.trim()) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    if (!audioSrc && !("speechSynthesis" in window)) {
      return;
    }

    if (activeSpeakableId === speakableId) {
      stopSpeakable();
      return;
    }

    stopSpeakable();
    requestNarrationStop();

    activeSpeakableId = speakableId;
    setActiveSpeakable(speakableId);
    playActivationSound();
    trackSpeakableBlockPlayed(
      analyticsLabel || text.split(".")[0] || text.slice(0, 80)
    );

    if (audioSrc && audioRef.current) {
      const audio = audioRef.current;
      activeRecordedAudio = audio;
      audio.currentTime = 0;
      void audio.play().catch(() => {
        if (activeSpeakableId === speakableId) {
          activeSpeakableId = null;
          setActiveSpeakable(null);
          activeRecordedAudio = null;
        }
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const availableVoices = window.speechSynthesis.getVoices();
    const englishVoice = availableVoices.find((voice) =>
      voice.lang.toLowerCase().startsWith("en")
    );

    utterance.voice = englishVoice || null;
    utterance.lang = englishVoice?.lang || "en-US";
    utterance.rate = 0.94;
    utterance.pitch = 0.92;

    utterance.onend = () => {
      if (activeSpeakableId === speakableId) {
        activeSpeakableId = null;
        setActiveSpeakable(null);
      }
    };

    utterance.onerror = () => {
      if (activeSpeakableId === speakableId) {
        activeSpeakableId = null;
        setActiveSpeakable(null);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <NeonCard
      className={cn(
        "relative overflow-hidden transition duration-300",
        active
          ? "border-red-400/55 shadow-[0_0_34px_rgba(255,0,60,0.26)]"
          : "hover:border-red-500/35 hover:shadow-[0_0_18px_rgba(255,0,60,0.12)]",
        className
      )}
    >
      {audioSrc ? (
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="auto"
          onEnded={() => {
            if (activeSpeakableId === speakableId) {
              activeSpeakableId = null;
              setActiveSpeakable(null);
            }
            if (activeRecordedAudio === audioRef.current) {
              activeRecordedAudio = null;
            }
          }}
          onError={() => {
            if (activeSpeakableId === speakableId) {
              activeSpeakableId = null;
              setActiveSpeakable(null);
            }
            if (activeRecordedAudio === audioRef.current) {
              activeRecordedAudio = null;
            }
          }}
        />
      ) : null}
      {active ? (
        <>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,75,110,0.18),transparent_28%),radial-gradient(circle_at_78%_86%,rgba(255,40,90,0.16),transparent_30%)]"
            initial={{ opacity: 0.38, scale: 0.98 }}
            animate={{ opacity: [0.34, 0.7, 0.42], scale: [0.985, 1.012, 0.99] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-3 bottom-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-red-300/90 to-transparent"
            initial={{ opacity: 0.55, scaleX: 0.88 }}
            animate={{ opacity: [0.45, 1, 0.55], scaleX: [0.88, 1.03, 0.9] }}
            transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : null}
      <button
        type="button"
        onClick={handleSpeak}
        aria-pressed={active}
        className={cn(
          "block h-full w-full cursor-pointer rounded-[inherit] bg-transparent text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/70",
          active ? "scale-[1.01]" : ""
        )}
      >
        <motion.span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-3 top-3 inline-flex rounded-full border bg-black/45 p-1.5 text-red-200 backdrop-blur-sm",
            active ? "border-red-400/45" : "border-red-500/25"
          )}
          animate={
            active
              ? {
                  scale: [1, 1.12, 1],
                  boxShadow: [
                    "0 0 0 rgba(255,0,60,0.18)",
                    "0 0 16px rgba(255,0,60,0.28)",
                    "0 0 0 rgba(255,0,60,0.18)",
                  ],
                }
              : {
                  scale: 1,
                  boxShadow: "0 0 0 rgba(255,0,60,0)",
                }
          }
          transition={{
            duration: active ? 0.95 : 0.2,
            repeat: active ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          {active ? (
            <VolumeX className="h-3.5 w-3.5" />
          ) : (
            <Volume2 className="h-3.5 w-3.5" />
          )}
        </motion.span>
        <div className={cn("pr-9", contentClassName)}>{children}</div>
      </button>
    </NeonCard>
  );
}
