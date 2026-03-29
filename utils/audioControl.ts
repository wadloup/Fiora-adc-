export const ACTIVE_SPEAKABLE_EVENT = "fiora-speakable-change";
export const STOP_NARRATION_EVENT = "fiora-stop-narration";
export const STOP_SPEAKABLE_EVENT = "fiora-stop-speakable";

function dispatchAudioEvent(name: string, detail?: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function setActiveSpeakable(id: string | null) {
  dispatchAudioEvent(ACTIVE_SPEAKABLE_EVENT, { id });
}

export function requestNarrationStop() {
  dispatchAudioEvent(STOP_NARRATION_EVENT);
}

export function requestSpeakableStop() {
  dispatchAudioEvent(STOP_SPEAKABLE_EVENT);
}

export function requestAllVoiceStop() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  requestNarrationStop();
  requestSpeakableStop();
}
