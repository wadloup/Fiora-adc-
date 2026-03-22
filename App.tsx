import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Menu,
  Music2,
  Pause,
  Search,
  Sword,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

const pages = [
  "Home",
  "Why Fiora ADC Works",
  "Runes",
  "Build",
  "Skill Order",
  "Matchups",
  "Lane Phase",
  "Fiora's Support",
  "Mid/Late Game",
  "Mechanical Tips",
  "Videos / Clips",
] as const;
type PageName = (typeof pages)[number];

const MUSIC_URL = "/audio/come-home-sped-up.mp3";

const subtitles: Record<PageName, string> = {
  Home: "Guide agressif, clair et lisible en draft.",
  "Why Fiora ADC Works": "Le pick marche quand il est joue avec structure.",
  Runes: "Deux pages selon lane et objectif.",
  Build: "Core fixe puis adaptation.",
  "Skill Order": "Ordre simple et fiable.",
  Matchups: "Tendances, pas verites absolues.",
  "Lane Phase": "Lecture complete sans gros pavÃ©s illisibles.",
  "Fiora's Support": "Le role support explique concretement.",
  "Mid/Late Game": "Convertir la lane en pression map.",
  "Mechanical Tips": "Rappels rapides avant queue.",
  "Videos / Clips": "Zone clips et exemples.",
};

const speechByPage: Record<PageName, string> = {
  Home: "Bienvenue dans le labo Fiora ADC. Objectif: plan clair, agressif, et lane propre.",
  "Why Fiora ADC Works":
    "Fiora ADC punit le spacing et les mauvais timings ennemis. Ce n'est pas random, c'est execution.",
  Runes: "PTA pour burst court. Phase Rush pour reach et reset propre.",
  Build: "Tiamat puis Hydre vorace, puis route snowball, stable ou safe selon la game.",
  "Skill Order": "Q niveau 1, E niveau 2, W niveau 3 pour controler la lane.",
  Matchups: "Les labels sont des tendances. Le premier lead change beaucoup.",
  "Lane Phase": "HP management, bushes, vision, puis all-in total sur la bonne fenetre.",
  "Fiora's Support": "Support de Fiora: cree l'acces, protege l'entree, et joue les timings ensemble.",
  "Mid/Late Game": "Choisis un plan et execute-le: split, flank, pick ou group.",
  "Mechanical Tips": "La mecanique, c'est timing, angle, et decision.",
  "Videos / Clips": "Les clips servent a apprendre les decisions, pas juste montrer des kills.",
};

const art: Record<PageName, { image: string; position: string }> = {
  Home: { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_8.jpg", position: "center 26%" },
  "Why Fiora ADC Works": { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg", position: "center 24%" },
  Runes: { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg", position: "center 24%" },
  Build: { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_3.jpg", position: "center 24%" },
  "Skill Order": { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_1.jpg", position: "center 24%" },
  Matchups: { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_6.jpg", position: "center 24%" },
  "Lane Phase": { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_7.jpg", position: "center 24%" },
  "Fiora's Support": { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg", position: "center 24%" },
  "Mid/Late Game": { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_0.jpg", position: "center 24%" },
  "Mechanical Tips": { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_9.jpg", position: "center 24%" },
  "Videos / Clips": { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_10.jpg", position: "center 24%" },
};

const runesPTA = [
  "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png",
  "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Triumph/Triumph.png",
  "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png",
  "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LastStand/LastStand.png",
];
const runesPhase = [
  "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png",
  "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/NimbusCloak/6361.png",
  "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png",
  "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png",
];

const item = {
  tiamat: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/item-icons/3077.png",
  hydra: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/item-icons/3074.png",
  cyclo: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/item-icons/6699.png",
  tri: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/item-icons/3078.png",
  eclipse: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/item-icons/6692.png",
};

const matchups = [
  ["Jhin", "Favorable", "Medium", "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Jhin_0.jpg"],
  ["Jinx", "Favorable", "Medium", "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Jinx_0.jpg"],
  ["Kai'Sa", "Playable", "Medium", "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Kaisa_0.jpg"],
  ["Ashe", "Difficult", "High", "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Ashe_0.jpg"],
  ["Draven", "Difficult", "High", "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Draven_0.jpg"],
  ["Caitlyn", "Difficult", "High", "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Caitlyn_0.jpg"],
] as const;

const lane = [
  {
    id: "early",
    title: "Early Lane",
    lines: [
      "Q niveau 1, E niveau 2 avec PTA peut surprendre fort si vous prenez le level 2 d'abord.",
      "Niveau 3, Riposte te donne beaucoup plus de securite si tu lis bien le CC cle.",
      "Ne perds pas du HP gratuitement contre double range.",
    ],
  },
  {
    id: "wave",
    title: "Wave / Bush",
    lines: [
      "Les bushes sans vision te donnent les meilleurs angles d'engage.",
      "Bruler un flash adverse ouvre un timing gank enorme.",
      "Ward control avant all-in.",
    ],
  },
  {
    id: "support",
    title: "Support Sync",
    lines: [
      "Engage/hook supports sont premium avec Fiora ADC.",
      "Apres Hydre vorace, pression repetee plus facile grace au sustain.",
      "Protective supports restent viables si plan = survive puis spike.",
    ],
  },
] as const;

const supportClips = [
  {
    title: "Support Clip 1",
    embed: "https://www.youtube.com/embed/ck-PQSpfRDY",
    url: "https://youtu.be/ck-PQSpfRDY",
  },
  {
    title: "Support Clip 2",
    embed: "https://www.youtube.com/embed/sTytoEHfY9w",
    url: "https://youtu.be/sTytoEHfY9w",
  },
  {
    title: "Support Clip 3",
    embed: "https://www.youtube.com/embed/4ASFCDwcHco",
    url: "https://youtu.be/4ASFCDwcHco",
  },
  {
    title: "Support Clip 4",
    embed: "https://www.youtube.com/embed/rNob-ZD26Xs",
    url: "https://youtu.be/rNob-ZD26Xs",
  },
] as const;

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-3xl border border-red-500/25 bg-white/[0.04] p-5 shadow-[0_0_24px_rgba(255,0,60,0.12)]", className)}>
      {children}
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.22);
  const [musicUnlocked, setMusicUnlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [voiceUnlocked, setVoiceUnlocked] = useState(false);
  const [autoVoice, setAutoVoice] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [visibleSpeech, setVisibleSpeech] = useState(speechByPage.Home);
  const tickerRef = useRef<number | null>(null);

  const filteredPages = useMemo(
    () => (query.trim() ? pages.filter((p) => p.toLowerCase().includes(query.toLowerCase())) : pages),
    [query]
  );

  const clearTicker = useCallback(() => {
    if (tickerRef.current) {
      window.clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    clearTicker();
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
    setVisibleSpeech(speechByPage[currentPage]);
  }, [clearTicker, currentPage]);

  const startSpeaking = useCallback(async () => {
    if (!voiceUnlocked) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const text = speechByPage[currentPage];
    stopSpeaking();
    setVisibleSpeech("");

    const u = new SpeechSynthesisUtterance(text);
    const all = window.speechSynthesis.getVoices();
    const chosen = all.find((v) => v.voiceURI === selectedVoice) || all.find((v) => v.lang.toLowerCase().startsWith("fr")) || all[0];
    if (chosen) {
      u.voice = chosen;
      u.lang = chosen.lang;
    }
    setSpeaking(true);

    let i = 0;
    tickerRef.current = window.setInterval(() => {
      i += 2;
      setVisibleSpeech(text.slice(0, i));
      if (i >= text.length) clearTicker();
    }, 16);

    u.onend = () => {
      clearTicker();
      setSpeaking(false);
      setVisibleSpeech(text);
    };
    u.onerror = () => {
      clearTicker();
      setSpeaking(false);
      setVisibleSpeech(text);
    };
    window.speechSynthesis.speak(u);
  }, [voiceUnlocked, currentPage, selectedVoice, stopSpeaking, clearTicker]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);
      if (!selectedVoice && list.length) setSelectedVoice((list.find((v) => v.lang.startsWith("fr")) || list[0]).voiceURI);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      stopSpeaking();
    };
  }, [selectedVoice, stopSpeaking]);

  useEffect(() => {
    setVisibleSpeech(speechByPage[currentPage]);
    if (autoVoice && voiceUnlocked) {
      const t = window.setTimeout(() => void startSpeaking(), 220);
      return () => window.clearTimeout(t);
    }
  }, [currentPage, autoVoice, voiceUnlocked, startSpeaking]);

  const playMusic = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.muted = false;
      audioRef.current.volume = musicVolume;
      await audioRef.current.play();
      setMusicPlaying(true);
      setMusicBlocked(false);
    } catch {
      setMusicPlaying(false);
      setMusicBlocked(true);
    }
  }, [musicVolume]);

  const pauseMusic = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setMusicPlaying(false);
  }, []);

  const toggleMusic = useCallback(async () => {
    if (!musicUnlocked) setMusicUnlocked(true);
    if (musicPlaying) pauseMusic();
    else await playMusic();
  }, [musicPlaying, pauseMusic, playMusic, musicUnlocked]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = musicVolume;
  }, [musicVolume]);

  useEffect(() => {
    const removeListeners = () => {
      window.removeEventListener("mousemove", onInteract);
      window.removeEventListener("click", onInteract);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("wheel", onInteract);
      window.removeEventListener("scroll", onInteract);
    };

    const onInteract = async () => {
      removeListeners();
      setMusicUnlocked(true);
      const audio = audioRef.current;
      if (!audio) return;
      audio.muted = false;
      audio.volume = musicVolume;
      try {
        if (audio.paused) await audio.play();
        setMusicPlaying(true);
        setMusicBlocked(false);
      } catch {
        setMusicPlaying(false);
        setMusicBlocked(true);
      }
    };

    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener("mousemove", onInteract, opts);
    window.addEventListener("click", onInteract, opts);
    window.addEventListener("pointerdown", onInteract, opts);
    window.addEventListener("keydown", onInteract);
    window.addEventListener("touchstart", onInteract, opts);
    window.addEventListener("wheel", onInteract, opts);
    window.addEventListener("scroll", onInteract, opts);

    return removeListeners;
  }, [musicVolume]);

  const goPage = (p: PageName) => {
    setCurrentPage(p);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <audio
        ref={audioRef}
        src={MUSIC_URL}
        autoPlay
        muted={!musicUnlocked}
        loop
        preload="auto"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,60,0.15),transparent_34%),linear-gradient(to_bottom,#040404,#0b0b0b,#040404)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3"><Sword className="h-5 w-5 text-red-400" /><p className="text-sm font-black">Fiora ADC</p></div>
          <nav className="hidden items-center gap-2 xl:flex">{pages.map((p) => <button key={p} onClick={() => goPage(p)} className={cn("rounded-xl px-3 py-2 text-sm", currentPage===p?"bg-red-500/15 text-red-300":"text-white/75 hover:bg-white/5")}>{p}</button>)}</nav>
          <div className="hidden items-center gap-2 xl:flex">
            <button onClick={() => void toggleMusic()} className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs">{musicPlaying ? <Pause className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}</button>
            <input type="range" min="0" max="0.5" step="0.01" value={musicVolume} onChange={(e) => setMusicVolume(Number(e.target.value))} className="w-24" />
          </div>
          <button className="rounded-xl border border-red-500/30 p-2 xl:hidden" onClick={() => setMobileOpen((v) => !v)}>{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
        {mobileOpen && <div className="border-t border-white/10 bg-black/85 p-3 xl:hidden">{pages.map((p) => <button key={p} onClick={() => goPage(p)} className="mb-2 block w-full rounded-xl bg-white/5 px-3 py-2 text-left">{p}</button>)}</div>}
      </header>

      <main className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6">
        <Card className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-3xl font-black md:text-5xl">{currentPage === "Home" ? <>Fiora ADC, propre et agressif.<span className="block text-red-400">No more boring toplane.</span></> : currentPage}</h1>
            <div className="w-full lg:w-80"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-300" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search section" className="w-full rounded-2xl border border-red-500/25 bg-black/40 py-3 pl-10 pr-4" /></div>{query && <div className="mt-2 flex flex-wrap gap-2">{filteredPages.map((p) => <button key={p} onClick={() => goPage(p)} className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-1 text-xs">{p}</button>)}</div>}</div>
          </div>
        </Card>

        {musicBlocked && <Card><p className="text-sm text-white/75">Autoplay bloque. <button onClick={() => void playMusic()} className="text-red-300 underline">Clique ici pour activer la musique</button>.</p></Card>}
        {!voiceUnlocked && <Card><button onClick={() => { setVoiceUnlocked(true); void startSpeaking(); }} className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm">Activer la voix de Fiora</button></Card>}

        {currentPage === "Home" && (
          <Card className="overflow-hidden p-0">
            <div className="relative min-h-[300px] overflow-hidden">
              <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_8.jpg" alt="support cta" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "center 26%" }} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent" />
              <div className="relative z-10 p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.25em] text-red-300">Draft priority</p>
                <h2 className="mt-3 text-3xl font-black md:text-5xl">ARE YOU THE SUPPORT?</h2>
                <p className="mt-3 max-w-2xl text-white/75">Lis d'abord la section support et lane phase pour la sync duo.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={() => goPage("Fiora's Support")} className="rounded-xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm">Go to Fiora's Support</button>
                  <button onClick={() => goPage("Lane Phase")} className="rounded-xl border border-white/25 bg-black/40 px-4 py-2 text-sm">Open Lane Phase</button>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card className="overflow-hidden p-0">
          <div className="grid lg:grid-cols-[280px_1fr]">
            <div className="relative min-h-[260px] overflow-hidden">
              <motion.img key={art[currentPage].image} src={art[currentPage].image} alt="fiora" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: art[currentPage].position }} animate={{ y: speaking ? [0, -4, 0] : [0, -1, 0] }} transition={{ repeat: Infinity, duration: speaking ? 1.2 : 2.8 }} />
            </div>
            <div className="space-y-3 p-5 md:p-6">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => void startSpeaking()} className="rounded-full border border-red-500/30 px-3 py-1 text-xs"><Volume2 className="mr-1 inline h-3 w-3" />Speak</button>
                <button onClick={stopSpeaking} className="rounded-full border border-red-500/30 px-3 py-1 text-xs"><VolumeX className="mr-1 inline h-3 w-3" />Stop</button>
                <button onClick={() => setAutoVoice((v) => !v)} className="rounded-full border border-red-500/30 px-3 py-1 text-xs">Auto: {autoVoice ? "ON" : "OFF"}</button>
              </div>
              <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="rounded-xl border border-red-500/25 bg-black/45 px-3 py-2 text-sm">{voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}</select>
                <p className="self-center text-xs text-white/60">{subtitles[currentPage]}</p>
              </div>
              <div className="rounded-2xl border border-red-500/25 bg-black/35 p-4 text-white/85">{visibleSpeech}{speaking && <span className="ml-1 text-red-300">â–‹</span>}</div>
            </div>
          </div>
        </Card>

        <AnimatePresence mode="wait">
          <motion.div key={currentPage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-6">
            {currentPage === "Runes" && <div className="grid gap-4 md:grid-cols-2"><Card><p className="mb-3 font-bold text-red-300">PTA PAGE</p><div className="flex flex-wrap gap-2">{runesPTA.map((s) => <img key={s} src={s} alt="rune" className="h-12 w-12 rounded-lg border border-red-500/30" />)}</div><p className="mt-3 text-sm text-white/75">Mini runes: Adaptive Force / Adaptive Force / Heal.</p></Card><Card><p className="mb-3 font-bold text-red-300">PHASE RUSH PAGE</p><div className="flex flex-wrap gap-2">{runesPhase.map((s) => <img key={s} src={s} alt="rune" className="h-12 w-12 rounded-lg border border-red-500/30" />)}</div><p className="mt-3 text-sm text-white/75">Mini runes: Adaptive Force / Attack Speed / Scaling Heal.</p></Card></div>}

            {currentPage === "Build" && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Card><p className="font-bold text-red-300">Core</p><div className="mt-2 flex items-center gap-2"><img src={item.tiamat} className="h-10 w-10 rounded" /><span>-></span><img src={item.hydra} className="h-10 w-10 rounded" /></div><p className="mt-2 text-sm text-white/75">Tiamat puis Hydre vorace.</p></Card><Card><p className="font-bold text-red-300">Snowball</p><div className="mt-2 flex items-center gap-2"><img src={item.hydra} className="h-10 w-10 rounded" /><span>-></span><img src={item.cyclo} className="h-10 w-10 rounded" /></div><p className="mt-2 text-sm text-white/75">Si tu peux tuer vite.</p></Card><Card><p className="font-bold text-red-300">Stable</p><div className="mt-2 flex items-center gap-2"><img src={item.hydra} className="h-10 w-10 rounded" /><span>-></span><img src={item.tri} className="h-10 w-10 rounded" /></div><p className="mt-2 text-sm text-white/75">Si game menacante.</p></Card><Card><p className="font-bold text-red-300">Safe burst</p><div className="mt-2 flex items-center gap-2"><img src={item.hydra} className="h-10 w-10 rounded" /><span>-></span><img src={item.eclipse} className="h-10 w-10 rounded" /></div><p className="mt-2 text-sm text-white/75">Shield + burst plus safe.</p></Card></div>}

            {currentPage === "Matchups" && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{matchups.map(([name, status, danger, image]) => <Card key={name} className="overflow-hidden"><img src={image} alt={name} className="h-40 w-full rounded-2xl border border-red-500/25 object-cover" style={{ objectPosition: "center 22%" }} /><div className="mt-3 flex items-center justify-between"><p className="text-lg font-bold">{name}</p><span className="rounded-full border border-red-500/30 px-2 py-1 text-xs">{danger}</span></div><p className="text-sm text-red-300">{status}</p></Card>)}</div>}

            {currentPage === "Lane Phase" && <div className="space-y-4">{lane.map((s) => <Card key={s.id}><h3 className="text-xl font-black">{s.title}</h3><div className="mt-3 grid gap-3 md:grid-cols-3">{s.lines.map((l) => <div key={l} className="rounded-xl border border-red-500/20 bg-black/35 p-3 text-sm text-white/75">{l}</div>)}</div></Card>)}</div>}

            {currentPage === "Fiora's Support" && <div className="space-y-4"><Card><p className="text-sm text-white/80">Support: lis aussi <button onClick={() => goPage("Lane Phase")} className="text-red-300 underline">Lane Phase</button>.</p></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[["Thresh","https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Thresh_0.jpg","h-72"],["Alistar","https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Alistar_0.jpg","h-68"],["Braum","https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Braum_0.jpg","h-60"],["Yuumi","https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Yuumi_0.jpg","h-48"]].map(([n, i, sz]) => <Card key={n}><img src={i} alt={n} className={cn("w-full rounded-2xl border border-red-500/25 object-cover", String(sz))} style={{ objectPosition: "center 20%" }} /><p className="mt-2 font-bold">{n}</p></Card>)}</div>{supportClips.map((c) => <Card key={c.url}><p className="mb-2 font-bold">{c.title}</p><iframe src={c.embed} title={c.title} className="h-60 w-full rounded-xl border border-red-500/20" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></Card>)}</div>}

            {currentPage === "Skill Order" && <div className="grid gap-4 md:grid-cols-3"><Card><p className="font-bold">Level 1</p><p className="text-sm text-white/75">Q</p></Card><Card><p className="font-bold">Level 2</p><p className="text-sm text-white/75">E</p></Card><Card><p className="font-bold">Level 3</p><p className="text-sm text-white/75">W</p></Card></div>}
            {currentPage === "Why Fiora ADC Works" && <div className="grid gap-4 md:grid-cols-2"><Card><p className="font-bold">Surprise factor</p></Card><Card><p className="font-bold">Duel pressure</p></Card><Card><p className="font-bold">Execution edge</p></Card><Card><p className="font-bold">Snowball</p></Card></div>}
            {currentPage === "Mid/Late Game" && <div className="grid gap-4 md:grid-cols-3"><Card><p className="font-bold">Pick one plan</p></Card><Card><p className="font-bold">Entry timing</p></Card><Card><p className="font-bold">Conversion</p></Card></div>}
            {currentPage === "Mechanical Tips" && <div className="grid gap-4 md:grid-cols-2">{["Spacing","Riposte timing","Commit windows","Vital angle"].map((m) => <Card key={m}><p className="font-bold">{m}</p></Card>)}</div>}
            {currentPage === "Videos / Clips" && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{["Fiora_2","Fiora_5","Fiora_7"].map((n) => <Card key={n}><img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${n}.jpg`} alt={n} className="h-56 w-full rounded-2xl border border-red-500/25 object-cover" style={{ objectPosition: "center 24%" }} /></Card>)}</div>}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-xl border border-red-500/35 bg-black/75 px-3 py-2 xl:hidden">
        <button onClick={() => void toggleMusic()}>{musicPlaying ? <Pause className="h-5 w-5 text-red-300" /> : <Music2 className="h-5 w-5 text-red-300" />}</button>
        <input type="range" min="0" max="0.5" step="0.01" value={musicVolume} onChange={(e) => setMusicVolume(Number(e.target.value))} className="w-20" />
      </div>
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-5 right-5 z-50 rounded-full border border-red-500/40 bg-black/70 p-3 text-red-300" aria-label="Back to top">
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}
```

Si tu veux, je peux aussi te donner une version plus propre formatée (même logique, juste lisibilité).
