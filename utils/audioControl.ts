export const ACTIVE_SPEAKABLE_EVENT = "fiora-speakable-change";
export const STOP_NARRATION_EVENT = "fiora-stop-narration";
export const STOP_SPEAKABLE_EVENT = "fiora-stop-speakable";
export const START_NARRATION_EVENT = "fiora-start-narration";
export const VOICE_MUTE_STATE_EVENT = "fiora-voice-mute-state";
export const PAUSE_SITE_AUDIO_EVENT = "fiora-pause-site-audio";
export const RESUME_SITE_AUDIO_EVENT = "fiora-resume-site-audio";

let voicesMuted = false;

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

export function requestNarrationStart() {
  dispatchAudioEvent(START_NARRATION_EVENT, { manual: true });
}

export function requestSiteAudioPause() {
  dispatchAudioEvent(PAUSE_SITE_AUDIO_EVENT);
}

export function requestSiteAudioResume() {
  dispatchAudioEvent(RESUME_SITE_AUDIO_EVENT);
}

export function areVoicesMuted() {
  return voicesMuted;
}

export function setVoicesMuted(muted: boolean) {
  voicesMuted = muted;
  dispatchAudioEvent(VOICE_MUTE_STATE_EVENT, { muted });
}

export function requestAllVoiceStop() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  setVoicesMuted(true);
  requestNarrationStop();
  requestSpeakableStop();
}
