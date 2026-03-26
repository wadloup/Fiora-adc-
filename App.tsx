"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  ChevronRight,
  Crosshair,
  Flame,
  HeartHandshake,
  Menu,
  Music2,
  Pause,
  PlayCircle,
  Search,
  Shield,
  Sword,
  Target,
  Volume2,
  VolumeX,
  X,
  Zap,
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

const BACKGROUND_MUSIC_URLS = [
  "/audio/come-home-sped-up.mp3",
  "/audio/Jace%20June%20-%20Come%20Home%20(Sped%20Up).mp3",
  "/audio/Jace June - Come Home (Sped Up).mp3",
] as const;

const HERO_CERTIFIED_IMAGE = "/netanyahu.png";

type NarrationEntry = {
  image: string;
  mood: string;
  summary: string;
  position?: string;
};

const pageMeta: Record<PageName, NarrationEntry> = {
  Home: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_0.jpg",
    mood: "Cold confidence",
    summary:
      "If top lane bores you, this guide turns Fiora ADC into a real plan instead of a random troll pick.",
    position: "center 22%",
  },
  "Why Fiora ADC Works": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_1.jpg",
    mood: "Calculated arrogance",
    summary:
      "This page explains why Fiora ADC creates pressure when enemies misjudge spacing, cooldowns, and all-in timing.",
    position: "center 24%",
  },
  Runes: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg",
    mood: "Precision",
    summary:
      "Your rune page changes how the lane starts: immediate burst or stronger mobility and chase comfort.",
    position: "center 24%",
  },
  Build: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_3.jpg",
    mood: "Methodical",
    summary:
      "The build follows the game state. Start with tempo and sustain, then choose burst, stability, or safety.",
    position: "78% center",
  },
  "Skill Order": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg",
    mood: "Discipline",
    summary:
      "Early skill points decide whether lane is only survivable or actually threatening.",
    position: "center 24%",
  },
  Matchups: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg",
    mood: "Analysis",
    summary:
      "Matchups are trends, not destiny. One first lead changes the whole lane dynamic.",
    position: "center 24%",
  },
  "Lane Phase": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg",
    mood: "Aggressive patience",
    summary:
      "Lane phase is about timing, brush control, level spikes, and waiting for one committed opening.",
    position: "62% center",
  },
  "Fiora's Support": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg",
    mood: "In sync",
    summary:
      "Fiora does not need random help. She needs clean access, protected entry, and coordinated timing.",
    position: "58% center",
  },
  "Mid/Late Game": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg",
    mood: "Clear-minded",
    summary:
      "After lane, pick one plan and execute it well: split, flank, pick, or group with intent.",
    position: "56% center",
  },
  "Mechanical Tips": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg",
    mood: "Demanding",
    summary:
      "Mechanics are not only speed. They are angle, timing, discipline, and confidence under pressure.",
    position: "60% center",
  },
  "Videos / Clips": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg",
    mood: "Showy",
    summary:
      "Clips should teach setup and decisions, not just show flashy kills.",
    position: "center 24%",
  },
};

const pageSubtitle: Record<PageName, string> = {
  Home: "Fast draft read with a support-first priority.",
  "Why Fiora ADC Works":
    "Why the pick works when played with structure and intent.",
  Runes: "Two rune pages, two clear purposes.",
  Build: "Core route plus adaptations and finishing logic.",
  "Skill Order": "Early levels and simple baseline progression.",
  Matchups: "Trend-based reading with practical expectations.",
  "Lane Phase": "Key lane information without giant unreadable walls.",
  "Fiora's Support": "What support must actually do for Fiora ADC.",
  "Mid/Late Game": "How to convert lane advantage into game pressure.",
  "Mechanical Tips": "Short execution reminders before queue.",
  "Videos / Clips": "Space for examples, highlights, and teaching clips.",
};

const voiceText: Record<PageName, string> = {
  Home:
    "Welcome to the Fiora ADC lab. This guide is built for players who want a real plan, a carry mindset, and a support-first draft read.",
  "Why Fiora ADC Works":
    "Fiora ADC works because she punishes bad spacing, panicked reactions, and bot lanes that do not understand her real all-in windows.",
  Runes:
    "Runes define your lane identity before the first trade begins. PTA for short burst windows, Phase Rush for mobility, cleaner access, and safer exits.",
  Build:
    "The build is not random. Start with Tiamat and Ravenous Hydra, then choose burst, stability, or defense depending on what the game demands.",
  "Skill Order":
    "Your early levels matter a lot. Q for access, E for burst timing, W for Riposte control and safer commits.",
  Matchups:
    "Treat matchups as trends. A hard lane can become playable if Fiora gets first lead, better tempo, or one strong support engage.",
  "Lane Phase":
    "Lane phase is patience plus violence. Manage HP, control brushes, respect level spikes, then commit completely when the opening is real.",
  "Fiora's Support":
    "Support sync is mandatory. Fiora wants a clean entry, vision support, and protection through the first committed action.",
  "Mid/Late Game":
    "After lane, pick one plan and commit to it. Splitting, flanking, or grouping all work, but random drifting wastes pressure.",
  "Mechanical Tips":
    "Good Fiora mechanics are not just fast fingers. They are calm timing, correct angles, and clean execution under pressure.",
  "Videos / Clips":
    "Use clips to study decisions, spacing, entry timing, and reset windows, not only the highlights.",
};

type Matchup = {
  name: string;
  level: string;
  danger: string;
  image: string;
  position: string;
  explanation: string;
};

const matchups: Matchup[] = [
  {
    name: "Jhin",
    level: "Favorable",
    danger: "Medium",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Jhin_0.jpg",
    position: "center 24%",
    explanation:
      "Punishable if he oversteps and support setup is not clean. Good opening windows if you take initiative.",
  },
  {
    name: "Jinx",
    level: "Favorable",
    danger: "Medium",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Jinx_0.jpg",
    position: "center 24%",
    explanation:
      "No dash means one catch can flip lane control quickly when wave and brush state are favorable.",
  },
  {
    name: "Kai'Sa",
    level: "Playable",
    danger: "Medium",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Kaisa_0.jpg",
    position: "center 22%",
    explanation:
      "Volatile lane. Support timing and first all-in quality matter more than raw labels.",
  },
  {
    name: "Ashe",
    level: "Difficult",
    danger: "High",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Ashe_0.jpg",
    position: "center 22%",
    explanation:
      "The slow breaks lane rhythm. You need cleaner HP discipline and more decisive engages.",
  },
  {
    name: "Draven",
    level: "Difficult",
    danger: "High",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Draven_0.jpg",
    position: "center 20%",
    explanation:
      "If he gets tempo first, the lane becomes very punishing. Every trade needs clear purpose.",
  },
  {
    name: "Caitlyn",
    level: "Difficult",
    danger: "High",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Caitlyn_0.jpg",
    position: "center 20%",
    explanation:
      "Range, traps, and push punish sloppy movement. Respect lane state, then punish overconfidence.",
  },
];

const runeIcons = {
  pta: [
    "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png",
    "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Triumph/Triumph.png",
    "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png",
    "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LastStand/LastStand.png",
    "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png",
    "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/JackOfAllTrades/JackOfAllTrades2.png",
  ],
  phase: [
    "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png",
    "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/NimbusCloak/6361.png",
    "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png",
    "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png",
    "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png",
    "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LastStand/LastStand.png",
  ],
};

const itemIcons = {
  tiamat: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3077.png",
  hydra: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3074.png",
  cyclosword:
    "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/6699.png",
  triforce:
    "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3078.png",
  eclipse:
    "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/6692.png",
  dd: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/6333.png",
  iceborn:
    "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/6662.png",
  maw: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3156.png",
  shojin:
    "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3161.png",
  ga: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3026.png",
  bt: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3072.png",
};

const supportProfiles = [
  {
    name: "Alistar",
    role: "Hard engage",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Alistar_0.jpg",
    position: "center 18%",
    size: "h-72",
    text: "Excellent with Fiora ADC because he gives immediate access to target and creates very clear commit windows.",
  },
  {
    name: "Braum",
    role: "Dive + peel",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Braum_0.jpg",
    position: "center 20%",
    size: "h-64",
    text: "A strong hybrid profile. He protects entry, stabilizes chaos, and still helps you commit when the opening is real.",
  },
  {
    name: "Yuumi",
    role: "Sustain + scaling",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Yuumi_0.jpg",
    position: "center 28%",
    size: "h-52",
    text: "Special case. She gives healing, shielding, chase comfort, and extended pressure patterns once lane becomes survivable.",
  },
] as const;

const supportClips = [
  {
    title: "Support Clip 1",
    description: "Opening timing and first engage window.",
    url: "https://youtu.be/ck-PQSpfRDY",
    embed: "https://www.youtube.com/embed/ck-PQSpfRDY",
  },
  {
    title: "Support Clip 2",
    description: "Follow-up pressure after first trade.",
    url: "https://youtu.be/sTytoEHfY9w",
    embed: "https://www.youtube.com/embed/sTytoEHfY9w",
  },
  {
    title: "Support Clip 3",
    description: "Positioning and setup around engage support.",
    url: "https://youtu.be/4ASFCDwcHco",
    embed: "https://www.youtube.com/embed/4ASFCDwcHco",
  },
  {
    title: "Support Clip 4",
    description: "Dive or cleanup sequence with support sync.",
    url: "https://youtu.be/rNob-ZD26Xs",
    embed: "https://www.youtube.com/embed/rNob-ZD26Xs",
  },
] as const;

const laneSections = [
  {
    id: "early",
    title: "Early Lane",
    summary: "Preserve HP, track spikes, then punish the first real opening.",
    points: [
      "Fiora ADC is short range, so losing HP for free is one of the fastest ways to lose lane control.",
      "Level 2 with Q then E can create surprising kill pressure, especially with PTA and support follow-up.",
      "At level 3, Riposte changes how confidently you can stand your ground if enemy CC has been identified.",
    ],
  },
  {
    id: "wave",
    title: "Wave / Bush Control",
    summary:
      "Vision and brush state often decide whether your all-in is fake or real.",
    points: [
      "Bush control creates hidden engage angles and can force panic spells from the enemy lane.",
      "If enemy Flash is burned, the next longer wave often becomes an excellent jungle punish timing.",
      "Into ranged lanes, preserve HP first and do not convert annoyance into random desperation trades.",
    ],
  },
  {
    id: "support",
    title: "Support Sync",
    summary: "Support timing matters more here than on a standard ADC lane.",
    points: [
      "Engage and hook supports are premium because they create direct target access for Fiora.",
      "After Ravenous Hydra, repeated pressure becomes easier because Fiora can sustain and re-enter more comfortably.",
      "Protective supports still work if the plan is survive lane, hold health, and spike later with cleaner entries.",
    ],
  },
  {
    id: "matchups",
    title: "Matchup Trend",
    summary: "Treat labels as tendencies, not absolute truths.",
    points: [
      "Favorable trends: Jhin, Jinx, Kai'Sa, Lucian, Senna, Sivir, Miss Fortune.",
      "Harder trends: Ashe, Draven, Kog'Maw, Varus, Vayne, Twitch, Caitlyn.",
      "Most lanes become far more playable once Fiora gets first lead, better tempo, or superior support timing.",
    ],
  },
] as const;

const DEFAULT_FIORA_IMAGE =
  "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_0.jpg";
const DEFAULT_RUNE_ICON =
  "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png";
const DEFAULT_ITEM_ICON =
  "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3077.png";

function recoverImage(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallback: string = DEFAULT_FIORA_IMAGE
) {
  const img = event.currentTarget;
  if (img.src !== fallback) {
    img.src = fallback;
  }
}

function recoverAssetImage(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallback: string
) {
  const img = event.currentTarget;
  if (img.src !== fallback) {
    img.src = fallback;
  }
}

const mechanics = [
  {
    title: "Spacing",
    content:
      "Threaten without overcommitting. Good spacing forces panic movement before you even press forward fully.",
  },
  {
    title: "Riposte timing",
    content:
      "Parry the spell that actually decides the fight, not the first animation that looks scary.",
  },
  {
    title: "Burst windows",
    content:
      "Commit when support sync, target access, and lane state all agree. Do not force half-openings.",
  },
  {
    title: "Vital angle",
    content:
      "Use movement to create clean passive angles before full commitment whenever the lane allows it.",
  },
] as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function NeonCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-red-500/25 bg-white/[0.04] backdrop-blur-md shadow-[0_0_24px_rgba(255,0,60,0.12)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-red-200">
        <Icon className="h-4 w-4" />
        Section
      </div>
      <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      <p className="max-w-3xl text-white/70">{subtitle}</p>
    </div>
  );
}

function PageButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3 py-2 text-sm transition",
        active
          ? "border-red-500/40 bg-red-500/15 text-red-300"
          : "border-transparent text-white/75 hover:bg-white/5 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

function StatCard({
  label,
  value,
  text,
}: {
  label: string;
  value: string;
  text: string;
}) {
  return (
    <NeonCard className="p-5">
      <p className="text-sm uppercase tracking-[0.18em] text-red-300">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-white/65">{text}</p>
    </NeonCard>
  );
}

function IconRow({ icons }: { icons: string[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {icons.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt="rune icon"
          className="h-14 w-14 rounded-xl border border-red-500/30 bg-black/50 object-cover"
          onError={(event) => recoverAssetImage(event, DEFAULT_RUNE_ICON)}
        />
      ))}
    </div>
  );
}

function ItemPath({
  title,
  items,
  text,
}: {
  title: string;
  items: string[];
  text: string;
}) {
  return (
    <NeonCard className="p-5">
      <p className="text-sm uppercase tracking-[0.16em] text-red-300">
        {title}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <div key={`${it}-${i}`} className="flex items-center gap-2">
            <img
              src={it}
              alt="item"
              className="h-12 w-12 rounded-lg border border-red-500/30 bg-black/40 object-cover"
              onError={(event) => recoverAssetImage(event, DEFAULT_ITEM_ICON)}
            />
            {i < items.length - 1 ? <span className="text-red-300">→</span> : null}
          </div>
        ))}
      </div>
      <p className="mt-3 text-white/75">{text}</p>
    </NeonCard>
  );
}

function HomeSupportShowcase() {
  const heroSupports = [supportProfiles[0], supportProfiles[1], supportProfiles[2]];

  return (
    <div className="hidden h-full lg:block">
      <div className="flex h-full flex-col justify-between gap-4 p-6 md:p-8">
        <div className="rounded-3xl border border-red-500/25 bg-black/25 p-5 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-red-300">
            AUTO WIN
          </p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-red-200">
            netanyahu certified
          </p>
          <div className="mt-4 flex items-start gap-4">
            <img
              src={HERO_CERTIFIED_IMAGE}
              alt="Certified badge"
              className="h-24 w-24 rounded-2xl border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]"
              onError={(event) => recoverImage(event, DEFAULT_FIORA_IMAGE)}
            />
            <div>
              <p className="text-lg font-black uppercase tracking-[0.08em] text-white">
                Support shell
              </p>
              <p className="mt-3 max-w-[180px] text-sm text-white/65">
                Alistar, Braum, and Yuumi are showcased here as the safest auto-win support core.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {heroSupports.map((support) => (
            <div
              key={support.name}
              className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-black/25 p-3 backdrop-blur-sm"
            >
              <img
                src={support.image}
                alt={support.name}
                className="h-20 w-20 rounded-2xl border border-red-500/25 object-cover"
                onError={(event) => recoverImage(event, DEFAULT_FIORA_IMAGE)}
                style={{ objectPosition: support.position }}
              />
              <div>
                <p className="text-base font-bold text-white">{support.name}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-red-300">
                  {support.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NarrationPanel({ page }: { page: PageName }) {
  const config = pageMeta[page];
  const [auto, setAuto] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState(0.92);
  const [pitch, setPitch] = useState(0.84);
  const [displayText, setDisplayText] = useState(voiceText[page]);
  const tickerRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (tickerRef.current) {
      window.clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    setDisplayText(voiceText[page]);
  }, [page]);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setDisplayText(voiceText[page]);
      setSpeaking(false);
      return;
    }

    stop();
    const text = voiceText[page];
    setDisplayText("");

    const utterance = new SpeechSynthesisUtterance(text);
    const available = window.speechSynthesis.getVoices();
    const chosen = available.find((v) => v.voiceURI === selectedVoice);
    const english = available.find((v) =>
      v.lang.toLowerCase().startsWith("en")
    );

    utterance.voice = chosen || english || null;
    utterance.lang = (chosen || english)?.lang || "en-US";
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
  }, [page, pitch, rate, selectedVoice, stop]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return undefined;
    }

    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);
      if (!selectedVoice && list.length) {
        const english = list.find((v) => v.lang.toLowerCase().startsWith("en"));
        setSelectedVoice((english || list[0]).voiceURI);
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
    setDisplayText(voiceText[page]);
    if (!auto) {
      stop();
      return undefined;
    }
    const timer = window.setTimeout(() => speak(), 240);
    return () => window.clearTimeout(timer);
  }, [auto, page, speak, stop]);

  return (
    <NeonCard className="overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
        <div className="relative min-h-[300px] overflow-hidden bg-black/40">
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
            onError={(event) => recoverImage(event, DEFAULT_FIORA_IMAGE)}
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
              {speaking ? "Fiora is speaking" : "Fiora is waiting"}
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-gradient-to-br from-white/[0.03] to-red-500/[0.08] p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200">
              <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
              Fiora analysis
            </div>
            <button
              onClick={speak}
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
              onClick={() => setAuto((v) => !v)}
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

          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-xs text-white/65">
              Voice
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="rounded-xl border border-red-500/25 bg-black/45 px-3 py-2 text-sm text-white outline-none"
              >
                {voices
                  .filter((v) => v.lang.toLowerCase().startsWith("en"))
                  .map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name}
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
                onChange={(e) => setRate(Number(e.target.value))}
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
                onChange={(e) => setPitch(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="relative rounded-[28px] border border-red-500/25 bg-black/35 p-5 shadow-[0_0_22px_rgba(255,0,60,0.12)] md:p-6">
            <p className="min-h-[120px] text-lg leading-relaxed text-white md:text-xl">
              {displayText}
              {speaking ? (
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9 }}
                  className="ml-1 text-red-300"
                >
                  ▋
                </motion.span>
              ) : null}
            </p>
            <p className="mt-4 text-sm text-white/60">{config.summary}</p>
          </div>
        </div>
      </div>
    </NeonCard>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const laneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.06);
  const [musicSrcIndex, setMusicSrcIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredPages = useMemo(() => {
    if (!query.trim()) return pages;
    return pages.filter((p) => p.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const playBackgroundMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = musicVolume;
      audio.muted = false;
      await audio.play();
      setMusicPlaying(true);
      setMusicBlocked(false);
    } catch {
      setMusicPlaying(false);
      setMusicBlocked(true);
    }
  }, [musicVolume]);

  const pauseBackgroundMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = musicVolume;
  }, [musicVolume]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void playBackgroundMusic();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [playBackgroundMusic]);

  useEffect(() => {
    const unlock = () => {
      void playBackgroundMusic();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, [playBackgroundMusic]);

  useEffect(() => {
    if (musicSrcIndex > 0) {
      void playBackgroundMusic();
    }
  }, [musicSrcIndex, playBackgroundMusic]);

  const goPage = (page: PageName) => {
    setCurrentPage(page);
    setMobileOpen(false);
    scrollTop();
  };

  const goLaneSection = (id: string) => {
    setCurrentPage("Lane Phase");
    setTimeout(() => {
      laneRefs.current[id]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <audio
        ref={audioRef}
        src={BACKGROUND_MUSIC_URLS[musicSrcIndex]}
        loop
        preload="auto"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
        onCanPlay={() => setMusicBlocked(false)}
        onError={() => {
          setMusicPlaying(false);
          setMusicBlocked(true);
          setMusicSrcIndex((i) =>
            i < BACKGROUND_MUSIC_URLS.length - 1 ? i + 1 : i
          );
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,60,0.15),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(255,0,0,0.08),transparent_24%),linear-gradient(to_bottom,#040404,#0b0b0b,#040404)]" />
      <div className="absolute left-1/2 top-0 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-2 shadow-[0_0_18px_rgba(255,0,60,0.22)]">
              <Sword className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em]">
                Fiora ADC
              </p>
              <p className="text-xs text-white/55">Hybrid final version</p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 xl:flex">
            {pages.map((page) => (
              <PageButton
                key={page}
                label={page}
                active={currentPage === page}
                onClick={() => goPage(page)}
              />
            ))}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <button
              onClick={() => void toggleBackgroundMusic()}
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-white transition hover:bg-red-500/15"
            >
              <span className="inline-flex items-center gap-2">
                {musicPlaying ? <Pause className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
                {musicPlaying ? "Music ON" : "Music OFF"}
              </span>
            </button>

            <div className="w-24">
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={musicVolume}
                onChange={(e) => setMusicVolume(Number(e.target.value))}
              />
            </div>
          </div>

          <button
            className="rounded-xl border border-red-500/30 p-2 xl:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
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
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10">
        {musicBlocked && (
          <NeonCard className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Background music was blocked or file not found
                </p>
                <p className="text-sm text-white/65">
                  Click once to start sound. Current source:
                  <span className="ml-1 text-red-300">
                    {BACKGROUND_MUSIC_URLS[musicSrcIndex]}
                  </span>
                </p>
              </div>
              <button
                onClick={() => void playBackgroundMusic()}
                className="rounded-2xl border border-red-400/40 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200"
              >
                Enable music
              </button>
            </div>
          </NeonCard>
        )}

        <NeonCard className="p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-red-300">
                Fiora ADC Guide
              </p>
              <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
                {currentPage === "Home" ? (
                  <>
                    Fiora ADC, structured and aggressive.
                    <span className="block text-red-400">
                      No autopilot gameplay.
                    </span>
                  </>
                ) : (
                  <>
                    {currentPage}
                    <span className="mt-1 block text-base font-medium text-white/70 md:text-lg">
                      {pageSubtitle[currentPage]}
                    </span>
                  </>
                )}
              </h1>
            </div>

            <div className="w-full lg:w-[360px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-300" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search section"
                  className="w-full rounded-2xl border border-red-500/25 bg-black/40 py-3 pl-10 pr-4 text-white placeholder:text-white/40"
                />
              </div>
              {query && (
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
                    <span className="text-sm text-white/50">No result.</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </NeonCard>

        {currentPage === "Home" && (
          <NeonCard className="overflow-hidden">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[360px] overflow-hidden">
                <img
                  src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_8.jpg"
                  alt="Aggressive Fiora"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(event) => recoverImage(event)}
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
                      Support first read: engage timing, lane sync, wave pressure,
                      brush control, and when Fiora can truly commit.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => goPage("Fiora's Support")}
                        className="rounded-2xl border border-red-400/40 bg-red-500/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-red-200 transition hover:scale-[1.02] hover:bg-red-500/20"
                      >
                        Go to Fiora's Support
                      </button>
                      <button
                        onClick={() => goLaneSection("support")}
                        className="rounded-2xl border border-white/25 bg-black/45 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/90 transition hover:bg-white/10"
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
        )}

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
            {currentPage === "Home" && (
              <>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    label="Identity"
                    value="Black / neon red / white"
                    text="Aggressive visual language with strong contrast and draft readability."
                  />
                  <StatCard
                    label="Tone"
                    value="Carry mindset"
                    text="Direct, niche, practical, and built around pressure instead of autopilot."
                  />
                  <StatCard
                    label="Positioning"
                    value="Technical pocket pick"
                    text="Not random troll value. The guide frames it as a real structured strategy."
                  />
                  <StatCard
                    label="Use"
                    value="Fast draft read"
                    text="Support-first entry points make the site useful before lane even starts."
                  />
                </div>

                <NeonCard className="p-6 md:p-8">
                  <SectionTitle
                    icon={Flame}
                    title="Welcome to the Fiora ADC lab"
                    subtitle="This version keeps the strongest personality cues but organizes them like a real final site: cleaner hierarchy, clearer pages, and faster access to what matters in draft."
                  />
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-red-300">Support-first</p>
                      <p className="mt-2 text-white/75">
                        The most important lane partner information is pushed forward immediately.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-red-300">Guide structure</p>
                      <p className="mt-2 text-white/75">
                        Runes, build, lane phase, support, mid-game, mechanics, and video sections all share one visual system.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-red-300">Personality</p>
                      <p className="mt-2 text-white/75">
                        The site still feels like Fiora: sharp, confident, and slightly disrespectful in the right way.
                      </p>
                    </div>
                  </div>
                </NeonCard>
              </>
            )}

            {currentPage === "Why Fiora ADC Works" && (
              <>
                <SectionTitle
                  icon={Target}
                  title="Why Fiora ADC Works"
                  subtitle="Same concept, cleaner presentation: fewer walls of text, more cards that are readable during draft or quick review."
                />

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <NeonCard className="p-6">
                    <div className="mb-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-red-200">
                      Core concept
                    </div>
                    <h3 className="text-2xl font-black text-white md:text-3xl">
                      You win by forcing bad spacing and panic decisions
                    </h3>
                    <p className="mt-4 text-white/75">
                      Fiora ADC is not standard marksman flow. The pick works when you control timing, punish wrong movement, and convert enemy missteps into short, committed all-ins.
                    </p>
                    <p className="mt-4 text-white/75">
                      It is a technical choice, not a universal blind answer. But in the right structure, it creates discomfort that many bot lanes are not prepared to answer correctly.
                    </p>
                  </NeonCard>

                  <NeonCard className="overflow-hidden p-3">
                    <img
                      src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg"
                      alt="Fiora visual"
                      className="h-[260px] w-full rounded-2xl border border-red-500/25 object-cover"
                      onError={(event) => recoverImage(event)}
                      style={{ objectPosition: "center 26%" }}
                    />
                  </NeonCard>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["Surprise factor", "Most bot lanes do not know Fiora ADC limits and overtrade at the wrong moments."],
                    ["Duel pressure", "One clean opening can flip lane state even when the matchup looked uncomfortable on paper."],
                    ["Execution edge", "Riposte timing plus support sync creates disproportionate value off one enemy mistake."],
                    ["Snowball conversion", "First lead gives wave tempo, objective setup, and much freer lane movement."],
                  ].map(([title, text]) => (
                    <NeonCard key={title} className="p-5">
                      <p className="text-lg font-bold text-white">{title}</p>
                      <p className="mt-2 text-white/70">{text}</p>
                    </NeonCard>
                  ))}
                </div>
              </>
            )}

            {currentPage === "Runes" && (
              <>
                <SectionTitle
                  icon={Zap}
                  title="Runes"
                  subtitle="Explained setup choices with icon rows, practical logic, and clean side-by-side comparison."
                />

                <div className="grid gap-4 xl:grid-cols-2">
                  <NeonCard className="space-y-4 p-5">
                    <p className="text-sm uppercase tracking-[0.16em] text-red-300">PTA PAGE</p>
                    <IconRow icons={runeIcons.pta} />
                    <div className="space-y-2 text-white/75">
                      <p><span className="font-semibold text-white">Why PTA:</span> burst profile, short trades, and better punishment against fragile ADCs.</p>
                      <p><span className="font-semibold text-white">Secondary logic:</span> Biscuits and Jack help survive lane and add long-term value in awkward matchups.</p>
                      <p><span className="font-semibold text-white">Mini runes:</span> Adaptive Force, Adaptive Force, Heal.</p>
                    </div>
                  </NeonCard>

                  <NeonCard className="space-y-4 p-5">
                    <p className="text-sm uppercase tracking-[0.16em] text-red-300">PHASE RUSH PAGE</p>
                    <IconRow icons={runeIcons.phase} />
                    <div className="space-y-2 text-white/75">
                      <p><span className="font-semibold text-white">Why Phase Rush:</span> easier gap close, cleaner disengage, and better access against mobile or hard-to-reach lanes.</p>
                      <p><span className="font-semibold text-white">Damage profile:</span> Absolute Focus and Last Stand keep the page threatening at different HP states.</p>
                      <p><span className="font-semibold text-white">Mini runes:</span> Adaptive Force, Attack Speed, Scaling Heal.</p>
                    </div>
                  </NeonCard>
                </div>
              </>
            )}

            {currentPage === "Build" && (
              <>
                <SectionTitle
                  icon={Shield}
                  title="Build"
                  subtitle="Complete routes with icons and explicit conditions, but still quick to scan."
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <ItemPath title="Core route" items={[itemIcons.tiamat, itemIcons.hydra]} text="Rush Tiamat then Ravenous Hydra for lane comfort, sustain, wave control, and faster map tempo." />
                  <ItemPath title="Snowball route" items={[itemIcons.hydra, itemIcons.cyclosword]} text="Take this when you can reach target reliably and kill before getting burst down." />
                  <ItemPath title="Stable route" items={[itemIcons.hydra, itemIcons.triforce]} text="A steadier profile when enemy damage makes pure glass-cannon play too risky." />
                  <ItemPath title="Safe burst route" items={[itemIcons.hydra, itemIcons.eclipse]} text="Shield plus burst when you need safer entries and a less greedy second item." />
                  <ItemPath title="Defensive adaptation" items={[itemIcons.dd, itemIcons.maw, itemIcons.iceborn]} text="DD for heavy AD, Maw for AP threat, Iceborn as a niche durability option." />
                  <ItemPath title="Late finish" items={[itemIcons.shojin, itemIcons.ga, itemIcons.bt]} text="Shojin for pressure, GA for safety, BT for final damage and sustain finish." />
                </div>
              </>
            )}

            {currentPage === "Skill Order" && (
              <>
                <SectionTitle icon={Crosshair} title="Skill Order" subtitle="Current practical baseline with a clearer final-site presentation." />
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ["Level 1", "Q for access, repositioning, and creating your first real angle."],
                    ["Level 2", "E for burst timing, especially when PTA trade windows already look possible."],
                    ["Level 3", "W for Riposte control, CC answer, and far safer commitment."],
                  ].map(([title, text]) => (
                    <NeonCard key={title} className="p-5">
                      <p className="text-lg font-bold text-white">{title}</p>
                      <p className="mt-2 text-white/70">{text}</p>
                    </NeonCard>
                  ))}
                </div>
              </>
            )}

            {currentPage === "Matchups" && (
              <>
                <SectionTitle icon={Sword} title="Matchups" subtitle="Readable matchup cards with practical notes and stronger visual framing." />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {matchups.map((m) => (
                    <NeonCard key={m.name} className="overflow-hidden p-4 transition hover:-translate-y-1">
                      <img
                        src={m.image}
                        alt={m.name}
                        className="h-44 w-full rounded-2xl border border-red-500/25 object-cover"
                        onError={(event) => recoverImage(event)}
                        style={{ objectPosition: m.position }}
                      />
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-xl font-bold text-white">{m.name}</p>
                        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200">{m.danger}</span>
                      </div>
                      <p className="mt-1 text-sm text-red-300">{m.level}</p>
                      <p className="mt-3 text-white/70">{m.explanation}</p>
                    </NeonCard>
                  ))}
                </div>
              </>
            )}

            {currentPage === "Lane Phase" && (
              <>
                <SectionTitle icon={Target} title="Lane Phase" subtitle="The best compromise: fast jump buttons plus full sections visible on scroll, without forcing tab-switching to read the guide." />

                <div className="flex flex-wrap gap-2">
                  {laneSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => laneRefs.current[section.id]?.scrollIntoView({ behavior: "smooth", block: "start" })}
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200"
                    >
                      {section.title}
                    </button>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <StatCard label="Primary goal" value="Preserve HP" text="Do not waste health before the real engage window exists." />
                  <StatCard label="First spikes" value="Level 2 and 3" text="Q/E pressure first, Riposte confidence second." />
                  <StatCard label="Vision rule" value="Ward first" text="Control the lane space before converting into aggression." />
                </div>

                <div className="space-y-4">
                  {laneSections.map((section) => (
                    <NeonCard key={section.id} className="p-6">
                      <div
                        ref={(el) => {
                          laneRefs.current[section.id] = el;
                        }}
                        className="scroll-mt-28"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-red-300">Quick read</p>
                        <h3 className="mt-2 text-2xl font-black text-white">{section.title}</h3>
                        <p className="mt-3 text-white/70">{section.summary}</p>
                        <div className="mt-5 grid gap-4 md:grid-cols-3">
                          {section.points.map((point) => (
                            <div key={point} className="rounded-2xl border border-red-500/20 bg-black/35 p-4 text-white/75">
                              {point}
                            </div>
                          ))}
                        </div>
                      </div>
                    </NeonCard>
                  ))}
                </div>
              </>
            )}

            {currentPage === "Fiora's Support" && (
              <>
                <SectionTitle icon={HeartHandshake} title="Fiora's Support" subtitle="Global support logic, profile details, and direct connection to lane-phase reading." />

                <NeonCard className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-red-300">Mandatory read</p>
                  <h3 className="mt-2 text-2xl font-black text-white">Supports must read Lane Phase too</h3>
                  <p className="mt-3 max-w-3xl text-white/75">
                    This page explains support priorities, but lane execution details still live in Lane Phase. Read both to avoid desynced engages and fake all-ins.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button onClick={() => goLaneSection("early")} className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200">Read Lane Phase: Early</button>
                    <button onClick={() => goLaneSection("wave")} className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200">Read Lane Phase: Wave</button>
                    <button onClick={() => goLaneSection("support")} className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200">Read Lane Phase: Support</button>
                  </div>
                </NeonCard>

                <div className="grid items-end gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {supportProfiles.map((s) => (
                    <NeonCard key={s.name} className="p-4">
                      <img
                        src={s.image}
                        alt={s.name}
                        className={`w-full ${s.size} rounded-3xl border border-red-500/25 object-cover`}
                        onError={(event) => recoverImage(event)}
                        style={{ objectPosition: s.position }}
                      />
                      <p className="mt-3 text-xl font-bold text-white">{s.name}</p>
                      <p className="text-sm text-red-300">{s.role}</p>
                      <p className="mt-3 text-white/75">{s.text}</p>
                    </NeonCard>
                  ))}
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                  <NeonCard className="p-5">
                    <p className="mb-2 font-semibold text-red-300">Engage / hook</p>
                    <p className="text-white/75">Supports that create direct access are premium, because Fiora wins hardest when the target cannot freely kite the first commit.</p>
                  </NeonCard>
                  <NeonCard className="p-5">
                    <p className="mb-2 font-semibold text-red-300">Hydra timing</p>
                    <p className="text-white/75">Once Ravenous Hydra is completed, repeated pressure becomes easier because Fiora can sustain, reset, and re-enter faster.</p>
                  </NeonCard>
                  <NeonCard className="p-5">
                    <p className="mb-2 font-semibold text-red-300">Protective supports</p>
                    <p className="text-white/75">They still work when the goal is to survive lane, keep HP high, and unlock later spikes with cleaner entries.</p>
                  </NeonCard>
                </div>

                <SectionTitle icon={PlayCircle} title="Support Clips" subtitle="Integrated examples for support behavior around Fiora ADC." />
                <div className="grid gap-4 md:grid-cols-2">
                  {supportClips.map((clip) => (
                    <NeonCard key={clip.url} className="overflow-hidden p-4">
                      <div className="overflow-hidden rounded-2xl border border-red-500/20 bg-black">
                        <iframe
                          src={clip.embed}
                          title={clip.title}
                          className="h-72 w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      </div>
                      <div className="mt-3">
                        <p className="font-semibold text-white">{clip.title}</p>
                        <p className="mt-1 text-sm text-white/65">{clip.description}</p>
                        <a href={clip.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-200">
                          Open on YouTube
                        </a>
                      </div>
                    </NeonCard>
                  ))}
                </div>
              </>
            )}

            {currentPage === "Mid/Late Game" && (
              <>
                <SectionTitle icon={Flame} title="Mid / Late Game" subtitle="Macro priorities in cards, without another giant paragraph block." />
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ["Pick one plan", "Split, flank, pick, or group. Do not mix all plans at once."],
                    ["Entry timing", "Fight after vision and cooldown checks, not just because enemies are visible."],
                    ["Conversion", "Every successful fight should become objective pressure, tempo, or map space."],
                  ].map(([title, text]) => (
                    <NeonCard key={title} className="p-5">
                      <p className="font-bold text-white">{title}</p>
                      <p className="mt-2 text-white/70">{text}</p>
                    </NeonCard>
                  ))}
                </div>
                <NeonCard className="p-6">
                  <div className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-red-300">
                    Add later <ChevronRight className="h-4 w-4" /> Side pressure / vision setup / fight entry rules
                  </div>
                </NeonCard>
              </>
            )}

            {currentPage === "Mechanical Tips" && (
              <>
                <SectionTitle icon={Zap} title="Mechanical Tips" subtitle="Short tactical notes instead of bloated explanation blocks." />
                <div className="grid gap-4 md:grid-cols-2">
                  {mechanics.map((item) => (
                    <NeonCard key={item.title} className="p-5">
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="mt-2 text-white/70">{item.content}</p>
                    </NeonCard>
                  ))}
                </div>
              </>
            )}

            {currentPage === "Videos / Clips" && (
              <>
                <SectionTitle icon={PlayCircle} title="Videos / Clips" subtitle="Visual section ready for future highlight and teaching clip expansion." />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {[
                    { title: "Duel highlight", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg", pos: "center 24%" },
                    { title: "Timing sample", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg", pos: "center 24%" },
                    { title: "Carry sequence", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_7.jpg", pos: "center 25%" },
                  ].map((v) => (
                    <NeonCard key={v.title} className="overflow-hidden p-4">
                      <img
                        src={v.image}
                        alt={v.title}
                        className="h-56 w-full rounded-2xl border border-red-500/25 object-cover"
                        onError={(event) => recoverImage(event)}
                        style={{ objectPosition: v.pos }}
                      />
                      <p className="mt-3 font-semibold text-white">{v.title}</p>
                      <p className="mt-1 text-sm text-white/65">Reserved for your next clip and explanation block.</p>
                    </NeonCard>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed bottom-5 left-5 z-50 flex items-center gap-3 rounded-2xl border border-red-500/35 bg-black/75 px-3 py-2 shadow-[0_0_18px_rgba(255,0,60,0.22)] backdrop-blur-xl xl:hidden">
        <button
          onClick={() => void toggleBackgroundMusic()}
          className="text-red-300"
          aria-label="Toggle background music"
        >
          {musicPlaying ? <Pause className="h-5 w-5" /> : <Music2 className="h-5 w-5" />}
        </button>

        <input
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={musicVolume}
          onChange={(e) => setMusicVolume(Number(e.target.value))}
          className="w-20"
        />
      </div>

      <button
        onClick={scrollTop}
        className="fixed bottom-5 right-5 z-50 rounded-full border border-red-500/40 bg-black/70 p-3 text-red-300 shadow-[0_0_18px_rgba(255,0,60,0.25)]"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}
