import type { ReactNode } from "react";
import { useEffect, useId, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import NeonCard from "./NeonCard";
import { cn } from "../../utils/cn";

const ACTIVE_SPEAKABLE_EVENT = "fiora-speakable-change";
let activeSpeakableId: string | null = null;

function emitActiveSpeakable(id: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(ACTIVE_SPEAKABLE_EVENT, { detail: { id } })
  );
}

function stopSpeakable() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  activeSpeakableId = null;
  emitActiveSpeakable(null);
}

type SpeakableCardProps = {
  text: string;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export default function SpeakableCard({
  text,
  className,
  contentClassName,
  children,
}: SpeakableCardProps) {
  const speakableId = useId();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const updateActiveState = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string | null }>;
      setActive(customEvent.detail?.id === speakableId);
    };

    window.addEventListener(ACTIVE_SPEAKABLE_EVENT, updateActiveState as EventListener);

    return () => {
      window.removeEventListener(
        ACTIVE_SPEAKABLE_EVENT,
        updateActiveState as EventListener
      );

      if (activeSpeakableId === speakableId) {
        stopSpeakable();
      }
    };
  }, [speakableId]);

  const handleSpeak = () => {
    if (!text.trim()) {
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (activeSpeakableId === speakableId) {
      stopSpeakable();
      return;
    }

    stopSpeakable();

    const utterance = new SpeechSynthesisUtterance(text);
    const availableVoices = window.speechSynthesis.getVoices();
    const englishVoice = availableVoices.find((voice) =>
      voice.lang.toLowerCase().startsWith("en")
    );

    utterance.voice = englishVoice || null;
    utterance.lang = englishVoice?.lang || "en-US";
    utterance.rate = 0.94;
    utterance.pitch = 0.92;

    activeSpeakableId = speakableId;
    emitActiveSpeakable(speakableId);

    utterance.onend = () => {
      if (activeSpeakableId === speakableId) {
        activeSpeakableId = null;
        emitActiveSpeakable(null);
      }
    };

    utterance.onerror = () => {
      if (activeSpeakableId === speakableId) {
        activeSpeakableId = null;
        emitActiveSpeakable(null);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <NeonCard
      className={cn(
        "relative transition",
        active
          ? "border-red-400/45 shadow-[0_0_28px_rgba(255,0,60,0.2)]"
          : "hover:border-red-500/35",
        className
      )}
    >
      <button
        type="button"
        onClick={handleSpeak}
        className="block h-full w-full rounded-[inherit] bg-transparent text-left"
      >
        <span className="pointer-events-none absolute right-3 top-3 inline-flex rounded-full border border-red-500/25 bg-black/35 p-1.5 text-red-200">
          {active ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </span>
        <div className={cn("pr-9", contentClassName)}>{children}</div>
      </button>
    </NeonCard>
  );
}
