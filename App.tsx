



marioneta-sped-up.mp3
Fichier

love-sillage.mp3
Fichier

sleaze-on-it.mp3
Fichier

lilium-music-box-ii.mp3
Fichier
tu peux lire completement cette conversation t'en impregner et remplir la tout derniere tache demandée:




Image chargée
est ce sur ce code tu peux sur la page home renplacer la photo en dessous de" AUTO WIN 

netanyahu certified" par cette photo:
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
          key={${src}-${index}}
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
          <div key={${it}-${i}} className="flex items-center gap-2">
            <img
              src={it}
              alt="item"
              className="h-12 w-12 rounded-lg border border-red-500/30 bg-black/40 object-cover"
              onError={(event) => recoverAssetImage(event, DEFAULT_ITEM_ICON)}
            />
            {i < items.length - 1 ? (
              <span className="text-red-300">→</span>
            ) : null}
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
            alt={Fiora ${page}}
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
                {musicPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Music2 className="h-4 w-4" />
                )}
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
                        className={w-full ${s.size} rounded-3xl border border-red-500/25 object-cover}
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

Oui.
Dans ton code, la photo affichée sous “AUTO WIN / netanyahu certified” est contrôlée ici :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png";
Tu peux juste la remplacer par le nom de ta nouvelle image, par exemple si tu mets ta photo dans le dossier public :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png.png";
Donc la partie à modifier devient :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png.png";
Et cette section utilisera automatiquement la nouvelle photo :

Si tu veux, je peux aussi te renvoyer le code déjà modifié prêt à copier-coller.


mais le code il a la photo ou pas ?

Pas encore dans le code lui-même.

Là, ton code contient seulement un chemin vers une image :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png";
Ça veut dire que la photo doit exister dans le dossier public de ton projet.

Dans ton cas, l’image que tu m’as envoyée est nommée :

/netanyahu.png.png
Donc pour que ça marche, il faut :

mettre l’image dans public

changer la ligne en :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png.png";
En résumé :

non, la photo n’est pas “intégrée” directement dans le code

oui, le code peut l’afficher si le fichier image est bien placé dans public

Exemple :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png.png";
Si ton projet est en React/Vite/Next, la structure doit ressembler à ça :

project/
├─ public/
│  └─ netanyahu.png.png
├─ src/
│  └─ App.tsx
Si tu veux éviter le double .png, renomme simplement l’image en :

netanyahu.png
puis garde :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png";
Le plus propre est ça.

Tu veux que je te dise exactement où déposer le fichier selon si tu es sur CodeSandbox, Vercel, ou en local ?


BAH je sais paas dis moi

Oui. Fais ça :

1. Renomme l’image
Le plus simple : renomme ton fichier en

netanyahu.png
2. Mets l’image dans le dossier public
Ton projet doit ressembler à ça :

project/
├─ public/
│  └─ netanyahu.png
├─ src/
│  └─ App.tsx
ou si ton fichier est directement dans le projet principal :

public/netanyahu.png
3. Garde cette ligne dans ton code
const HERO_CERTIFIED_IMAGE = "/netanyahu.png";
4. Tu n’as rien d’autre à changer
Car ton composant utilise déjà cette variable ici :

<img
  src={HERO_CERTIFIED_IMAGE}
  alt="Certified badge"
  className="h-24 w-24 rounded-2xl border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]"
  onError={(event) => recoverImage(event, DEFAULT_FIORA_IMAGE)}
/>
Si tu es sur CodeSandbox
Dans l’explorateur de fichiers :

ouvre public

glisse l’image dedans

renomme-la netanyahu.png

Si tu veux le faire ultra vite
Tu peux aussi ne pas renommer le fichier et mettre :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png.png";
mais c’est moins propre.

Donc la meilleure solution :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png";
avec le fichier image dans public/netanyahu.png.

Si tu veux, je peux maintenant te redonner le bloc exact du code avec la bonne ligne déjà prête.


Image chargée
quand je suios la je fais uqoi

Là tu es dans public/audio, donc pas au bon endroit pour l’image.

Fais ça :

Clique sur .. pour remonter d’un niveau.

Tu dois revenir dans public.

Une fois dans public, ajoute l’image ici, pas dans audio.

Renomme l’image en netanyahu.png.

Dans ton code, mets :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png";
Donc au final il faut avoir :

public/
├─ audio/
└─ netanyahu.png
et pas :

public/
└─ audio/
   └─ netanyahu.png
Parce que si tu la mets dans audio, il faudrait écrire :

const HERO_CERTIFIED_IMAGE = "/audio/netanyahu.png";
mais ce n’est pas ce qu’on veut ici.

Sur GitHub, une fois revenu dans public :

clique Add file

puis Upload files

mets ton image

commit

Ensuite vérifie que l’arborescence ressemble à :

public
├─ audio
└─ netanyahu.png
Après ça, garde cette ligne :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png";
Si tu veux, envoie-moi le screen une fois que tu es revenu dans public et je te dis exactement où cliquer.


Image chargée
dicte etape par etape quoi faire mtn

Oui, là c’est bon, l’image est au bon endroit dans public.

Maintenant fais exactement ça :

1. Ouvre ton fichier App.tsx
Dans la colonne de gauche, clique sur App.tsx.

2. Cherche cette ligne
Appuie sur Ctrl + F puis cherche :

const HERO_CERTIFIED_IMAGE
Tu devrais voir une ligne comme :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png";
ou peut-être autre chose.

3. Remplace la ligne par celle-ci
Comme ton fichier s’appelle actuellement netanyahu.png.png, mets :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png.png";
4. Sauvegarde
Si tu es sur GitHub web :

clique sur le petit crayon si besoin

modifie la ligne

puis en bas fais Commit changes

Si tu es sur un éditeur normal :

fais Ctrl + S

5. Recharge le site
Rafraîchis la page du site.

6. Vérifie
La photo sous :

AUTO WIN
netanyahu certified

doit maintenant être remplacée par celle que tu as ajoutée.

Option plus propre
Comme ton nom de fichier a un double .png, tu peux aussi le renommer en :

netanyahu.png
et ensuite mettre dans le code :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png";
Mais pour aller vite, garde juste :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png.png";
Résumé exact
Tu changes seulement cette ligne :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png.png";
et rien d’autre.

Envoie-moi juste une capture de la ligne dans App.tsx après modif, et je te dirai si c’est bon.


Image chargée
mais ça change rien comment savoir quoi chager dansd le code pour rempler la photo qu'il y ici par celle que je t'ai en tout premier message

Oui, là je vois le problème : tu ne veux pas changer juste le texte “AUTO WIN / netanyahu certified”, tu veux changer l’image affichée juste à côté de “SUPPORT SHELL”.

Et dans ton code, cette image est bien celle-ci :

<img
  src={HERO_CERTIFIED_IMAGE}
  alt="Certified badge"
  className="h-24 w-24 rounded-2xl border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]"
  onError={(event) => recoverImage(event, DEFAULT_FIORA_IMAGE)}
/>
Donc pour savoir quoi changer, il faut repérer le bloc avec “Support shell” juste en dessous. Dans ton code, c’est ici :

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
Ce que tu dois faire
Dans ce bloc, remplace :

src={HERO_CERTIFIED_IMAGE}
par :

src="/netanyahu.png.png"
Donc le bloc final doit devenir exactement :
<div className="mt-4 flex items-start gap-4">
  <img
    src="/netanyahu.png.png"
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
Étapes exactes
Ouvre App.tsx

Fais Ctrl + F

Cherche :

Support shell
Tu tomberas sur le bon bloc

Dans le <img ... /> juste au-dessus, remplace :

src={HERO_CERTIFIED_IMAGE}
par :

src="/netanyahu.png.png"
Sauvegarde / commit

Recharge le site

Pourquoi je te fais changer ça directement
Comme ça, tu modifies l’image exacte affichée à cet endroit, sans dépendre d’une variable ailleurs.

Si ça ne change toujours pas après ça, c’est probablement juste que le site n’a pas encore été redéployé ou que le cache garde l’ancienne image. Dans ce cas, fais un rechargement forcé avec Ctrl + F5.


18:12:07.347 Running build in Washington, D.C., USA (East) – iad1
18:12:07.348 Build machine configuration: 2 cores, 8 GB
18:12:07.513 Cloning github.com/wadloup/Fiora-adc- (Branch: main, Commit: 8204b1b)
18:12:09.969 Cloning completed: 2.456s
18:12:10.324 Restored build cache from previous deployment (A8kMSDqCArLY3RRRgghSN3LDxxWs)
18:12:10.668 Running "vercel build"
18:12:11.356 Vercel CLI 50.35.0
18:12:11.913 Detected pnpm-lock.yaml version 6 generated by pnpm@8.x
18:12:11.930 Installing dependencies...
18:12:12.593 (node:49) [DEP0169] DeprecationWarning: url.parse() behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for url.parse() vulnerabilities.
18:12:12.594 (Use node --trace-deprecation ... to show where the warning was created)
18:12:12.686 Lockfile is up to date, resolution step is skipped
18:12:12.811 Already up to date
18:12:13.309 
18:12:13.324 Done in 1.2s
18:12:13.348 Running "pnpm run build"
18:12:13.751 
18:12:13.751 > react-vite-ts@0.0.0 build /vercel/path0
18:12:13.751 > tsc -b && vite build
18:12:13.751 
18:12:16.433 App.tsx(53,7): error TS6133: 'HERO_CERTIFIED_IMAGE' is declared but its value is never read.
18:12:16.451  ELIFECYCLE  Command failed with exit code 2.
18:12:16.466 Error: Command "pnpm run build" exited with 2

Oui, l’erreur est claire.

Tu as probablement remplacé directement :

src={HERO_CERTIFIED_IMAGE}
par

src="/netanyahu.png.png"
Du coup la variable en haut :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png";
n’est plus utilisée, et TypeScript bloque.

Ce que tu dois faire maintenant
Dans App.tsx, cherche cette ligne :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png";
et remplace-la par :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png.png";
Puis vérifie bien que dans le bloc image tu as toujours :
src={HERO_CERTIFIED_IMAGE}
et pas :

src="/netanyahu.png.png"
Donc au final tu dois avoir exactement ça
en haut :
const HERO_CERTIFIED_IMAGE = "/netanyahu.png.png";
et dans l’image :
<img
  src={HERO_CERTIFIED_IMAGE}
  alt="Certified badge"
  className="h-24 w-24 rounded-2xl border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]"
  onError={(event) => recoverImage(event, DEFAULT_FIORA_IMAGE)}
/>
Pourquoi ça a planté
Parce que :

tu as laissé la variable HERO_CERTIFIED_IMAGE

mais tu ne l’utilises plus

et ton build refuse les variables inutilisées

Fais ça étape par étape
ouvre App.tsx

cherche :

const HERO_CERTIFIED_IMAGE
mets :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png.png";
cherche ensuite :

src="/netanyahu.png.png"
remplace par :

src={HERO_CERTIFIED_IMAGE}
commit

relance Vercel

Après ça, l’erreur devrait disparaître et la photo devrait s’afficher.

Tu peux aussi m’envoyer juste :

la ligne const HERO_CERTIFIED_IMAGE = ...

et le bloc <img ... />

et je te dirai immédiatement si c’est bon.


marche pa^s


Réflexion durant 16s
Ok, on va faire le plus sûr possible.

Le problème vient souvent de 3 choses :

le nom du fichier n’est pas propre,

le chemin n’est pas exactement le bon,

Vercel affiche encore un ancien déploiement.

Fais exactement ça.

Étape 1 — renomme le fichier dans GitHub
Dans public, ton fichier s’appelle actuellement :

netanyahu.png.png
Renomme-le en :

netanyahu.png
Étape 2 — vérifie l’arborescence
Il faut que ce soit exactement comme ça :

public/
├─ audio/
└─ netanyahu.png
Étape 3 — dans App.tsx, mets exactement cette ligne
Cherche :

const HERO_CERTIFIED_IMAGE =
et remplace par :

const HERO_CERTIFIED_IMAGE = "/netanyahu.png";
Étape 4 — dans le bloc image, remets bien la variable
Cherche le bloc avec Support shell et vérifie que l’image est bien :

<img
  src={HERO_CERTIFIED_IMAGE}
  alt="Certified badge"
  className="h-24 w-24 rounded-2xl border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]"
  onError={(event) => recoverImage(event, DEFAULT_FIORA_IMAGE)}
/>
Il ne faut pas avoir :

src="/netanyahu.png.png"
ni un autre chemin.

Étape 5 — commit
Fais un commit des changements.

Étape 6 — attends que Vercel redéploie
Si le build est vert, recharge ton site avec :

Ctrl + F5
Le code final doit être comme ça
en haut
const HERO_CERTIFIED_IMAGE = "/netanyahu.png";
dans HomeSupportShowcase()
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
Si ça ne marche toujours pas
Alors il faut tester directement si Vercel voit bien l’image.
Dans ton site déployé, ajoute à la fin de l’URL :

/netanyahu.png
Exemple :

https://ton-site.vercel.app/netanyahu.png
Résultat attendu :
si l’image s’ouvre → le fichier existe bien, le souci est dans le code

si tu as une 404 → le fichier n’est pas correctement pris en compte dans public

Envoie-moi juste :

la ligne const HERO_CERTIFIED_IMAGE = ...

et ce que donne l’URL /netanyahu.png

et je te dirai directement où ça bloque.


comment augmenter la taille de la photo

Oui. C’est cette partie qui règle la taille :

className="h-24 w-24 rounded-2xl border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]"
Pour l’agrandir
Remplace par par exemple :

className="h-36 w-36 rounded-2xl border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]"
Quelques tailles utiles
petit :

h-24 w-24
moyen :

h-32 w-32
plus grand :

h-36 w-36
très grand :

h-40 w-40
Exemple
<img
  src={HERO_CERTIFIED_IMAGE}
  alt="Certified badge"
  className="h-36 w-36 rounded-2xl border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]"
  onError={(event) => recoverImage(event, DEFAULT_FIORA_IMAGE)}
/>
Si le texte est trop collé après
Dans cette ligne :

<div className="mt-4 flex items-start gap-4">
tu peux aussi augmenter l’espace en mettant :

<div className="mt-4 flex items-start gap-6">
Donc :

photo plus grande → change h-24 w-24

plus d’espace avec le texte → change gap-4

Je te conseille de tester directement :

h-36 w-36
et

gap-6

sur ce code je peux rajouter des boutons interactif type je mets des pouces vers le haut ou vers le bas sur lequels les gens devront appuyer et y'a un compteur ?

Oui.

Tu peux ajouter :

un bouton 👍

un bouton 👎

un compteur pour chaque

et même empêcher plusieurs clics du même utilisateur dans la session

Le plus simple dans ton code actuel, c’est avec useState.

Exemple très simple
Tu peux créer un composant comme ça :

function VoteButtons() {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setLikes((v) => v + 1)}
        className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-white"
      >
        👍 {likes}
      </button>

      <button
        onClick={() => setDislikes((v) => v + 1)}
        className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-white"
      >
        👎 {dislikes}
      </button>
    </div>
  );
}
Ensuite tu l’affiches où tu veux
Par exemple dans la page Home :

<VoteButtons />
Important
Avec cette version :

le compteur marche

mais seulement localement

si la page se recharge, ça repart à zéro

les autres visiteurs ne verront pas le même total

Donc il y a 3 niveaux possibles
Niveau 1 — local seulement
Facile, rapide, pas de base de données.

Niveau 2 — localStorage
Le compteur reste sur le navigateur du visiteur même après refresh, mais reste individuel.

Niveau 3 — vrai compteur partagé entre tous
Là il faut un backend ou une base de données :

Supabase

Firebase

Vercel KV

Neon / PostgreSQL

autre API

Si tu veux juste tester visuellement sur ton site
Prends cette version un peu plus propre :

function VoteButtons() {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        onClick={() => setLikes((v) => v + 1)}
        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.03] hover:bg-white/10"
      >
        👍 {likes}
      </button>

      <button
        onClick={() => setDislikes((v) => v + 1)}
        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.03] hover:bg-white/10"
      >
        👎 {dislikes}
      </button>
    </div>
  );
}
Puis dans ton App() tu l’insères par exemple dans Home :

{currentPage === "Home" && (
  <>
    <VoteButtons />
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
Si tu veux un seul vote par utilisateur
Tu peux faire ça :

function VoteButtons() {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [vote, setVote] = useState<"like" | "dislike" | null>(null);

  const handleLike = () => {
    if (vote === "like") return;
    if (vote === "dislike") {
      setDislikes((v) => v - 1);
    }
    setLikes((v) => v + 1);
    setVote("like");
  };

  const handleDislike = () => {
    if (vote === "dislike") return;
    if (vote === "like") {
      setLikes((v) => v - 1);
    }
    setDislikes((v) => v + 1);
    setVote("dislike");
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        onClick={handleLike}
        className={rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
          vote === "like"
            ? "border-green-400/40 bg-green-500/15 text-green-200"
            : "border-white/15 bg-white/5 text-white hover:bg-white/10"
        }}
      >
        👍 {likes}
      </button>

      <button
        onClick={handleDislike}
        className={rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
          vote === "dislike"
            ? "border-red-400/40 bg-red-500/15 text-red-200"
            : "border-white/15 bg-white/5 text-white hover:bg-white/10"
        }}
      >
        👎 {dislikes}
      </button>
    </div>
  );
}
En vrai
Oui, c’est totalement faisable sur ton site.
Mais si tu veux que tous les visiteurs voient le même compteur réel, il faudra brancher une base de données.

Je peux te donner directement la version :

simple locale

avec sauvegarde localStorage

ou vrai système partagé avec Supabase


Image chargée
moi je suis sur vercel je peux faire en sorte que le compteur ne reinitialise pas a chaque fois ?


Oui, mais pas avec useState seul.

Sur Vercel, si tu veux que le compteur ne se réinitialise pas et que tout le monde voie le même nombre, il faut stocker les votes en dehors du composant, dans un stockage persistant.

Le plus simple pour toi, ce serait l’une de ces 3 solutions :

1. Le plus simple à brancher : Supabase
Tu crées une table avec par exemple :

id

likes

dislikes

Ensuite ton site :

lit les valeurs au chargement

ajoute +1 quand quelqu’un clique

réaffiche le total

C’est souvent la solution la plus simple pour un petit projet.

2. Firebase
Ça marche aussi très bien pour des compteurs interactifs.

3. Vercel KV
Comme tu es déjà sur Vercel, c’est pratique aussi.
Tu peux stocker :

likes

dislikes

et les incrémenter côté serveur.

Ce qu’il ne faut pas faire si tu veux un vrai compteur global
useState seul → reset au refresh

localStorage → garde la valeur seulement pour un visiteur

variable dans le code → reset au redéploiement

Le plus adapté pour toi
Vu ton niveau actuel et le fait que tu es déjà sur Vercel, je te conseille :

Supabase si tu veux quelque chose de clair et simple à comprendre
ou
Vercel KV si tu veux rester dans l’écosystème Vercel

En très simple
Pour avoir un compteur non réinitialisé, il te faut :

un endroit où stocker les votes

une route/API pour lire et modifier les votes

ton bouton qui appelle cette route

Exemple de logique
Quand quelqu’un clique sur 👍 :

ton front envoie une requête

le serveur augmente likes

il renvoie le nouveau total

le site l’affiche

Important
Si tu veux éviter que quelqu’un spamme 300 clics :

il faut ajouter une protection

par IP, cookie, session, ou compte utilisateur

Sinon techniquement le compteur marchera, mais n’importe qui pourra le gonfler.

Donc réponse courte à ta question
Oui, sur Vercel tu peux faire en sorte que le compteur ne se réinitialise pas, mais il faut une base de données ou un stockage persistant.

Le plus accessible pour toi :
Supabase.

Je peux te donner directement un système prêt à coller avec :

boutons 👍 / 👎

compteur persistant

Supabase

étapes exactes sur Vercel et dans ton code.


ok je veux faire un texte en Home page mettre " VAS TU ME REPORT ?3 " en anglais puis en dessous tu mets soit fleche vers le haut soit vers le bas et un emoji caca
je veux qu'ils aient a choisir un seul entre les 3 ils ne peuvent tout selectioner et ont qu'un seul vbote
je veux qu'il ne soit pas reinitialisé que tous les votes soient comptabilisé 
dicte moi etape par etape comment faire

Oui. Le plus simple pour toi est de le faire avec Supabase.
Comme ça :

les gens voient un vrai compteur global

les votes restent après refresh

un visiteur ne peut choisir qu’un seul parmi les 3

son vote est retenu sur son navigateur

Je te donne la méthode la plus simple à suivre.

1. Ce que tu vas ajouter sur la Home page
Tu veux afficher :

“ARE YOU GOING TO REPORT ME? :3”

Puis en dessous 3 choix :

⬆️

⬇️

💩

Et :

une seule sélection possible

un seul vote par visiteur

les compteurs restent enregistrés

2. Crée ton projet Supabase
Va sur Supabase, crée un compte puis :

a) Create new project
Choisis :

nom du projet

mot de passe database

région

Attends que le projet soit prêt.

3. Crée la table des votes
Dans Supabase :

va dans SQL Editor

clique New query

colle ceci :

create table report_votes (
  id bigint generated by default as identity primary key,
  option_key text not null unique,
  count bigint not null default 0
);

insert into report_votes (option_key, count)
values
  ('up', 0),
  ('down', 0),
  ('poop', 0);
Puis exécute.

Ça crée 3 lignes :

up

down

poop

4. Récupère tes clés Supabase
Dans Supabase :

va dans Project Settings

puis API

Copie :

Project URL

anon public key

Garde-les de côté.

5. Mets les variables dans Vercel
Dans Vercel :

ouvre ton projet

va dans Settings

puis Environment Variables

Ajoute :

première variable
Nom :

VITE_SUPABASE_URL
Valeur :

ton_project_url
deuxième variable
Nom :

VITE_SUPABASE_ANON_KEY
Valeur :

ta_anon_key
Ensuite sauvegarde.

6. Installe Supabase dans ton projet
Dans ton projet, il faut installer le package :

pnpm add @supabase/supabase-js
Si tu passes par GitHub/Codesandbox, fais-le là où tu gères le code.

7. Crée le client Supabase
Dans ton projet, crée un fichier :

supabase.ts
et mets dedans :

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
8. Ajoute le composant de vote dans App.tsx
Dans App.tsx, il faut d’abord modifier l’import React.

Remplace :

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
par :

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "./supabase";
9. Ajoute ce composant dans App.tsx
Colle ce composant avant export default function App() :

function ReportVoteBlock() {
  const [counts, setCounts] = useState({
    up: 0,
    down: 0,
    poop: 0,
  });

  const [selected, setSelected] = useState<"up" | "down" | "poop" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedVote = localStorage.getItem("report_vote_choice");
    if (savedVote === "up" || savedVote === "down" || savedVote === "poop") {
      setSelected(savedVote);
    }

    const loadVotes = async () => {
      const { data, error } = await supabase
        .from("report_votes")
        .select("option_key, count");

      if (error || !data) return;

      const next = { up: 0, down: 0, poop: 0 };

      for (const row of data) {
        if (row.option_key === "up") next.up = row.count;
        if (row.option_key === "down") next.down = row.count;
        if (row.option_key === "poop") next.poop = row.count;
      }

      setCounts(next);
    };

    void loadVotes();
  }, []);

  const handleVote = async (choice: "up" | "down" | "poop") => {
    if (loading || selected) return;

    setLoading(true);

    const currentValue = counts[choice];

    const { error } = await supabase
      .from("report_votes")
      .update({ count: currentValue + 1 })
      .eq("option_key", choice);

    if (!error) {
      const updated = {
        ...counts,
        [choice]: currentValue + 1,
      };

      setCounts(updated);
      setSelected(choice);
      localStorage.setItem("report_vote_choice", choice);
    }

    setLoading(false);
  };

  const total = counts.up + counts.down + counts.poop;

  return (
    <NeonCard className="p-6 md:p-8">
      <div className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-red-300">
            Community vote
          </p>
          <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
            ARE YOU GOING TO REPORT ME? :3
          </h2>
          <p className="mt-2 text-white/65">
            Pick one. One vote only.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <button
            onClick={() => void handleVote("up")}
            disabled={!!selected || loading}
            className={rounded-2xl border px-4 py-5 text-lg font-bold transition ${
              selected === "up"
                ? "border-green-400/40 bg-green-500/15 text-green-200"
                : "border-white/15 bg-white/5 text-white hover:bg-white/10"
            } ${selected || loading ? "cursor-not-allowed" : ""}}
          >
            <div className="text-3xl">⬆️</div>
            <div className="mt-2 text-sm uppercase tracking-[0.16em]">
              Up
            </div>
            <div className="mt-2 text-xl">{counts.up}</div>
          </button>

          <button
            onClick={() => void handleVote("down")}
            disabled={!!selected || loading}
            className={rounded-2xl border px-4 py-5 text-lg font-bold transition ${
              selected === "down"
                ? "border-red-400/40 bg-red-500/15 text-red-200"
                : "border-white/15 bg-white/5 text-white hover:bg-white/10"
            } ${selected || loading ? "cursor-not-allowed" : ""}}
          >
            <div className="text-3xl">⬇️</div>
            <div className="mt-2 text-sm uppercase tracking-[0.16em]">
              Down
            </div>
            <div className="mt-2 text-xl">{counts.down}</div>
          </button>

          <button
            onClick={() => void handleVote("poop")}
            disabled={!!selected || loading}
            className={rounded-2xl border px-4 py-5 text-lg font-bold transition ${
              selected === "poop"
                ? "border-yellow-400/40 bg-yellow-500/15 text-yellow-200"
                : "border-white/15 bg-white/5 text-white hover:bg-white/10"
            } ${selected || loading ? "cursor-not-allowed" : ""}}
          >
            <div className="text-3xl">💩</div>
            <div className="mt-2 text-sm uppercase tracking-[0.16em]">
              Poop
            </div>
            <div className="mt-2 text-xl">{counts.poop}</div>
          </button>
        </div>

        <p className="text-sm text-white/55">
          Total votes: {total}
        </p>

        {selected && (
          <p className="text-sm text-red-300">
            Your vote has been recorded.
          </p>
        )}
      </div>
    </NeonCard>
  );
}
10. Mets le bloc sur la Home page
Dans ton App.tsx, cherche cette partie :

{currentPage === "Home" && (
  <>
Puis juste après, ajoute :

<ReportVoteBlock />
Donc ça donnera :

{currentPage === "Home" && (
  <>
    <ReportVoteBlock />

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
11. Très important : autoriser la lecture/écriture dans Supabase
Dans Supabase, va dans SQL Editor et lance ça :

alter table report_votes enable row level security;

create policy "allow read votes"
on report_votes
for select
to anon
using (true);

create policy "allow update votes"
on report_votes
for update
to anon
using (true);
Sans ça, le site risque de ne pas pouvoir lire ou modifier les votes.

12. Commit et redéploie
Ensuite :

sauvegarde le code

commit sur GitHub

Vercel va redéployer

recharge ton site

13. Ce que ça fera exactement
Avec ce système :

un visiteur voit les compteurs réels

il peut voter une seule fois

son choix est mémorisé dans localStorage

tous les votes restent enregistrés dans Supabase

14. Limite importante
Cette version est simple, mais elle n’est pas anti-triche parfaite.

Quelqu’un peut revoter s’il :

change de navigateur

vide son localStorage

utilise un autre appareil

Pour un site perso, c’est souvent suffisant.
Pour un système plus sérieux, il faudrait ajouter :

IP limit

cookie sécurisé

compte utilisateur

edge function ou API route

15. Le plus important à vérifier si ça ne marche pas
Si ça casse :

vérifie que @supabase/supabase-js est bien installé

vérifie que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont bien dans Vercel

vérifie que les policies Supabase sont bien créées

vérifie que le fichier supabase.ts est au bon endroit

16. Texte exact que tu voulais
Ton texte en anglais :

ARE YOU GOING TO REPORT ME? :3
Les 3 choix :

⬆️

⬇️

💩

Je peux aussi te faire le bloc déjà intégré directement dans ton App.tsx, prêt à copier-coller sans que tu aies à chercher où le mettre.


pour l'API c'est lui: sjmixuktzyisitxypwqx
ou lui:https://sjmixuktzyisitxypwqx.supabase.co
ou ça : sb_publishable_1msHyAEkeoWKTmXeJoOhkg_OvPtczTf
et anon ça ? : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqbWl4dWt0enlpc2l0eHlwd3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1OTgyNjUsImV4cCI6MjA5MDE3NDI2NX0.rOpaGqfzfiqvORnrSXEK6qJXzMYlsktG1FEeOrEXcps

Oui, voilà à quoi correspond chaque valeur :

1. Project ID
sjmixuktzyisitxypwqx
Ça, c’est l’identifiant du projet.
Ce n’est pas celui que tu mets dans VITE_SUPABASE_URL.

2. Project URL
https://sjmixuktzyisitxypwqx.supabase.co
Ça, c’est la bonne valeur pour :

VITE_SUPABASE_URL
3. Publishable key
sb_publishable_1msHyAEkeoWKTmXeJoOhkg_OvPtczTf
Ça, c’est la publishable key récente de Supabase.
Selon l’interface, c’est souvent celle qu’on met côté front.

4. Anon JWT key
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Oui, ça, c’est bien l’anon key classique.

Ce que tu dois utiliser
Pour ton projet Vite, mets :

variable 1
VITE_SUPABASE_URL=https://sjmixuktzyisitxypwqx.supabase.co
variable 2
Tu peux utiliser la clé publishable si Supabase te l’affiche comme clé publique recommandée :

VITE_SUPABASE_ANON_KEY=sb_publishable_1msHyAEkeoWKTmXeJoOhkg_OvPtczTf
Donc, très concrètement dans Vercel
Tu ajoutes :

Name

VITE_SUPABASE_URL
Value

https://sjmixuktzyisitxypwqx.supabase.co
puis :

Name

VITE_SUPABASE_ANON_KEY
Value

sb_publishable_1msHyAEkeoWKTmXeJoOhkg_OvPtczTf
Et pas ça
Ne mets pas juste :

sjmixuktzyisitxypwqx
car ce n’est pas une URL complète.

Résumé ultra simple
sjmixuktzyisitxypwqx → ID projet

https://sjmixuktzyisitxypwqx.supabase.co → URL à utiliser

sb_publishable_... → clé publique à utiliser

eyJhbGciOi... → ancienne forme de clé anon, aussi publique

Le plus propre aujourd’hui :
URL + publishable key

Si tu veux, je te dicte maintenant mot pour mot quoi remplir dans les deux cases de Vercel puis le fichier supabase.ts.


Donc, très concrètement dans Vercelcomment decrit etape par etape

Oui. Fais exactement ça dans Vercel.

Étape 1
Ouvre ton projet sur Vercel.

Étape 2
Dans la barre de gauche, clique sur :

Settings

Étape 3
Dans les réglages du projet, cherche :

Environment Variables

Clique dessus.

Étape 4
Tu vas ajouter la première variable.

Dans Name, écris :

VITE_SUPABASE_URL
Dans Value, colle :

https://sjmixuktzyisitxypwqx.supabase.co
Dans les environnements, laisse coché :

Production

Preview

Development

Puis clique sur le bouton pour ajouter la variable.

Étape 5
Ajoute maintenant la deuxième variable.

Dans Name, écris :

VITE_SUPABASE_ANON_KEY
Dans Value, colle :

sb_publishable_1msHyAEkeoWKTmXeJoOhkg_OvPtczTf
Là aussi, laisse coché :

Production

Preview

Development

Puis ajoute la variable.

Étape 6
Vérifie que tu as bien ces deux lignes dans Vercel :

VITE_SUPABASE_URL = https://sjmixuktzyisitxypwqx.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_1msHyAEkeoWKTmXeJoOhkg_OvPtczTf
Étape 7
Une fois les variables ajoutées, il faut redéployer ton site pour que Vercel les prenne en compte.

Tu peux faire l’un des deux :

soit refaire un petit commit sur GitHub

soit dans Vercel, aller dans Deployments puis relancer un déploiement

Étape 8
Après ça, dans ton code, ton fichier supabase.ts devra utiliser :

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
Étape 9
Quand c’est fait, ton site pourra lire ces variables automatiquement au build.

Résumé exact à entrer
Première variable :

Name

VITE_SUPABASE_URL
Value

https://sjmixuktzyisitxypwqx.supabase.co
Deuxième variable :

Name

VITE_SUPABASE_ANON_KEY
Value

sb_publishable_1msHyAEkeoWKTmXeJoOhkg_OvPtczTf
Envoie-moi juste un screen de la page Environment Variables une fois fait, et je te dirai la suite exacte.


Après ça, dans ton code, ton fichier supabase.ts devra utiliser : : 
où ? dis exactement

Oui. Je te dis exactement où.

Où créer supabase.ts
Dans ton projet, au même niveau que App.tsx.

D’après ta structure, tu as quelque chose comme :

App.tsx

README.md

index.css

index.html

public/

Donc tu dois créer le fichier ici :

supabase.ts
au même endroit que :

App.tsx
Arborescence attendue
Ça doit ressembler à ça :

project/
├─ public/
│  ├─ audio/
│  └─ netanyahu.png
├─ App.tsx
├─ supabase.ts
├─ index.css
├─ index.html
└─ README.md
Ce que tu mets dans supabase.ts
Tu crées un nouveau fichier nommé :

supabase.ts
et tu colles exactement ça dedans :

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
Comment le créer sur GitHub
Si tu modifies ton projet sur GitHub web :

1.
Va à la racine du projet, là où tu vois :

App.tsx

README.md

index.css

2.
Clique sur Add file

3.
Clique sur Create new file

4.
Dans le nom du fichier, écris :

supabase.ts
5.
Colle ce code :

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
6.
Clique sur Commit changes

Ensuite dans App.tsx
Il faudra importer ce fichier.

En haut de App.tsx, ajoute :

import { supabase } from "./supabase";
Donc tu auras par exemple :

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "./supabase";
Résumé très clair
supabase.ts doit être créé à côté de App.tsx

pas dans public

pas dans audio

pas dans Vercel

dans ton repo GitHub

Chemin attendu :

/App.tsx
/supabase.ts
Si tu veux, je peux maintenant te dire exactement quoi écrire dans App.tsx ligne par ligne pour ajouter le système de vote.


11:01:33.217 Running build in Washington, D.C., USA (East) – iad1
11:01:33.218 Build machine configuration: 2 cores, 8 GB
11:01:33.349 Cloning github.com/wadloup/Fiora-adc- (Branch: main, Commit: cfbd326)
11:01:34.032 Cloning completed: 683.000ms
11:01:34.206 Restored build cache from previous deployment (GN8VHsLuEDyMSbLkHFxs8fnexBUR)
11:01:34.589 Running "vercel build"
11:01:35.513 Vercel CLI 50.35.0
11:01:36.051 Detected pnpm-lock.yaml version 6 generated by pnpm@8.x
11:01:36.081 Installing dependencies...
11:01:36.671 (node:49) [DEP0169] DeprecationWarning: url.parse() behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for url.parse() vulnerabilities.
11:01:36.671 (Use node --trace-deprecation ... to show where the warning was created)
11:01:36.740 Lockfile is up to date, resolution step is skipped
11:01:36.851 Already up to date
11:01:37.402 
11:01:37.417 Done in 1.2s
11:01:37.441 Running "pnpm run build"
11:01:37.850 
11:01:37.850 > react-vite-ts@0.0.0 build /vercel/path0
11:01:37.851 > tsc -b && vite build
11:01:37.851 
11:01:40.502 App.tsx(10,1): error TS6133: 'supabase' is declared but its value is never read.
11:01:40.503 supabase.ts(1,30): error TS2307: Cannot find module '@supabase/supabase-js' or its corresponding type declarations.
11:01:40.520  ELIFECYCLE  Command failed with exit code 2.
11:01:40.535 Error: Command "pnpm run build" exited with 2

Tu as 2 erreurs différentes.

1. Erreur principale
Cannot find module '@supabase/supabase-js'
Ça veut dire que le package Supabase n’est pas installé dans ton projet GitHub.

2. Erreur secondaire
'supabase' is declared but its value is never read
Ça veut dire que tu as bien ajouté :

import { supabase } from "./supabase";
mais tu ne l’utilises pas encore dans App.tsx.

Ce qu’il faut faire maintenant
Étape 1 — installer Supabase dans le projet
Il faut ajouter la dépendance dans ton projet.

Si tu es sur GitHub web seulement
Tu ne peux pas “installer” un package juste en modifiant App.tsx.
Il faut soit :

passer par CodeSandbox / StackBlitz / local

soit modifier directement le fichier package.json

Étape 2 — méthode la plus simple pour toi : modifier package.json
Ouvre le fichier package.json à la racine du projet.

Cherche la partie :

"dependencies": {
  ...
}
Et ajoute cette ligne dedans :

"@supabase/supabase-js": "^2.49.8"
Par exemple, si tu as quelque chose comme :

"dependencies": {
  "framer-motion": "^12.6.2",
  "lucide-react": "^0.511.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
ça doit devenir :

"dependencies": {
  "@supabase/supabase-js": "^2.49.8",
  "framer-motion": "^12.6.2",
  "lucide-react": "^0.511.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
Très important
respecte les virgules

ne mets pas de virgule en trop à la fin

garde le JSON propre

Ensuite fais Commit changes.

Étape 3 — corriger l’erreur “supabase never read”
Pour l’instant, comme ton système de vote n’est pas encore collé dans App.tsx, il faut retirer temporairement l’import.

Dans App.tsx, enlève cette ligne :

import { supabase } from "./supabase";
Tu la remettras après, quand on aura ajouté le vrai bloc de vote.

Donc là, tout de suite, fais exactement ça
Dans App.tsx
supprime :

import { supabase } from "./supabase";
Dans package.json
ajoute dans dependencies :

"@supabase/supabase-js": "^2.49.8"
Garde ton fichier supabase.ts
Tu peux le laisser :

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
Résultat attendu après ça
Le build devrait au moins arrêter de planter sur :

module introuvable

import inutilisé

Ensuite
Une fois que ce build passe, on ajoutera le bloc de vote dans App.tsx et on remettra :

import { supabase } from "./supabase";
Résumé ultra concret
A faire maintenant :
ouvrir App.tsx

supprimer :

import { supabase } from "./supabase";
ouvrir package.json

ajouter :

"@supabase/supabase-js": "^2.49.8"
dans "dependencies"

commit

laisser Vercel redéployer

Envoie-moi ensuite le contenu de ton dependencies dans package.json, et je te dirai s’il est correct.


11:05:49.823 Running build in Washington, D.C., USA (East) – iad1
11:05:49.823 Build machine configuration: 2 cores, 8 GB
11:05:49.944 Cloning github.com/wadloup/Fiora-adc- (Branch: main, Commit: 61ac47f)
11:05:50.567 Cloning completed: 623.000ms
11:05:50.687 Restored build cache from previous deployment (GN8VHsLuEDyMSbLkHFxs8fnexBUR)
11:05:51.008 Running "vercel build"
11:05:51.634 Vercel CLI 50.35.0
11:05:52.162 Detected pnpm-lock.yaml version 6 generated by pnpm@8.x
11:05:52.181 Installing dependencies...
11:05:53.199 (node:50) [DEP0169] DeprecationWarning: url.parse() behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for url.parse() vulnerabilities.
11:05:53.201 (Use node --trace-deprecation ... to show where the warning was created)
11:05:53.270  ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json
11:05:53.271 
11:05:53.271 Note that in CI environments this setting is true by default. If you still need to run install in such cases, use "pnpm install --no-frozen-lockfile"
11:05:53.271 
11:05:53.272     Failure reason:
11:05:53.272     specifiers in the lockfile ({"framer-motion":"^11.11.17","lucide-react":"^0.468.0","react":"^19.0.0","react-dom":"^19.0.0","@eslint/js":"^9.17.0","@types/react":"^19.0.0","@types/react-dom":"^19.0.0","@vitejs/plugin-react":"^4.3.4","autoprefixer":"^10.4.20","eslint":"^9.17.0","eslint-plugin-react-hooks":"^5.0.0","eslint-plugin-react-refresh":"^0.4.16","globals":"^15.14.0","postcss":"^8.4.49","tailwindcss":"^3.4.17","typescript":"~5.6.2","typescript-eslint":"^8.18.2","vite":"^6.0.5"}) don't match specs in package.json ({"@eslint/js":"^9.17.0","@types/react":"^19.0.0","@types/react-dom":"^19.0.0","@vitejs/plugin-react":"^4.3.4","autoprefixer":"^10.4.20","eslint":"^9.17.0","eslint-plugin-react-hooks":"^5.0.0","eslint-plugin-react-refresh":"^0.4.16","globals":"^15.14.0","postcss":"^8.4.49","tailwindcss":"^3.4.17","typescript":"~5.6.2","typescript-eslint":"^8.18.2","vite":"^6.0.5","@supabase/supabase-js":"^2.49.8","framer-motion":"^11.11.17","lucide-react":"^0.468.0","react":"^19.0.0","react-dom":"^19.0.0"})
11:05:53.293 Error: Command "pnpm install" exited with 1

Là, le problème a changé : ton package.json a bien été modifié, mais pas le pnpm-lock.yaml.

Vercel voit :

package.json = avec Supabase

pnpm-lock.yaml = sans Supabase

Du coup il bloque.

Ce que ça veut dire
Sur GitHub web, modifier seulement package.json ne suffit pas avec pnpm.

Il faut aussi régénérer pnpm-lock.yaml.

La solution la plus simple
Option 1 — la plus propre
Ouvre le projet dans CodeSandbox ou en local, puis lance :

pnpm install
Ça mettra à jour pnpm-lock.yaml.

Ensuite tu commits :

package.json

pnpm-lock.yaml

Et Vercel build normalement.

Si tu veux le faire vite sans local
Option 2 — dire à Vercel d’accepter le lockfile non à jour
Dans Vercel :

1.
Va dans ton projet

2.
Clique sur Settings

3.
Va dans General

4.
Cherche Build & Development Settings

5.
Trouve Install Command

6.
Remplace la commande par :

pnpm install --no-frozen-lockfile
7.
Sauvegarde

8.
Redéploie

Ce que je te conseille
Pour toi, fais l’option 2 maintenant.
C’est la plus rapide.

Étapes exactes sur Vercel
ouvre ton projet sur Vercel

clique Settings

clique General

descends jusqu’à Build & Development Settings

sur Install Command, mets :

pnpm install --no-frozen-lockfile
sauvegarde

va dans Deployments

relance un déploiement

Après ça
Si le build passe, on pourra continuer avec le système de vote.

Important
Pour l’instant :

garde supabase.ts

garde @supabase/supabase-js dans package.json

laisse l’import supabase retiré de App.tsx tant qu’on n’a pas collé le composant de vote

Envoie-moi juste un screen de Build & Development Settings quand tu y es, et je te dis exactement où cliquer.


11:08:00.817 Running build in Washington, D.C., USA (East) – iad1
11:08:00.818 Build machine configuration: 2 cores, 8 GB
11:08:00.829 Cloning github.com/wadloup/Fiora-adc- (Branch: main, Commit: 61ac47f)
11:08:00.830 Skipping build cache, deployment was triggered without cache.
11:08:01.339 Cloning completed: 509.000ms
11:08:01.881 Running "vercel build"
11:08:02.555 Vercel CLI 50.35.0
11:08:03.100 Detected pnpm-lock.yaml version 6 generated by pnpm@8.x
11:08:03.102 Running "install" command: pnpm install --no-frozen-lockfile...
11:08:03.772 (node:49) [DEP0169] DeprecationWarning: url.parse() behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for url.parse() vulnerabilities.
11:08:03.773 (Use node --trace-deprecation ... to show where the warning was created)
11:08:04.001 Progress: resolved 1, reused 0, downloaded 0, added 0
11:08:05.003 Progress: resolved 18, reused 0, downloaded 18, added 0
11:08:06.004 Progress: resolved 105, reused 0, downloaded 104, added 0
11:08:07.004 Progress: resolved 295, reused 0, downloaded 249, added 0
11:08:07.195  WARN  1 deprecated subdependencies found: glob@10.4.5
11:08:07.220 Packages: +285
11:08:07.221 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
11:08:08.004 Progress: resolved 328, reused 0, downloaded 285, added 230
11:08:08.521 Progress: resolved 328, reused 0, downloaded 285, added 285, done
11:08:08.591 .../esbuild@0.25.5/node_modules/esbuild postinstall$ node install.js
11:08:08.666 .../esbuild@0.25.5/node_modules/esbuild postinstall: Done
11:08:09.236 
11:08:09.237 dependencies:
11:08:09.239 + @supabase/supabase-js 2.100.1
11:08:09.240 + framer-motion 11.18.2
11:08:09.240 + lucide-react 0.468.0
11:08:09.240 + react 19.1.0
11:08:09.240 + react-dom 19.1.0
11:08:09.241 
11:08:09.241 devDependencies:
11:08:09.241 + @eslint/js 9.29.0
11:08:09.242 + @types/react 19.1.8
11:08:09.242 + @types/react-dom 19.1.6
11:08:09.242 + @vitejs/plugin-react 4.5.2
11:08:09.242 + autoprefixer 10.4.20
11:08:09.243 + eslint 9.29.0
11:08:09.243 + eslint-plugin-react-hooks 5.2.0
11:08:09.243 + eslint-plugin-react-refresh 0.4.20
11:08:09.243 + globals 15.15.0
11:08:09.243 + postcss 8.4.49
11:08:09.244 + tailwindcss 3.4.19
11:08:09.244 + typescript 5.6.3
11:08:09.244 + typescript-eslint 8.57.1
11:08:09.244 + vite 6.3.5
11:08:09.245 
11:08:09.245 Done in 5.9s
11:08:10.515 Running "pnpm run build"
11:08:10.941 
11:08:10.941 > react-vite-ts@0.0.0 build /vercel/path0
11:08:10.942 > tsc -b && vite build
11:08:10.942 

Parfait — ça a marché.
Supabase est maintenant bien installé et le build est en train de passer.

Maintenant on ajoute le système de vote.

Étape 1 — remettre l’import dans App.tsx
En haut de App.tsx, remets cette ligne :

import { supabase } from "./supabase";
Juste sous tes imports React, par exemple :

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "./supabase";
Étape 2 — ajoute le composant de vote
Dans App.tsx, colle ce bloc entier juste avant :

export default function App() {
Colle exactement ça :

function ReportVoteBlock() {
  const [counts, setCounts] = useState({
    up: 0,
    down: 0,
    poop: 0,
  });

  const [selected, setSelected] = useState<"up" | "down" | "poop" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedVote = localStorage.getItem("report_vote_choice");
    if (savedVote === "up" || savedVote === "down" || savedVote === "poop") {
      setSelected(savedVote);
    }

    const loadVotes = async () => {
      const { data, error } = await supabase
        .from("report_votes")
        .select("option_key, count");

      if (error || !data) {
        console.error(error);
        return;
      }

      const next = { up: 0, down: 0, poop: 0 };

      for (const row of data) {
        if (row.option_key === "up") next.up = row.count;
        if (row.option_key === "down") next.down = row.count;
        if (row.option_key === "poop") next.poop = row.count;
      }

      setCounts(next);
    };

    void loadVotes();
  }, []);

  const handleVote = async (choice: "up" | "down" | "poop") => {
    if (loading || selected) return;

    setLoading(true);

    const currentValue = counts[choice];

    const { error } = await supabase
      .from("report_votes")
      .update({ count: currentValue + 1 })
      .eq("option_key", choice);

    if (!error) {
      setCounts((prev) => ({
        ...prev,
        [choice]: currentValue + 1,
      }));
      setSelected(choice);
      localStorage.setItem("report_vote_choice", choice);
    } else {
      console.error(error);
    }

    setLoading(false);
  };

  const total = counts.up + counts.down + counts.poop;

  return (
    <NeonCard className="p-6 md:p-8">
      <div className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-red-300">
            Community vote
          </p>
          <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
            ARE YOU GOING TO REPORT ME? :3
          </h2>
          <p className="mt-2 text-white/65">
            Pick one only.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <button
            onClick={() => void handleVote("up")}
            disabled={!!selected || loading}
            className={rounded-2xl border px-4 py-5 text-lg font-bold transition ${
              selected === "up"
                ? "border-green-400/40 bg-green-500/15 text-green-200"
                : "border-white/15 bg-white/5 text-white hover:bg-white/10"
            } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
          >
            <div className="text-3xl">⬆️</div>
            <div className="mt-2 text-sm uppercase tracking-[0.16em]">
              Up
            </div>
            <div className="mt-2 text-xl">{counts.up}</div>
          </button>

          <button
            onClick={() => void handleVote("down")}
            disabled={!!selected || loading}
            className={rounded-2xl border px-4 py-5 text-lg font-bold transition ${
              selected === "down"
                ? "border-red-400/40 bg-red-500/15 text-red-200"
                : "border-white/15 bg-white/5 text-white hover:bg-white/10"
            } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
          >
            <div className="text-3xl">⬇️</div>
            <div className="mt-2 text-sm uppercase tracking-[0.16em]">
              Down
            </div>
            <div className="mt-2 text-xl">{counts.down}</div>
          </button>

          <button
            onClick={() => void handleVote("poop")}
            disabled={!!selected || loading}
            className={rounded-2xl border px-4 py-5 text-lg font-bold transition ${
              selected === "poop"
                ? "border-yellow-400/40 bg-yellow-500/15 text-yellow-200"
                : "border-white/15 bg-white/5 text-white hover:bg-white/10"
            } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
          >
            <div className="text-3xl">💩</div>
            <div className="mt-2 text-sm uppercase tracking-[0.16em]">
              Poop
            </div>
            <div className="mt-2 text-xl">{counts.poop}</div>
          </button>
        </div>

        <p className="text-sm text-white/55">Total votes: {total}</p>

        {selected && (
          <p className="text-sm text-red-300">
            Your vote has been recorded.
          </p>
        )}
      </div>
    </NeonCard>
  );
}
Étape 3 — l’afficher sur la Home page
Dans App.tsx, cherche cette partie :

{currentPage === "Home" && (
  <>
Juste en dessous, ajoute :

<ReportVoteBlock />
Donc ça devient :

{currentPage === "Home" && (
  <>
    <ReportVoteBlock />
Étape 4 — créer la table dans Supabase
Dans Supabase :

va dans SQL Editor

clique New query

colle ça :

create table if not exists report_votes (
  id bigint generated by default as identity primary key,
  option_key text not null unique,
  count bigint not null default 0
);

insert into report_votes (option_key, count)
values
  ('up', 0),
  ('down', 0),
  ('poop', 0)
on conflict (option_key) do nothing;
Puis exécute.

Étape 5 — activer les permissions
Toujours dans SQL Editor, lance ça :

alter table report_votes enable row level security;

create policy "allow read votes"
on report_votes
for select
to anon
using (true);

create policy "allow update votes"
on report_votes
for update
to anon
using (true);
Étape 6 — commit
Ensuite :

commit App.tsx

commit si besoin supabase.ts

Puis Vercel redéploie.

Étape 7 — test
Quand le site est en ligne :

va sur Home

clique sur un seul des 3 boutons

recharge la page

ton choix doit rester bloqué sur ton navigateur

le compteur doit rester globalement enregistré

Important
Avec cette version :

un utilisateur normal ne peut voter qu’une fois sur son navigateur

mais quelqu’un peut tricher en vidant le stockage local ou changeant d’appareil

Pour un site perso, ça va très bien.

Si tu veux, le prochain message que je peux te faire, c’est où coller exactement <ReportVoteBlock /> dans ton code avec le bon extrait autour, pour éviter toute erreur de placement.


Image chargée
y'a deja un code dedans

Oui, c’est normal.

L’écran que tu montres est l’intérieur de App().
Moi, le bloc ReportVoteBlock() je t’ai dit de le coller avant :

export default function App() {
Donc pas dedans.

Où le mettre exactement
Tu descends dans App.tsx et tu repères cette ligne :

export default function App() {
Il faut coller juste au-dessus tout le composant :

function ReportVoteBlock() {
  ...
}
Schéma
Ton fichier doit ressembler à ça :

function NarrationPanel({ page }: { page: PageName }) {
  ...
}

function ReportVoteBlock() {
  ...
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("Home");
  ...
}
Donc
ne colle pas le bloc dans App()

ne remplace pas ce qu’il y a dans ton screen

colle le bloc avant export default function App() {

Ensuite seulement
Dans App(), là où tu as :

{currentPage === "Home" && (
  <>
tu ajoutes juste :

<ReportVoteBlock />
pour afficher le composant.

En très simple
Il y a 2 actions différentes :

1. créer le composant
à coller au-dessus de export default function App()

2. l’afficher
à ajouter dans le return de Home avec :

<ReportVoteBlock />
Si tu veux, envoie-moi une capture un peu plus haut dans le fichier, juste autour de la ligne export default function App() {, et je te dirai exactement à quel endroit précis coller le bloc.


comment ça lance ça : alter table report_votes enable row level security;

create policy "allow read votes"
on report_votes
for select
to anon
using (true);

create policy "allow update votes"
on report_votes
for update
to anon
using (true);

Tu lances ça dans Supabase, pas dans ton code.

Étape par étape
Ouvre ton projet Supabase.

Dans le menu de gauche, clique sur SQL Editor.

Clique sur New query.

Une grande zone de texte va s’ouvrir.

Colle dedans exactement :

alter table report_votes enable row level security;

create policy "allow read votes"
on report_votes
for select
to anon
using (true);

create policy "allow update votes"
on report_votes
for update
to anon
using (true);
Clique sur Run ou RUN en haut à droite.

Ce que ça fait
active la sécurité sur la table

autorise les visiteurs anonymes à lire les votes

autorise les visiteurs anonymes à mettre à jour les votes

Important
Avant ça, il faut que la table report_votes existe déjà.
Donc normalement tu dois d’abord avoir lancé :

create table if not exists report_votes (
  id bigint generated by default as identity primary key,
  option_key text not null unique,
  count bigint not null default 0
);

insert into report_votes (option_key, count)
values
  ('up', 0),
  ('down', 0),
  ('poop', 0)
on conflict (option_key) do nothing;
Ordre correct
créer la table

insérer les 3 lignes

lancer les policies

Si tu veux, je peux te donner les 2 blocs SQL dans le bon ordre, prêts à copier-coller l’un après l’autre.


comment je reduis sa taille d'affichage

Tu veux réduire la taille de ton bloc de vote (texte + boutons).

👉 Tout se joue dans les classes Tailwind (text-, px-, py-, p-, etc.)

1. Réduire le titre
Tu as ça :

<h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
👉 Remplace par :

<h2 className="mt-2 text-xl font-black text-white md:text-2xl">
2. Réduire les boutons
Tu as ça :

className="rounded-2xl border px-4 py-5 text-lg font-bold"
👉 Remplace par :

className="rounded-xl border px-3 py-3 text-sm font-semibold"
3. Réduire les emojis
Tu as :

<div className="text-3xl">⬆️</div>
👉 Remplace par :

<div className="text-xl">⬆️</div>
(fais pareil pour ⬇️ et 💩)

4. Réduire les compteurs
Tu as :

<div className="mt-2 text-xl">{counts.up}</div>
👉 Remplace par :

<div className="mt-1 text-sm">{counts.up}</div>
5. Réduire le bloc global
Tu as :

<NeonCard className="p-6 md:p-8">
👉 Remplace par :

<NeonCard className="p-4 md:p-5">
6. Réduire l’espace entre éléments
Tu as :

<div className="space-y-5">
👉 Remplace par :

<div className="space-y-3">
Résultat final
Ton bloc sera :

plus compact

plus discret

plus “clean” sur la page

Si tu veux aller encore plus loin
Tu peux même rendre les boutons ultra compacts :

px-2 py-2 text-xs
Résumé rapide
Tu modifies :

text-3xl → text-xl

px-4 py-5 → px-3 py-3

text-lg → text-sm

p-6 → p-4

Si tu veux, je peux te faire une version :
👉 ultra stylée + bien intégrée à ton site Fiora (design + glow + hover clean)


comment je les regles a  ma guise parceque la je regle sans connaitre leur taille finale

Le plus simple, c’est de comprendre à quoi correspondent les classes Tailwind, comme ça tu règles visuellement sans deviner.

1. Pour la largeur et la hauteur
Sur une image ou un bloc, tu verras souvent :

h-24 w-24
Ça veut dire :

h = hauteur

w = largeur

Quelques repères utiles :

h-16 w-16 → petit

h-20 w-20 → un peu plus grand

h-24 w-24 → taille moyenne

h-32 w-32 → grand

h-40 w-40 → très grand

Donc tu testes par paliers :

h-20 w-20
h-24 w-24
h-28 w-28
h-32 w-32
2. Pour le texte
Classes fréquentes :

text-xs
text-sm
text-base
text-lg
text-xl
text-2xl
text-3xl
text-4xl
Ordre du plus petit au plus grand :

text-xs

text-sm

text-base

text-lg

text-xl

text-2xl

text-3xl

Donc si c’est trop gros :

text-3xl → text-2xl → text-xl

3. Pour l’espace intérieur
Tu verras :

p-6
px-4
py-5
Ça veut dire :

p = padding partout

px = padding gauche/droite

py = padding haut/bas

Repères :

p-2 petit

p-4 moyen

p-6 assez grand

p-8 grand

Même logique pour px et py.

4. Pour l’espace entre les éléments
Tu verras par exemple :

gap-4
space-y-5
mt-4
Ça veut dire :

gap-4 = espace entre les éléments d’une grille/flex

space-y-5 = espace vertical entre plusieurs blocs

mt-4 = marge en haut

Repères utiles :

2 petit

3 un peu plus

4 moyen

6 grand

8 très grand

Donc :

gap-6 plus espacé que gap-4

mt-2 plus serré que mt-4

5. La meilleure méthode pour régler “à ta guise”
Tu changes une seule valeur à la fois.

Exemple :

className="h-24 w-24"
Tu testes :

className="h-20 w-20"
puis

className="h-28 w-28"
Comme ça tu vois directement l’effet.

6. Encore mieux : valeurs libres
Tu peux mettre une taille exacte au lieu des presets Tailwind.

Exemple :

className="h-[90px] w-[90px]"
ou

className="text-[22px]"
ou

className="p-[14px]"
Ça, c’est le plus pratique si tu veux régler précisément.

Exemples
Image :

className="h-[88px] w-[88px] rounded-2xl object-cover"
Titre :

className="text-[26px] font-black"
Bouton :

className="px-[14px] py-[10px] text-[15px]"
7. Ce que je te conseille pour ne plus tâtonner
Utilise les crochets pour les éléments importants.

Par exemple :

image : h-[90px] w-[90px]

emoji : text-[24px]

compteur : text-[16px]

titre : text-[28px]

Comme ça tu ajustes presque “au millimètre”.

8. Exemple concret
Au lieu de :

className="h-24 w-24 rounded-2xl"
mets :

className="h-[95px] w-[95px] rounded-2xl"
Au lieu de :

className="text-3xl"
mets :

className="text-[22px]"
9. Règle pratique
Quand tu ne connais pas la taille finale :

commence avec une valeur moyenne

ajuste de 4 à 8 px à chaque test

Exemple :

90px

98px

106px

C’est beaucoup plus simple que de sauter au hasard entre h-20, h-28, etc.

10. En vrai, la meilleure réponse
Pour régler “à ta guise”, le plus confortable est d’utiliser :

les classes normales Tailwind pour les tests rapides

les valeurs libres [...] pour le réglage précis

Exemple final :

className="h-[92px] w-[92px] text-[15px] px-[14px] py-[10px]"
Si tu veux, je peux te faire un petit tableau ultra simple de conversion Tailwind → taille visuelle approximative pour text, padding, width/height.


mais la y'a pas de h

  const total = counts.up + counts.down + counts.poop;

  return (
    <NeonCard className="p-6 md:p-8">
      <div className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-red-300">
            Community vote
          </p>
          <h2 className="mt-2 text-xl font-black text-white md:text-4xl">
            ARE YOU GOING TO REPORT ME? :3
          </h2>
          <p className="mt-2 text-white/65">
            Pick one only.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <button
            onClick={() => void handleVote("up")}
            disabled={!!selected || loading}
            className={rounded-xl border px-4 py-5 text-lg font-bold transition ${
              selected === "up"
                ? "border-green-400/40 bg-green-500/15 text-green-200"
                : "border-white/15 bg-white/5 text-white hover:bg-white/10"
            } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
          >
            <div className="text-xl">⬆️</div>
            <div className="mt-2 text-sm uppercase tracking-[0.16em]">
              Up
            </div>
            <div className="mt-2 text-xl">{counts.up}</div>
          </button>

          <button
            onClick={() => void handleVote("down")}
            disabled={!!selected || loading}
            className={rounded-2xl border px-4 py-5 text-lg font-bold transition ${
              selected === "down"
                ? "border-red-400/40 bg-red-500/15 text-red-200"
                : "border-white/15 bg-white/5 text-white hover:bg-white/10"
            } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
          >
            <div className="text-xl">⬇️</div>
            <div className="mt-2 text-sm uppercase tracking-[0.16em]">
              Down
            </div>
            <div className="mt-2 text-xl">{counts.down}</div>
          </button>

          <button
            onClick={() => void handleVote("poop")}
            disabled={!!selected || loading}
            className={rounded-2xl border px-4 py-5 text-lg font-bold transition ${
              selected === "poop"
                ? "border-yellow-400/40 bg-yellow-500/15 text-yellow-200"
                : "border-white/15 bg-white/5 text-white hover:bg-white/10"
            } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
          >
            <div className="text-xl">💩</div>
            <div className="mt-2 text-sm uppercase tracking-[0.16em]">
              Poop
            </div>
            <div className="mt-2 text-xl">{counts.poop}</div>
          </button>
        </div>

        <p className="text-sm text-white/55">Total votes: {total}</p>

        {selected && (
          <p className="text-sm text-red-300">
            Your vote has been recorded.
          </p>
        )}
      </div>
    </NeonCard>
  );

Oui, ici il n’y a pas de h-... parce que tes boutons n’ont pas de hauteur fixe.

Leur taille dépend surtout de :

px-4 et py-5 → espace intérieur

text-lg, text-xl, text-sm → taille du texte

le contenu à l’intérieur

Donc pour réduire ou régler la taille ici, tu joues surtout sur ça
1. Taille globale du bloc
<NeonCard className="p-6 md:p-8">
p-6 = padding du bloc

md:p-8 = encore plus grand sur écran moyen/grand

Plus petit :

<NeonCard className="p-4 md:p-5">
2. Espacement vertical entre les éléments
<div className="space-y-5">
Plus petit :

<div className="space-y-3">
3. Taille du titre
<h2 className="mt-2 text-xl font-black text-white md:text-4xl">
Le souci ici, c’est surtout :

md:text-4xl
Donc sur grand écran, ça devient énorme.

Plus équilibré :

<h2 className="mt-2 text-xl font-black text-white md:text-2xl">
ou précis :

<h2 className="mt-2 text-[22px] font-black text-white md:text-[28px]">
4. Taille des boutons
Ici :

className={rounded-xl border px-4 py-5 text-lg font-bold transition ...}
Ce qui grossit le bouton, ce sont surtout :

px-4

py-5

text-lg

Plus petit :

className={rounded-xl border px-3 py-3 text-sm font-semibold transition ...}
ou réglage précis :

className={rounded-xl border px-[14px] py-[10px] text-[14px] font-semibold transition ...}
5. Taille des emojis
<div className="text-xl">⬆️</div>
Tu peux mettre :

<div className="text-lg">⬆️</div>
ou :

<div className="text-[18px]">⬆️</div>
6. Taille du compteur
<div className="mt-2 text-xl">{counts.up}</div>
Plus petit :

<div className="mt-1 text-base">{counts.up}</div>
ou :

<div className="mt-1 text-[15px]">{counts.up}</div>
Si tu veux une hauteur fixe malgré tout
Là oui, tu peux ajouter un h-....

Par exemple sur le bouton :

className={h-32 rounded-xl border px-4 py-5 text-lg font-bold transition ...}
ou en précis :

className={h-[120px] rounded-xl border px-4 py-5 text-lg font-bold transition ...}
Mais en général pour un bouton comme ça, ce n’est pas obligatoire.
Souvent on ajuste juste :

py

px

text

Version compacte de ton bloc
Tu peux tester directement ça :

const total = counts.up + counts.down + counts.poop;

return (
  <NeonCard className="p-4 md:p-5">
    <div className="space-y-3">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-red-300">
          Community vote
        </p>
        <h2 className="mt-2 text-xl font-black text-white md:text-2xl">
          ARE YOU GOING TO REPORT ME? :3
        </h2>
        <p className="mt-1 text-sm text-white/65">
          Pick one only.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <button
          onClick={() => void handleVote("up")}
          disabled={!!selected || loading}
          className={rounded-xl border px-3 py-3 text-sm font-semibold transition ${
            selected === "up"
              ? "border-green-400/40 bg-green-500/15 text-green-200"
              : "border-white/15 bg-white/5 text-white hover:bg-white/10"
          } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
        >
          <div className="text-lg">⬆️</div>
          <div className="mt-1 text-xs uppercase tracking-[0.16em]">
            Up
          </div>
          <div className="mt-1 text-base">{counts.up}</div>
        </button>

        <button
          onClick={() => void handleVote("down")}
          disabled={!!selected || loading}
          className={rounded-xl border px-3 py-3 text-sm font-semibold transition ${
            selected === "down"
              ? "border-red-400/40 bg-red-500/15 text-red-200"
              : "border-white/15 bg-white/5 text-white hover:bg-white/10"
          } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
        >
          <div className="text-lg">⬇️</div>
          <div className="mt-1 text-xs uppercase tracking-[0.16em]">
            Down
          </div>
          <div className="mt-1 text-base">{counts.down}</div>
        </button>

        <button
          onClick={() => void handleVote("poop")}
          disabled={!!selected || loading}
          className={rounded-xl border px-3 py-3 text-sm font-semibold transition ${
            selected === "poop"
              ? "border-yellow-400/40 bg-yellow-500/15 text-yellow-200"
              : "border-white/15 bg-white/5 text-white hover:bg-white/10"
          } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
        >
          <div className="text-lg">💩</div>
          <div className="mt-1 text-xs uppercase tracking-[0.16em]">
            Poop
          </div>
          <div className="mt-1 text-base">{counts.poop}</div>
        </button>
      </div>

      <p className="text-xs text-white/55">Total votes: {total}</p>

      {selected && (
        <p className="text-xs text-red-300">
          Your vote has been recorded.
        </p>
      )}
    </div>
  </NeonCard>
);
Règle simple à retenir
Quand il n’y a pas de h-..., la taille vient surtout de :

p-...

px-...

py-...

text-...

space-y-...

gap-...

Et si tu veux un réglage exact, mets par exemple :

px-[12px] py-[10px] text-[14px]
Si tu veux, je peux te prendre ton bloc exact et te le transformer en version :

compacte,

moyenne,

ou grande.


tu sais quoi redonne moi le code avec la taille reduite de 40%

Oui. Voici ton bloc avec une taille visuelle réduite d’environ 40 % et un rendu plus compact.

const total = counts.up + counts.down + counts.poop;

return (
  <NeonCard className="p-4 md:p-5">
    <div className="space-y-3">
      <div>
        <p className="text-[10px] uppercase tracking-[0.24em] text-red-300">
          Community vote
        </p>
        <h2 className="mt-1 text-[18px] font-black text-white md:text-[24px]">
          ARE YOU GOING TO REPORT ME? :3
        </h2>
        <p className="mt-1 text-[12px] text-white/65">
          Pick one only.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <button
          onClick={() => void handleVote("up")}
          disabled={!!selected || loading}
          className={rounded-xl border px-3 py-3 text-[13px] font-semibold transition ${
            selected === "up"
              ? "border-green-400/40 bg-green-500/15 text-green-200"
              : "border-white/15 bg-white/5 text-white hover:bg-white/10"
          } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
        >
          <div className="text-[18px]">⬆️</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.16em]">
            Up
          </div>
          <div className="mt-1 text-[15px]">{counts.up}</div>
        </button>

        <button
          onClick={() => void handleVote("down")}
          disabled={!!selected || loading}
          className={rounded-xl border px-3 py-3 text-[13px] font-semibold transition ${
            selected === "down"
              ? "border-red-400/40 bg-red-500/15 text-red-200"
              : "border-white/15 bg-white/5 text-white hover:bg-white/10"
          } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
        >
          <div className="text-[18px]">⬇️</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.16em]">
            Down
          </div>
          <div className="mt-1 text-[15px]">{counts.down}</div>
        </button>

        <button
          onClick={() => void handleVote("poop")}
          disabled={!!selected || loading}
          className={rounded-xl border px-3 py-3 text-[13px] font-semibold transition ${
            selected === "poop"
              ? "border-yellow-400/40 bg-yellow-500/15 text-yellow-200"
              : "border-white/15 bg-white/5 text-white hover:bg-white/10"
          } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
        >
          <div className="text-[18px]">💩</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.16em]">
            Poop
          </div>
          <div className="mt-1 text-[15px]">{counts.poop}</div>
        </button>
      </div>

      <p className="text-[11px] text-white/55">Total votes: {total}</p>

      {selected && (
        <p className="text-[11px] text-red-300">
          Your vote has been recorded.
        </p>
      )}
    </div>
  </NeonCard>
);
Si tu veux encore plus petit, remplace juste :

text-[18px] par text-[16px]

px-3 py-3 par px-2 py-2

md:text-[24px] par md:text-[20px]


je peux modifier manuellement le nombre de votes ?

Oui.

Tu peux le faire directement dans Supabase.

Méthode la plus simple
1. Ouvre Supabase
Va sur ton projet.

2. Clique sur Table Editor
Dans le menu de gauche.

3. Ouvre la table
Clique sur :

report_votes
4. Tu verras normalement 3 lignes
avec :

up

down

poop

et une colonne count.

5. Modifie la valeur
Dans la colonne count, clique sur le nombre et remplace-le manuellement.

Exemple :

up → 12

down → 4

poop → 27

6. Sauvegarde
Selon l’interface, soit ça sauvegarde automatiquement, soit tu valides la ligne.

Autre méthode : avec SQL
Dans SQL Editor, tu peux lancer par exemple :

update report_votes
set count = 50
where option_key = 'up';
ou :

update report_votes
set count = 10
where option_key = 'down';
ou :

update report_votes
set count = 99
where option_key = 'poop';
Pour remettre tout à zéro
Tu peux lancer :

update report_votes
set count = 0;
Important
Si tu modifies dans Supabase :

le nouveau total sera conservé

tous les visiteurs verront ce nouveau nombre

Donc oui, tu peux totalement tricher/manipuler le compteur manuellement si tu veux.


v'est possible de voir qui et cobien de personnes sont connectés ?

Bonne question — et la réponse courte :

👉 Non, pas directement avec ton setup actuel (React + Supabase simple).

Mais tu peux le faire avec quelques ajouts. Je t’explique clairement :

❌ Ce que tu as actuellement
Avec ton code :

tu stockes des votes

mais tu ne sais pas qui est connecté

tu ne sais pas combien de personnes sont en ligne

✅ Ce que tu peux faire (3 niveaux)
1. Compter les visiteurs (approx)
👉 Facile à ajouter

Tu peux compter :

combien de personnes ont visité la page

combien ont voté

👉 Mais pas en temps réel

2. Voir combien de personnes sont “en ligne” (temps réel)
👉 Possible avec Supabase Realtime

Principe :

quand quelqu’un ouvre la page → il “rejoint”

quand il quitte → il “part”

tu comptes les personnes actives

👉 Ça donne un compteur :

👥 12 users online
3. Voir “qui” exactement
👉 Impossible sans comptes

Pour voir “qui” :

il faut un système de login

sinon tu ne peux voir que :

un ID anonyme

ou une IP (pas recommandé)

🧠 Ce que je te conseille
Vu ton projet :

👉 Ajoute un compteur :

👥  X players watching
C’est stylé et simple à comprendre.

⚡ Version simple (sans backend lourd)
Tu peux faire un compteur “pseudo temps réel” avec Supabase :

Étape 1 : créer une table
create table online_users (
  id uuid primary key default gen_random_uuid(),
  last_seen timestamp default now()
);
Étape 2 : quand quelqu’un arrive
Tu ajoutes une ligne :

await supabase.from("online_users").insert({});
Étape 3 : mise à jour régulière
Toutes les 10–15 secondes :

await supabase
  .from("online_users")
  .update({ last_seen: new Date() })
  .eq("id", userId);
Étape 4 : supprimer les inactifs
Tu comptes seulement ceux actifs :

select count(*)
from online_users
where last_seen > now() - interval '30 seconds';
🔥 Résultat
Tu peux afficher :

👥 23 players online
⚠️ Important
Sans login :

tu ne peux pas savoir “qui”

seulement combien

🧩 Conclusion
👉 Oui, c’est possible de voir :

combien de personnes sont sur le site

👉 Non, pas directement :

qui exactement (sans compte)

Si tu veux
Je peux te faire :

un compteur en ligne en temps réel

directement intégrable dans ton App.tsx

avec le même style que ton site

👉 dis juste :
"oui compteur online"


 comment je change :la taille ici pour agradir

Oui. Pour agrandir ici, tu dois changer les classes Tailwind du texte.

Dans ton screen, tu as :

<p className="text-[10px] uppercase tracking-[0.24em] text-red-300">
  VOTE HERE
</p>
Pour agrandir
Change :

text-[10px]
par une valeur plus grande, par exemple :

text-[16px]
Donc :

<p className="text-[16px] uppercase tracking-[0.24em] text-red-300">
  VOTE HERE
</p>
Tailles utiles
petit :

text-[10px]
moyen :

text-[14px]
grand :

text-[18px]
très grand :

text-[22px]
Si tu veux aussi plus d’espace autour
Tu peux ajouter une marge en bas :

<p className="text-[16px] uppercase tracking-[0.24em] text-red-300 mb-2">
  VOTE HERE
</p>
Si tu veux agrandir tout le bloc vote
Tu peux aussi changer juste en dessous :

le titre h2

les boutons px, py

les emojis text-[18px]

Mais pour la ligne que tu montres, c’est surtout :

text-[10px]
qu’il faut augmenter.

Exemple direct :

<p className="text-[18px] uppercase tracking-[0.24em] text-red-300">
  VOTE HERE
</p>

  <NeonCard className="p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-red-300">
                Fiora ADC Guide
              </p>
              <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
                {currentPage === "Home" ? (
                  <>
                    <ReportVoteBlock />
                    Fiora ADC, structured and aggressive.
                    <span className="block text-red-400">
                      SUPPORT CHECK BELOW ☟

comment faire en sorte que "☟" soit d'une autre couleur

Oui. Il faut entourer seulement le ☟ avec un span.

Par exemple :

<span className="block text-red-400">
  SUPPORT CHECK BELOW <span className="text-yellow-300">☟</span>
</span>
Tu peux changer la couleur avec :
jaune :

text-yellow-300
vert :

text-green-300
bleu :

text-blue-300
blanc :

text-white
rose :

text-pink-300
Exemple plus flashy
<span className="block text-red-400">
  SUPPORT CHECK BELOW <span className="text-yellow-300">☟</span>
</span>
Exemple avec glow
<span className="block text-red-400">
  SUPPORT CHECK BELOW{" "}
  <span className="text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">
    ☟
  </span>
</span>
Le plus simple pour toi :

<span className="block text-red-400">
  SUPPORT CHECK BELOW <span className="text-yellow-300">☟</span>
</span>

c'est quoi le 300 ?

Bonne question 👍

Dans Tailwind, le 300 correspond à l’intensité de la couleur.

Principe
text-yellow-300
text → texte

yellow → couleur

300 → niveau de luminosité

Échelle complète (simplifiée)
Valeur	Couleur
100	très clair
200	clair
300	un peu clair
400	normal
500	standard (couleur “de base”)
600	un peu foncé
700	foncé
800	très foncé
900	presque noir
Exemple concret
text-yellow-200 → jaune très clair
text-yellow-300 → jaune clair (doux)
text-yellow-400 → jaune plus visible
text-yellow-500 → jaune bien flashy
text-yellow-600 → jaune plus foncé
Pour ton cas (flèche ☟)
👉 Si tu veux qu’elle ressorte bien :

text-yellow-400
👉 Si tu veux très flashy :

text-yellow-500
👉 Si tu veux discret :

text-yellow-300
Exemple final stylé
<span className="block text-red-400">
  SUPPORT CHECK BELOW{" "}
  <span className="text-yellow-400">☟</span>
</span>
Résumé simple
👉 Le nombre = intensité / luminosité de la couleur

petit nombre → clair

grand nombre → foncé

Si tu veux, je peux te proposer une couleur parfaite pour ton thème rouge/noir (style agressif Fiora) 👍


maintenant c compliqué de mettre mon site en ligne ?

Non, pas vraiment.
Le plus dur est déjà fait si ton projet est sur GitHub et connecté à Vercel.

Vu tes captures, ton site est déjà presque en ligne, voire déjà en ligne si le déploiement est vert.

Comment vérifier
Sur Vercel :

va dans Deployments

ouvre le dernier déploiement

clique sur Visit

Si la page s’ouvre, ton site est déjà en ligne.

Ce qu’il te faut pour qu’il soit “vraiment” en ligne
Il faut juste :

que le build passe sans erreur

que Vercel ait une URL

éventuellement un nom de domaine perso si tu veux quelque chose de plus propre

En pratique
Tu as déjà :

le code

GitHub

Vercel

les variables d’environnement

le déploiement

Donc le processus est :

tu modifies le code

tu commits sur GitHub

Vercel redéploie

ton site en ligne se met à jour

Adresse du site
Tu as normalement déjà une URL du type :

ton-projet.vercel.app
C’est déjà un site public.

Si tu veux un nom plus propre
Tu peux plus tard ajouter :

un domaine perso

ou renommer le projet Vercel

Mais ce n’est pas obligatoire.

Donc réponse honnête
Non, ce n’est pas compliqué pour toi maintenant, parce que l’infrastructure est déjà branchée.
Le plus important maintenant, c’est surtout :

éviter les erreurs de build

bien commit les fichiers

vérifier le rendu après chaque déploiement

Si tu veux, je peux te dire en 3 vérifications exactes comment savoir si ton site est déjà publiquement accessible.


MAIS JE VEUX DIRE quand on le recherche sur google par exemple on tombe dessus

Ahh ok, là tu parles de Google (référencement) → c’est autre chose que “mettre en ligne”.

👉 Ton site est déjà en ligne, mais
👉 Google ne le connaît pas encore

🎯 Objectif
Quand quelqu’un tape ton site → il apparaît sur Google

🧠 Important à comprendre
Google :

ne connaît pas ton site automatiquement

doit le découvrir et l’indexer

✅ Étapes pour apparaître sur Google
1. Ton site doit être accessible
Tu as déjà :
👉 ton-site.vercel.app → OK

2. Ajouter ton site à Google (très important)
Va ici :
👉 https://search.google.com/search-console

Puis :
clique Ajouter une propriété

choisis URL prefix

mets ton URL Vercel :

https://ton-site.vercel.app
3. Vérification
Google va te demander de vérifier.

👉 Le plus simple :

méthode HTML tag

Il va te donner un truc comme :

<meta name="google-site-verification" content="xxxxx" />
4. Ajouter ça dans ton site
Dans ton index.html, dans <head> :

<meta name="google-site-verification" content="xxxxx" />
5. Soumettre ton site
Dans Google Search Console :

va dans URL Inspection

colle ton URL

clique Request indexing

⏱️ Temps
Après ça :

ça peut prendre quelques heures à quelques jours

parfois 1 semaine

🚀 Pour améliorer les chances d’apparaître
1. Donne un vrai titre au site
Dans index.html :

<title>Fiora ADC Guide - Auto Win Strategy</title>
2. Ajoute une description
Toujours dans <head> :

<meta name="description" content="Fiora ADC guide, build, runes, matchups and strategy. Carry your games." />
3. Nom du projet
Ton URL actuelle est sûrement un truc du genre :

fiora-adc-xxxx.vercel.app
👉 pas idéal pour Google

💎 Bonus (important)
Si tu veux vraiment apparaître sur Google facilement :

👉 prends un domaine custom

Exemple :

fiora-adc.com
Puis tu le connectes à Vercel.

⚠️ Réalité
Même avec tout ça :

tu n’apparaîtras pas forcément en 1er

Google classe les sites selon :

popularité

contenu

liens

🧩 Résumé simple
Pour apparaître sur Google :

ajouter ton site à Google Search Console

vérifier avec la balise

demander l’indexation

attendre

Si tu veux
Je peux :

te dire exactement où coller la balise dans ton index.html

optimiser ton site pour qu’il remonte mieux sur Google

te proposer un nom de domaine stylé Fiora ADC 😈



Parfait, ton erreur est très classique, je t’explique exactement 👇

❌ Pourquoi ça a échoué
Tu as choisi :
👉 Validation par fichier HTML

Mais Google dit :

Impossible de trouver le fichier de validation

👉 Donc tu n’as pas mis le fichier au bon endroit

✅ Solution la PLUS SIMPLE (recommandée)
👉 Change de méthode → utilise la balise HTML

C’est beaucoup plus facile avec Vercel.

🔥 Méthode rapide (celle que tu dois faire)
1. Dans Google Search Console
Clique sur :
👉 “Balise HTML”

Tu vas avoir ça :

<meta name="google-site-verification" content="XXXXXXX" />
2. Va dans ton projet (très important)
Ouvre ton fichier :

index.html
3. Dans <head> ajoute la balise
Exemple :

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <meta name="google-site-verification" content="XXXXXXX" />

  <title>Fiora ADC Guide</title>
</head>
4. Push sur GitHub
Fais :

git add .
git commit -m "google verification"
git push
5. Attends que Vercel redéploie
(10–30 secondes)

6. Retourne sur Google
Clique :
👉 Valider

⚠️ ERREUR QUE TU AS FAITE
Tu as utilisé :
👉 méthode fichier HTML

Mais pour que ça marche, il faut :

télécharger un fichier

le mettre dans /public

accessible via URL

👉 c’est plus chiant → évite

💡 Si tu veux quand même le faire (optionnel)
Il faudrait :

télécharger le fichier Google

le mettre dans :

/public/googlexxxx.html
accessible ici :

https://ton-site.vercel.app/googlexxxx.html
🧠 Conclusion
👉 Utilise balise HTML, c’est :

plus simple

plus fiable

instantané avec Vercel

Si ça marche pas
Envoie-moi :

ton index.html

ou une capture

et je te dis EXACTEMENT où corriger 👌


voila ce que google m'a donné:<meta name="google-site-verification" content="pIamQzQ5iRE0nkjNI5LLq9-__9l2YAtIsXLkrKevr18" />

voila mon dossier index html: <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + Tailwind + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>

Ajoute simplement la balise dans le <head>.

Ton index.html doit devenir :

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="google-site-verification"
      content="pIamQzQ5iRE0nkjNI5LLq9-__9l2YAtIsXLkrKevr18"
    />
    <title>Vite + React + Tailwind + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
Ensuite fais ça :

sauvegarde / commit index.html

attends que Vercel redéploie

retourne sur Google Search Console

clique sur Valider

Petit conseil : profite-en pour changer aussi le titre, parce que Vite + React + Tailwind + TS n’est pas bon pour Google. Par exemple :

<title>Fiora ADC Guide</title>
Donc encore mieux :

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="google-site-verification"
      content="pIamQzQ5iRE0nkjNI5LLq9-__9l2YAtIsXLkrKevr18"
    />
    <title>Fiora ADC Guide</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
Après validation, ton site ne sera pas forcément visible tout de suite sur Google, mais il pourra être indexé.


ensuite

Ensuite :

Commit la modif de index.html sur GitHub.

Attends que Vercel redéploie.

Ouvre ton site en ligne et fais Ctrl + F5.

Retourne sur Google Search Console.

Clique sur Valider.

Si la validation passe, fais ça juste après :

Dans Search Console, va dans Inspection de l’URL.

Colle l’URL principale de ton site.

Clique sur Demander une indexation.

Puis améliore un peu ton index.html pour Google. Dans le <head>, tu peux mettre ça :

<meta
  name="description"
  content="Fiora ADC guide with build, runes, matchups, lane phase, support tips, and mechanical advice."
/>
<title>Fiora ADC Guide | Build, Runes, Matchups</title>
Ton head peut donc devenir :

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta
    name="google-site-verification"
    content="pIamQzQ5iRE0nkjNI5LLq9-__9l2YAtIsXLkrKevr18"
  />
  <meta
    name="description"
    content="Fiora ADC guide with build, runes, matchups, lane phase, support tips, and mechanical advice."
  />
  <title>Fiora ADC Guide | Build, Runes, Matchups</title>
</head>
Après ça, il faudra attendre que Google indexe le site. Ça peut prendre de quelques heures à plusieurs jours.


y'a une erreur :19:56:48.657 Running build in Washington, D.C., USA (East) – iad1
19:56:48.657 Build machine configuration: 2 cores, 8 GB
19:56:48.830 Cloning github.com/wadloup/Fiora-adc- (Branch: main, Commit: 3b783ee)
19:56:49.503 Cloning completed: 673.000ms
19:56:49.635 Restored build cache from previous deployment (9eRHqbx3ZVwPdBsaGP4qsQbP67t6)
19:56:49.948 Running "vercel build"
19:56:50.858 Vercel CLI 50.37.1
19:56:51.375 Detected pnpm-lock.yaml version 6 generated by pnpm@8.x
19:56:51.376 Running "install" command: pnpm install --no-frozen-lockfile...
19:56:51.981 (node:49) [DEP0169] DeprecationWarning: url.parse() behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for url.parse() vulnerabilities.
19:56:51.982 (Use node --trace-deprecation ... to show where the warning was created)
19:56:52.283 Progress: resolved 0, reused 0, downloaded 1, added 0
19:56:53.284 Progress: resolved 18, reused 0, downloaded 17, added 0
19:56:54.290 Progress: resolved 140, reused 0, downloaded 134, added 0
19:56:55.291 Progress: resolved 321, reused 0, downloaded 275, added 0
19:56:55.364  WARN  1 deprecated subdependencies found: glob@10.4.5
19:56:55.393 Already up to date
19:56:55.404 Progress: resolved 328, reused 0, downloaded 285, added 0, done
19:56:55.506 
19:56:55.507 Done in 3.9s
19:56:55.634 Running "pnpm run build"
19:56:56.042 
19:56:56.042 > react-vite-ts@0.0.0 build /vercel/path0
19:56:56.042 > tsc -b && vite build
19:56:56.042 
19:56:59.685 [36mvite v6.3.5 [32mbuilding for production...[36m[39m
19:56:59.738 [32m✓[39m 0 modules transformed.
19:56:59.741 [31m✗[39m Build failed in 29ms
19:56:59.742 [31merror during build:
19:56:59.743 [31m[vite:build-html] Unable to parse HTML; parse5 error code eof-in-element-that-can-contain-only-text
19:56:59.743  at /vercel/path0/index.html:18:1
19:56:59.744 16 |    </body>
19:56:59.744 17 |  </html>
19:56:59.745 18 |  
19:56:59.745    |  ^[31m
19:56:59.745 file: [36m/vercel/path0/index.html[31m
19:56:59.745     at handleParseError (file:///vercel/path0/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:36198:9)
19:56:59.746     at Parser.onParseError (file:///vercel/path0/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:36111:7)
19:56:59.746     at Parser._err (file:///vercel/path0/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-CvfTChi5.js:5133:14)
19:56:59.746     at eofInText (file:///vercel/path0/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-CvfTChi5.js:7317:7)
19:56:59.747     at Parser.onEof (file:///vercel/path0/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-CvfTChi5.js:6059:17)
19:56:59.749     at Tokenizer._emitEOFToken (file:///vercel/path0/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-CvfTChi5.js:1754:22)
19:56:59.749     at Tokenizer._stateRcdata (file:///vercel/path0/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-CvfTChi5.js:2158:22)
19:56:59.749     at Tokenizer._callState (file:///vercel/path0/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-CvfTChi5.js:1821:22)
19:56:59.749     at Tokenizer._runParsingLoop (file:///vercel/path0/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-CvfTChi5.js:1537:22)
19:56:59.749     at Tokenizer.write (file:///vercel/path0/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-CvfTChi5.js:1562:14)[39m
19:56:59.754  ELIFECYCLE  Command failed with exit code 1.
19:56:59.770 Error: Command "pnpm run build" exited with 1  

Oui — l’erreur vient presque sûrement de ton index.html mal fermé.

Le message :

Unable to parse HTML; parse5 error code eof-in-element-that-can-contain-only-text
veut souvent dire qu’il y a un tag comme :

<title>

<script>

parfois une balise mal copiée dans le <head>

qui n’est pas correctement fermé.

Le plus simple : remplace entièrement ton index.html par cette version propre.

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="google-site-verification"
      content="pIamQzQ5iRE0nkjNI5LLq9-__9l2YAtIsXLkrKevr18"
    />
    <meta
      name="description"
      content="Fiora ADC guide with build, runes, matchups, lane phase, support tips, and mechanical advice."
    />
    <title>Fiora ADC Guide | Build, Runes, Matchups</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
Ensuite :

sauvegarde

commit

laisse Vercel redéployer

Si ça replante encore, c’est que ton fichier actuel contient un caractère ou une balise en trop. Dans ce cas, le plus sûr est vraiment de tout effacer dans index.html et de recoller exactement le bloc ci-dessus.

Le line 18 de ton log me fait penser qu’il y a probablement un truc du genre :

<title>... non fermé

ou une balise meta copiée avec une quote manquante

Donc ne corrige pas juste un bout : remplace tout le fichier.


quand je copie colle cet url : https://fiora-blotfhsh3-lotfinobl2005-2315s-projects.vercel.app/

sur prefixe de l'url et que je valide dans la case Fichier HTML ça me dit ça comme erreur

Oui, le problème est surtout là :

Tu essayes de valider avec “Fichier HTML”, alors que tu as ajouté une balise meta dans index.html.

Ces deux méthodes sont différentes.

Ce qu’il faut faire
Dans Google Search Console :

retourne à l’écran de validation

ne choisis pas Fichier HTML

choisis Balise HTML

puis clique sur Valider

Pourquoi ça bloque
Fichier HTML = Google attend un fichier précis du type googlexxxxxxxx.html à la racine du site

Balise HTML = Google cherche la balise :

<meta name="google-site-verification" content="pIamQzQ5iRE0nkjNI5LLq9-__9l2YAtIsXLkrKevr18" />
dans le <head> de ton index.html

Or toi, tu as mis une balise, pas un fichier.

Pour ton URL
L’URL que tu colles doit être exactement celle du site, sans erreur.
Par exemple :

https://fiora-blotfhsh3-lotfinobl2005-2315s-projects.vercel.app
Tu peux enlever le slash final si tu veux, mais ce n’est pas ça le vrai souci ici.

Vérification rapide
Avant de cliquer sur Valider, fais ça :

ouvre ton site en ligne

clic droit

Afficher la source de la page

fais Ctrl + F

cherche :

google-site-verification
Si tu vois la balise dans le code source, alors il faut valider avec Balise HTML.

Si tu veux absolument utiliser “Fichier HTML”
Il faudrait :

télécharger le fichier donné par Google

le mettre dans public/

vérifier qu’il soit accessible avec une URL du type :

https://ton-site.vercel.app/googlexxxxxxxx.html
Mais dans ton cas, la bonne solution est juste :
reprendre la méthode “Balise HTML”.

Si tu veux, je peux te dire exactement sur quel bouton cliquer dans Search Console pour quitter “Fichier HTML” et passer à “Balise HTML”.



Ok là on a le vrai problème 👇

👉 Message clé :
“Votre site est introuvable”

Donc ce n’est PLUS un problème de balise
👉 c’est que Google n’arrive pas à accéder à ton site

🔍 Vérification ultra importante (fais ça maintenant)
👉 Copie ton URL et ouvre-la dans un nouvel onglet :

https://fiora-blotfhsh3-lotfinobl2005-2315s-projects.vercel.app
Dis-moi :
❌ page blanche ?

❌ erreur 404 ?

❌ site qui ne charge pas ?

✅ site qui marche ?

🧠 Le problème le plus probable
Tu utilises une URL temporaire de déploiement (celle avec plein de caractères)

👉 Celle-ci :

fiora-blotfhsh3-lotfinobl2005-2315s-projects.vercel.app
Google n’aime pas trop ça + parfois elle n’est pas stable.

✅ SOLUTION (très importante)
Utilise TON URL PRINCIPALE Vercel
Dans Vercel tu as une URL comme :

fiora-adc.vercel.app
👉 C’EST CELLE-CI qu’il faut mettre dans Google

⚡ Étapes exactes
Va sur Vercel

Clique sur ton projet

Cherche :

👉 Domains

Tu verras :

fiora-adc.vercel.app
🔥 Ensuite dans Google Search Console
👉 Supprime l’ancienne propriété (celle avec l’URL bizarre)

👉 Ajoute une nouvelle propriété :

https://fiora-adc.vercel.app
🔁 Puis recommence :
méthode = Balise HTML

tu as déjà la balise ✔

clique Valider

⚠️ Autre point critique
Après ton commit :

👉 Attends que Vercel ait fini de build
👉 Recharge ton site (Ctrl + F5)

✅ Résumé simple
Ton problème = mauvais URL

👉 ❌ URL de déploiement temporaire
👉 ✅ URL principale du projet

Si ça ne marche toujours pas
Envoie-moi :
👉 le lien que tu ouvres dans ton navigateur

Je te dis DIRECT si c’est le bon ou pas 👌


Image chargée
ils m'ont dit acceder je suis la 

Parfait 👌 là c’est réussi 🔥

👉 Tu es sur :

https://fiora-adc.vercel.app
👉 Et tu es dans Google Search Console
👉 Donc ton site est validé ✅

🎯 Ce que ça veut dire
✔ Google connaît ton site
✔ Tu as accès aux stats
✔ Tu peux demander l’indexation

⚠️ Pourquoi tu ne le vois pas encore sur Google
Parce que :

👉 Google n’a pas encore indexé ton site

Et c’est NORMAL.

🚀 Étape suivante (TRÈS IMPORTANT)
👉 Demander l’indexation manuellement
En haut de ton écran, tu as une barre :

Inspecter n'importe quelle URL de https://fiora-adc.vercel.app/
Fais ça :
colle ton URL complète :

https://fiora-adc.vercel.app
appuie sur Entrée

attends l’analyse

clique sur :

👉 “Demander une indexation”

⏱️ Après ça
ça peut prendre quelques heures à quelques jours

parfois 1 semaine

🔥 Pour maximiser tes chances
Ajoute ça dans ton index.html (si pas déjà fait) :

<meta name="description" content="Fiora ADC guide, build, runes, matchups, lane phase and strategy." />
<title>Fiora ADC Guide - Build, Runes, Matchups</title>
🧠 Important à comprendre
Même après indexation :

tu ne seras pas forcément 1er

Google classe selon :

contenu

popularité

mots-clés

🧩 Résumé
✔ ton site est validé
✔ prochaine étape = demander indexation
✔ ensuite = attendre

Si tu veux aller plus loin
Je peux t’aider à :

apparaître beaucoup plus vite sur Google

optimiser ton site SEO (titres, mots-clés, etc.)

ou même viser des recherches comme :
👉 “Fiora ADC build”

Dis-moi 👍


j'ai ça sur html : <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="google-site-verification"
      content="pIamQzQ5iRE0nkjNI5LLq9-__9l2YAtIsXLkrKevr18"

Faut le changer ?

Oui, il faut surtout fermer correctement la balise meta.

Là, ton extrait s’arrête à :

<meta
  name="google-site-verification"
  content="pIamQzQ5iRE0nkjNI5LLq9-__9l2YAtIsXLkrKevr18"
Il manque la fin :

/>
Donc mets ça :

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="google-site-verification"
      content="pIamQzQ5iRE0nkjNI5LLq9-__9l2YAtIsXLkrKevr18"
    />
    <title>Fiora ADC Guide</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
Tu peux aussi améliorer un peu avec :

<meta
  name="description"
  content="Fiora ADC guide with build, runes, matchups, lane phase, support tips, and mechanical advice."
/>
Donc version mieux :

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="google-site-verification"
      content="pIamQzQ5iRE0nkjNI5LLq9-__9l2YAtIsXLkrKevr18"
    />
    <meta
      name="description"
      content="Fiora ADC guide with build, runes, matchups, lane phase, support tips, and mechanical advice."
    />
    <title>Fiora ADC Guide | Build, Runes, Matchups</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
Donc :

ne change pas le code de vérification

ferme juste correctement la balise

et profite-en pour mettre un vrai title et une description



Parfait, là c’est pas une erreur grave du tout 👍

👉 “Quota dépassé” = Google te dit juste :
“tu as trop demandé d’indexations aujourd’hui”

🧠 Traduction simple
Tu as cliqué plusieurs fois sur :
👉 Demander une indexation

Et Google limite ça par jour.

✅ Ce que tu dois faire maintenant
👉 RIEN

Juste attendre.

⏱️ Combien de temps ?
généralement : 24h

parfois moins

❗ IMPORTANT
Ton site :

✅ est validé

✅ est connu par Google

❌ mais pas encore indexé (ou en cours)

🔥 Bonne nouvelle
Même sans refaire la demande :

👉 Google va quand même crawler ton site automatiquement

🚀 Ce que tu peux faire en attendant
1. Vérifie que ton site marche
ouvre :

https://fiora-adc.vercel.app
2. Vérifie que Google voit ton site
clic droit → afficher le code source
cherche :

google-site-verification
3. Améliore ton SEO (optionnel mais utile)
Dans ton index.html, assure-toi d’avoir :

<title>Fiora ADC Guide | Build, Runes, Matchups</title>

<meta name="description" content="Fiora ADC guide with build, runes, matchups, lane phase and strategy." />
📊 Quand ça marchera ?
Tu pourras tester :

site:fiora-adc.vercel.app
sur Google

👉 Si ton site apparaît → c’est bon

🧩 Résumé
erreur = normale

t’as juste trop cliqué

ton site est OK

attends 24h

Si tu veux aller plus loin
Je peux t’aider à :

apparaître sur Google beaucoup plus vite

optimiser ton site pour des recherches comme :
👉 “Fiora ADC build”
👉 “Fiora ADC guide”

Dis-moi 👍


si je donne le lien du site a quelqun de malveillant a quel point il peut remonter a moi tu peux faire une vraie inspecvtion

Bonne question — et tu fais bien de te la poser 👍

🧠 Réponse honnête
👉 Si quelqu’un a juste ton lien Vercel, il ne peut pas facilement remonter à toi personnellement.

Mais il peut trouver quelques infos techniques.

🔎 Ce qu’une personne peut voir
1. Le domaine
Ex :

fiora-adc.vercel.app
👉 Ça donne :

le nom du projet

le fait que tu utilises Vercel

❌ Pas ton identité réelle

2. Le code côté client
Quelqu’un peut :

ouvrir DevTools (F12)

voir ton JavaScript

voir tes appels Supabase

👉 Donc :
⚠️ Il verra :

ton URL Supabase

ta clé publique (anon key)

👉 MAIS :

c’est normal (clé publique)

elle est faite pour être visible

3. Les requêtes réseau
Il peut voir :

appels API

structure de ta DB (partiellement)

👉 Si tes règles Supabase sont mal faites :
⚠️ il pourrait spam tes votes

4. Ton GitHub (si public)
S’il trouve ton repo :

il peut voir ton code

ton pseudo GitHub

👉 mais pas forcément ton identité réelle

🔐 Ce qu’il NE peut PAS faire (normalement)
❌ connaître :

ton nom réel

ton adresse

ton IP personnelle

ton PC

❌ accéder à :

ton Vercel account

ta base Supabase (si règles OK)

⚠️ Les vrais risques
1. Spam des votes
Quelqu’un peut :

cliquer 1000 fois

manipuler ton compteur

👉 solution :

limiter 1 vote par utilisateur (localStorage ou IP)

2. Attaques sur Supabase
Si tes policies sont trop ouvertes :

👉 exemple dangereux :

using (true)
➡️ n’importe qui peut modifier les données

3. Reverse engineering
Quelqu’un peut :

comprendre ton code

copier ton site

🧠 Niveau de risque réel
👉 Ton site = faible risque perso

Mais :

moyen risque technique (spam / abuse)

🔒 Pour être tranquille
1. Vérifie Supabase
pas de clé secrète dans le code

seulement anon key ✔

2. Limite les votes
localStorage (facile)

ou système plus propre plus tard

3. Pas d’infos perso dans le code
pas ton mail

pas ton nom

🧩 Conclusion simple
👉 Donner ton lien :

pas dangereux pour toi personnellement

mais ton site peut être :

spam

manipulé

Si tu veux
Je peux te faire :

un système anti-spam propre

ou un système “1 vote par utilisateur réel”

👉 dis juste : “sécurise les votes”


toi tu peux simuler une personne qui veut realiser plusieurs votes ?

Oui — en mode test de sécurité, je peux t’expliquer comment ton système actuel peut être contourné et comment le durcir.

Avec ton système actuel, le blocage “un seul vote” repose surtout sur le navigateur du visiteur, donc une personne malveillante peut souvent revoter en :

vidant le localStorage

changeant de navigateur

passant en navigation privée

utilisant un autre appareil

Donc oui, plusieurs votes sont possibles si tu ne fais que bloquer côté front.

Le test le plus simple à faire toi-même :

voter une fois

ouvrir les outils développeur

aller dans le stockage local du site

supprimer la clé du vote

recharger la page

revoter

Si ça remarche, ton système est contournable.

Le plus important n’est pas de “bloquer parfaitement” tout de suite, mais d’ajouter une vraie protection côté serveur. Par exemple :

enregistrer un vote par identifiant anonyme

limiter par IP ou par empreinte légère

utiliser une table votes avec une contrainte d’unicité

faire l’écriture via une route serveur au lieu d’un simple update direct

Donc :

oui, je peux simuler la logique d’un abuseur

non, ton système actuel n’empêche pas vraiment plusieurs votes

La meilleure suite, c’est que je te montre comment transformer ton système actuel en vote plus résistant, sans tout refaire.


Mais tu peux voter toi automatiquement mtn ?

Non.

Je ne peux pas interagir moi-même avec ton site en direct comme un visiteur réel pour cliquer/voter automatiquement.

Je peux en revanche :

te dire si ton système actuel le permet techniquement

t’expliquer comment quelqu’un pourrait le faire

t’aider à le tester toi-même

t’aider à le sécuriser

Dans ton cas actuel, si le vote est protégé seulement par localStorage côté navigateur, alors oui, une personne pourrait probablement voter plusieurs fois, mais moi je ne vais pas aller voter automatiquement sur ton site.


j'ai utilisé sandbox supabase vercel github tu peux me dire aq uoi il a servi pour faire mon site

Oui. Voici à quoi chaque outil t’a servi :

GitHub
C’est l’endroit où ton code est stocké.
Tu y mets :

App.tsx

index.html

supabase.ts

tes fichiers public/

Quand tu modifies le code et que tu fais un commit, GitHub garde la nouvelle version.

Vercel
C’est ce qui prend ton code GitHub et le transforme en site en ligne.
Son rôle :

récupérer ton repo GitHub

installer les dépendances

build le projet React/Vite

publier ton site sur une URL comme fiora-adc.vercel.app

Donc Vercel = hébergement + déploiement.

Supabase
C’est ta base de données.
Tu l’as utilisée pour :

stocker les votes

garder les compteurs même après refresh

faire en sorte que tous les visiteurs voient les mêmes nombres

Donc Supabase = stockage persistant des données.

Sandbox
Dans ton cas, “sandbox” n’a pas servi à héberger ton vrai site public.
Ça sert surtout à :

tester

prototyper

essayer du code dans un environnement isolé

Ton vrai site public, lui, dépend surtout de GitHub + Vercel + Supabase.

En résumé très simple :

GitHub = là où ton code vit

Vercel = là où ton site est mis en ligne

Supabase = là où tes données sont enregistrées

Sandbox = zone de test

Si tu veux, je peux aussi te faire un schéma ultra simple de la chaîne complète :
toi → GitHub → Vercel → site public → Supabase.


c'est  possible en dessous de music off par exemple de rajouter un bouton play vers la droite et vers la gauche pour pouvoir changer de music et que chaque musique va faire changer le fond ?

Oui, c’est possible.

Tu peux faire :

un bouton ◀ pour musique précédente

un bouton ▶ pour musique suivante

et chaque musique peut changer :

le fond global

l’image hero

ou juste une couleur d’ambiance

Le plus simple est de lier chaque musique à un thème.

Idée
Tu remplaces ton système actuel basé seulement sur BACKGROUND_MUSIC_URLS par un tableau plus complet, par exemple :

const MUSIC_THEMES = [
  {
    title: "Come Home",
    audio: "/audio/come-home-sped-up.mp3",
    background:
      "radial-gradient(circle_at_top, rgba(255,0,60,0.15), transparent 34%), radial-gradient(circle_at_85%_18%, rgba(255,0,0,0.08), transparent 24%), linear-gradient(to_bottom, #040404, #0b0b0b, #040404)",
  },
  {
    title: "Track 2",
    audio: "/audio/track2.mp3",
    background:
      "radial-gradient(circle_at_top, rgba(80,0,255,0.16), transparent 34%), radial-gradient(circle_at_85%_18%, rgba(0,120,255,0.10), transparent 24%), linear-gradient(to_bottom, #02030a, #090b18, #02030a)",
  },
  {
    title: "Track 3",
    audio: "/audio/track3.mp3",
    background:
      "radial-gradient(circle_at_top, rgba(255,140,0,0.16), transparent 34%), radial-gradient(circle_at_85%_18%, rgba(255,220,0,0.10), transparent 24%), linear-gradient(to_bottom, #0a0502, #1a0d06, #0a0502)",
  },
] as const;
Ensuite
Tu gardes un index :

const [musicSrcIndex, setMusicSrcIndex] = useState(0);
et tu ajoutes deux fonctions :

const nextMusic = useCallback(() => {
  setMusicSrcIndex((i) => (i + 1) % MUSIC_THEMES.length);
}, []);

const prevMusic = useCallback(() => {
  setMusicSrcIndex((i) => (i - 1 + MUSIC_THEMES.length) % MUSIC_THEMES.length);
}, []);
Pour l’audio
Au lieu de :

src={BACKGROUND_MUSIC_URLS[musicSrcIndex]}
tu mets :

src={MUSIC_THEMES[musicSrcIndex].audio}
Pour le fond
Là où tu as ton fond global :

<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,60,0.15),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(255,0,0,0.08),transparent_24%),linear-gradient(to_bottom,#040404,#0b0b0b,#040404)]" />
tu peux le remplacer par :

<div
  className="absolute inset-0"
  style={{ background: MUSIC_THEMES[musicSrcIndex].background }}
/>
Et pour les boutons
Sous ton bouton Music OFF, tu peux ajouter :

<div className="flex items-center gap-2">
  <button
    onClick={prevMusic}
    className="rounded-xl border border-red-500/30 bg-black/40 px-3 py-2 text-xs text-white hover:bg-red-500/10"
  >
    ◀
  </button>

  <button
    onClick={nextMusic}
    className="rounded-xl border border-red-500/30 bg-black/40 px-3 py-2 text-xs text-white hover:bg-red-500/10"
  >
    ▶
  </button>
</div>
Donc oui
Techniquement c’est totalement faisable :

tu changes de musique

ça change aussi l’ambiance visuelle

Le mieux pour ton site
Je te conseille :

musique 1 → thème rouge/noir

musique 2 → thème violet/noir

musique 3 → thème or/noir

Comme ça ça reste stylé et lisible.

Je peux te redonner le code exact prêt à coller dans ton App.tsx, adapté à ton code actuel, sans que tu aies à deviner où mettre quoi.


le fond il peut etre dynamique ?

Oui.

Par fond dynamique, tu peux faire plusieurs niveaux :

1. Fond qui change selon la musique
Le plus simple :

musique 1 → fond rouge

musique 2 → fond violet

musique 3 → fond doré

Ça change quand tu changes de track.

2. Fond animé en continu
Tu peux faire un fond qui :

pulse

bouge lentement

change de lumière

fait dériver des halos

Par exemple avec :

framer-motion

ou juste CSS/Tailwind + animation custom

3. Fond réactif à la musique
Là c’est plus avancé :

le fond peut “vibrer”

grossir sur les basses

réagir au son

Mais ça demande analyser l’audio avec le navigateur (AudioContext, AnalyserNode), donc c’est plus technique.

Ce que je te conseille
Pour ton site, le meilleur rapport stylé / simple est :

fond dynamique animé

couleur différente selon la musique

Par exemple :

Track 1 → rouge/noir avec halo lent

Track 2 → violet/noir avec glow mouvant

Track 3 → orange/noir avec pulsation

Oui, concrètement
Ton fond actuel :

<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,60,0.15),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(255,0,0,0.08),transparent_24%),linear-gradient(to_bottom,#040404,#0b0b0b,#040404)]" />
peut devenir un fond dynamique avec motion.div, par exemple :

légère variation de scale

légère variation de opacity

déplacement doux du halo

Résultat
Oui, ton fond peut :

changer automatiquement avec la musique

bouger en continu

avoir un effet plus vivant

Important
Il faut rester mesuré, sinon :

le texte devient moins lisible

le site fait trop “gadget”

Pour ton style, un fond dynamique sobre mais agressif serait le mieux.

Je peux te donner un bloc prêt à coller pour un fond animé qui change selon la musique, compatible avec ton code actuel.


Si je te donne 3 musique en plus de celle qui est deja presente et le code du site tu peux faire ça ? 

Oui.
Si tu me donnes :

les 3 fichiers audio ou leurs noms exacts

le code du site (ou juste la partie App.tsx)

et si tu veux, le style de fond associé à chaque musique

je peux te préparer ça.

Je peux te faire :

boutons précédent / suivant

changement de musique

changement de fond dynamique selon la musique

garder le bouton Music ON/OFF

garder le slider de volume

faire en sorte que ce soit cohérent avec ton thème

Le plus pratique est que tu m’envoies :

les noms des 3 musiques

où elles sont placées dans public/audio

le code actuel si tu veux que je l’intègre directement proprement

Et si tu n’as pas d’idée pour les fonds, je peux aussi te proposer :

un fond rouge agressif

un fond violet dark

un fond or/orange intense

un fond bleu froid selon l’ambiance des musiques.


c'est quoi ça : <iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="175" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/fr/song/lilium-music-box-ii/1718631855"></iframe>

C’est un code d’intégration HTML pour afficher un lecteur Apple Music sur ton site.

En gros :

<iframe ...> = une fenêtre intégrée dans ta page

src="https://embed.music.apple.com/..." = le lecteur Apple Music chargé dedans

Donc si tu colles ça dans ton site, tu affiches un mini lecteur Apple Music directement sur la page.

À quoi servent les parties principales
iframe
Permet d’afficher un contenu externe dans ton site.

src="..."
C’est l’adresse du contenu à afficher. Ici, une musique Apple Music.

width / height / style
Contrôlent l’apparence :

largeur

hauteur

bords arrondis

allow="..."
Autorise certaines fonctions comme autoplay ou fullscreen.

sandbox="..."
Ajoute des restrictions de sécurité au contenu intégré.

En pratique
Si tu mets ce code dans ton JSX React, il faudra l’adapter un peu, parce que React n’aime pas certains noms HTML bruts.

Par exemple :

frameborder devient frameBorder

style="..." devient style={{ ... }}

Exemple version React
<iframe
  allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
  frameBorder="0"
  height="175"
  style={{
    width: "100%",
    maxWidth: "660px",
    overflow: "hidden",
    borderRadius: "10px",
  }}
  sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
  src="https://embed.music.apple.com/fr/song/lilium-music-box-ii/1718631855"
/>
Important
Ça ne veut pas dire que la musique devient ton fichier audio local.
Ça veut juste dire que ton site affiche un lecteur Apple Music externe.

Donc :

pratique pour embed un son

moins flexible que tes fichiers mp3 locaux

dépend d’Apple Music

Si ton but est de faire changer le fond selon la musique et gérer les boutons précédent/suivant, tes fichiers audio locaux sont mieux qu’un embed iframe.


voila je te mets les musiques  en fichier et le code du site :
🎵 1. LILIUM (Music Box II)
4

👉 Origine : thème de Elfen Lied → ambiance très marquée.

🎨 Ambiance
Mélancolique / tragique
Sacré / religieux (latin, chœurs)
Innocence + violence
💡 Background idéal
Personnage seul (blanc / rouge)
Cathédrale, vitraux, croix
Sang subtil (pas gore)
Tons : blanc + rouge + noir

👉 🔥 Pour ton site :
➡️ Fond lent + zoom léger + particules (genre poussière / lumière)

🎵 2. Sleaze On It – Mel 4ever & DEV
4

👉 Style musical : pop / électro / hyperpop un peu "dirty"

🎨 Ambiance
Club / nuit
Chaotique / sexy / provoc
Y2K / trash glam
💡 Background idéal
Néons roses / violets
Flash paparazzi
Filles stylées / attitude
Effet glitch / grain

👉 🔥 Pour ton site :
➡️ Background animé avec :

glitch léger
lumière clignotante
vibe “chaos contrôlé”
🎵 3. Love Sillage
4

(moins connue → analyse basée sur vibe sonore typique)

🎨 Ambiance
Love / rêve
Doux / nostalgique
Un peu “floating”
💡 Background idéal
Ciel rose/violet
Slow motion (fleurs, cheveux, vent)
Effet flou / glow

👉 🔥 Pour ton site :
➡️ Parfait pour une pause chill / safe vibe
➡️ Animation lente + blur + lumière douce

🎵 4. MARIONETA (sped up)
4
🎨 Ambiance
Contrôle / manipulation
Rapide / intense (sped up)
Dark + stylé
💡 Background idéal
Fils de marionnette
Mouvement rapide
Rouge / noir dominant
Style un peu dramatique

👉 🔥 Pour ton site :
➡️ Effet dynamique :

transitions rapides
zoom cuts
glitch ou shake léger

"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "./supabase";
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
          key={${src}-${index}}
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
          <div key={${it}-${i}} className="flex items-center gap-2">
            <img
              src={it}
              alt="item"
              className="h-12 w-12 rounded-lg border border-red-500/30 bg-black/40 object-cover"
              onError={(event) => recoverAssetImage(event, DEFAULT_ITEM_ICON)}
            />
            {i < items.length - 1 ? (
              <span className="text-red-300">→</span>
            ) : null}
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
              className="h-55 w-55 rounded-2xl border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]"
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
            alt={Fiora ${page}}
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
function ReportVoteBlock() {
  const [counts, setCounts] = useState({
    up: 0,
    down: 0,
    poop: 0,
  });

  const [selected, setSelected] = useState<"up" | "down" | "poop" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedVote = localStorage.getItem("report_vote_choice");
    if (savedVote === "up" || savedVote === "down" || savedVote === "poop") {
      setSelected(savedVote);
    }

    const loadVotes = async () => {
      const { data, error } = await supabase
        .from("report_votes")
        .select("option_key, count");

      if (error || !data) {
        console.error(error);
        return;
      }

      const next = { up: 0, down: 0, poop: 0 };

      for (const row of data) {
        if (row.option_key === "up") next.up = row.count;
        if (row.option_key === "down") next.down = row.count;
        if (row.option_key === "poop") next.poop = row.count;
      }

      setCounts(next);
    };

    void loadVotes();
  }, []);

  const handleVote = async (choice: "up" | "down" | "poop") => {
    if (loading || selected) return;

    setLoading(true);

    const currentValue = counts[choice];

    const { error } = await supabase
      .from("report_votes")
      .update({ count: currentValue + 1 })
      .eq("option_key", choice);

    if (!error) {
      setCounts((prev) => ({
        ...prev,
        [choice]: currentValue + 1,
      }));
      setSelected(choice);
      localStorage.setItem("report_vote_choice", choice);
    } else {
      console.error(error);
    }

    setLoading(false);
  };

const total = counts.up + counts.down + counts.poop;

return (
  <NeonCard className="p-4 md:p-5">
    <div className="space-y-3">
      <div>
        <p className="text-[20px] uppercase tracking-[0.24em] text-red-300">
          VOTE HERE
        </p>
        <h2 className="mt-1 text-[18px] font-black text-white md:text-[24px]">
          ARE YOU GOING TO REPORT ME? :3
        </h2>
        <p className="mt-1 text-[12px] text-white/65">
          Pick one only.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <button
          onClick={() => void handleVote("up")}
          disabled={!!selected || loading}
          className={rounded-xl border px-3 py-3 text-[13px] font-semibold transition ${
            selected === "up"
              ? "border-green-400/40 bg-green-500/15 text-green-200"
              : "border-white/15 bg-white/5 text-white hover:bg-white/10"
          } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
        >
          <div className="text-[18px]">⬆️</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.16em]">
            Up
          </div>
          <div className="mt-1 text-[15px]">{counts.up}</div>
        </button>

        <button
          onClick={() => void handleVote("down")}
          disabled={!!selected || loading}
          className={rounded-xl border px-3 py-3 text-[13px] font-semibold transition ${
            selected === "down"
              ? "border-red-400/40 bg-red-500/15 text-red-200"
              : "border-white/15 bg-white/5 text-white hover:bg-white/10"
          } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
        >
          <div className="text-[18px]">⬇️</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.16em]">
            Down
          </div>
          <div className="mt-1 text-[15px]">{counts.down}</div>
        </button>

        <button
          onClick={() => void handleVote("poop")}
          disabled={!!selected || loading}
          className={rounded-xl border px-3 py-3 text-[13px] font-semibold transition ${
            selected === "poop"
              ? "border-yellow-400/40 bg-yellow-500/15 text-yellow-200"
              : "border-white/15 bg-white/5 text-white hover:bg-white/10"
          } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}}
        >
          <div className="text-[18px]">💩</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.16em]">
            Poop
          </div>
          <div className="mt-1 text-[15px]">{counts.poop}</div>
        </button>
      </div>

      <p className="text-[11px] text-white/55">Total votes: {total}</p>

      {selected && (
        <p className="text-[11px] text-red-300">
          Your vote has been recorded.
        </p>
      )}
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
                {musicPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Music2 className="h-4 w-4" />
                )}
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
                    <ReportVoteBlock />
                    Fiora ADC, structured and aggressive.
                    <span className="block text-red-400">
                      SUPPORT CHECK BELOW <span className="text-white-300">☟</span>
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
                    value="Jewish Friendly ???"
                    text="Aggressive, smoking, stomp"
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
                  title="Why Fiora ADC Works ?"
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
                        className={w-full ${s.size} rounded-3xl border border-red-500/25 object-cover}
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


Réflexion durant 19s
Oui, je peux te le faire.
Et pour éviter de te casser tout le fichier, le mieux est de faire 4 remplacements précis dans ton App.tsx.

1. Remplace BACKGROUND_MUSIC_URLS par ça
Supprime :

const BACKGROUND_MUSIC_URLS = [
  "/audio/come-home-sped-up.mp3",
  "/audio/Jace%20June%20-%20Come%20Home%20(Sped%20Up).mp3",
  "/audio/Jace June - Come Home (Sped Up).mp3",
] as const;
et mets :

const MUSIC_THEMES = [
  {
    title: "Come Home",
    audio: "/audio/come-home-sped-up.mp3",
    mood: "red",
    background:
      "radial-gradient(circle at top, rgba(255,0,60,0.18), transparent 34%), radial-gradient(circle at 85% 18%, rgba(255,0,0,0.08), transparent 24%), linear-gradient(to bottom, #040404, #0b0b0b, #040404)",
    glow: "rgba(255,0,60,0.14)",
    particles: "rgba(255,120,120,0.09)",
  },
  {
    title: "LILIUM (Music Box II)",
    audio: "/audio/lilium-music-box-ii.mp3",
    mood: "lilium",
    background:
      "radial-gradient(circle at top, rgba(255,255,255,0.10), transparent 30%), radial-gradient(circle at 75% 15%, rgba(180,0,0,0.16), transparent 26%), linear-gradient(to bottom, #060606, #140707, #030303)",
    glow: "rgba(255,255,255,0.10)",
    particles: "rgba(255,255,255,0.08)",
  },
  {
    title: "Sleaze On It",
    audio: "/audio/sleaze-on-it.mp3",
    mood: "sleaze",
    background:
      "radial-gradient(circle at top, rgba(255,0,170,0.18), transparent 32%), radial-gradient(circle at 85% 18%, rgba(130,0,255,0.16), transparent 25%), linear-gradient(to bottom, #050308, #13051a, #040307)",
    glow: "rgba(255,0,200,0.16)",
    particles: "rgba(255,255,255,0.05)",
  },
  {
    title: "Love Sillage",
    audio: "/audio/love-sillage.mp3",
    mood: "love",
    background:
      "radial-gradient(circle at top, rgba(255,180,220,0.18), transparent 32%), radial-gradient(circle at 82% 18%, rgba(180,120,255,0.14), transparent 24%), linear-gradient(to bottom, #06050a, #100816, #040408)",
    glow: "rgba(255,180,220,0.14)",
    particles: "rgba(255,220,240,0.07)",
  },
  {
    title: "MARIONETA (sped up)",
    audio: "/audio/marioneta-sped-up.mp3",
    mood: "marioneta",
    background:
      "radial-gradient(circle at top, rgba(255,0,0,0.18), transparent 33%), radial-gradient(circle at 82% 18%, rgba(120,0,0,0.14), transparent 24%), linear-gradient(to bottom, #030303, #120404, #020202)",
    glow: "rgba(255,0,0,0.15)",
    particles: "rgba(255,80,80,0.08)",
  },
] as const;
Important
Tes fichiers audio dans public/audio/ doivent porter exactement ces noms :

come-home-sped-up.mp3

lilium-music-box-ii.mp3

sleaze-on-it.mp3

love-sillage.mp3

marioneta-sped-up.mp3

Si tes noms sont différents, change juste les chemins dans audio:.

2. Ajoute ces fonctions dans App()
Dans App(), juste après toggleBackgroundMusic, ajoute :

const nextMusic = useCallback(() => {
  setMusicSrcIndex((i) => (i + 1) % MUSIC_THEMES.length);
}, []);

const prevMusic = useCallback(() => {
  setMusicSrcIndex((i) => (i - 1 + MUSIC_THEMES.length) % MUSIC_THEMES.length);
}, []);

const currentTheme = MUSIC_THEMES[musicSrcIndex];
3. Remplace les endroits où tu utilises BACKGROUND_MUSIC_URLS
Dans la balise <audio />
Remplace :

src={BACKGROUND_MUSIC_URLS[musicSrcIndex]}
par :

src={MUSIC_THEMES[musicSrcIndex].audio}
Dans le onError
Remplace :

setMusicSrcIndex((i) =>
  i < BACKGROUND_MUSIC_URLS.length - 1 ? i + 1 : i
);
par :

setMusicSrcIndex((i) => (i < MUSIC_THEMES.length - 1 ? i + 1 : 0));
Dans le message “Current source”
Remplace :

{BACKGROUND_MUSIC_URLS[musicSrcIndex]}
par :

{MUSIC_THEMES[musicSrcIndex].title}
Dans le useEffect
Tu as :

useEffect(() => {
  if (musicSrcIndex > 0) {
    void playBackgroundMusic();
  }
}, [musicSrcIndex, playBackgroundMusic]);
Remplace par :

useEffect(() => {
  if (audioRef.current) {
    audioRef.current.load();
  }

  if (musicPlaying) {
    void playBackgroundMusic();
  }
}, [musicSrcIndex, musicPlaying, playBackgroundMusic]);
4. Remplace ton fond fixe par un fond dynamique
Supprime ces deux lignes :

<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,60,0.15),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(255,0,0,0.08),transparent_24%),linear-gradient(to_bottom,#040404,#0b0b0b,#040404)]" />
<div className="absolute left-1/2 top-0 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />
et mets à la place :

<motion.div
  key={currentTheme.title}
  className="absolute inset-0"
  initial={{ opacity: 0.75, scale: 1.03 }}
  animate={{
    opacity: [0.82, 1, 0.9, 1],
    scale: currentTheme.mood === "marioneta" ? [1, 1.025, 1] : [1, 1.015, 1],
  }}
  transition={{
    duration: currentTheme.mood === "marioneta" ? 4 : 10,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  style={{ background: currentTheme.background }}
/>

<motion.div
  className="absolute left-1/2 top-0 h-64 w-[38rem] -translate-x-1/2 rounded-full blur-3xl"
  animate={{
    opacity:
      currentTheme.mood === "sleaze"
        ? [0.2, 0.32, 0.18, 0.3]
        : currentTheme.mood === "marioneta"
        ? [0.14, 0.26, 0.12, 0.24]
        : [0.12, 0.2, 0.14, 0.18],
    scale:
      currentTheme.mood === "lilium"
        ? [1, 1.04, 1]
        : currentTheme.mood === "love"
        ? [1, 1.03, 1]
        : [1, 1.06, 1],
  }}
  transition={{
    duration: currentTheme.mood === "sleaze" ? 3.5 : 7,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  style={{ backgroundColor: currentTheme.glow }}
/>

<div className="pointer-events-none absolute inset-0 overflow-hidden">
  {Array.from({ length: 12 }).map((_, i) => (
    <motion.span
      key={i}
      className="absolute rounded-full blur-xl"
      style={{
        width: ${18 + i * 4}px,
        height: ${18 + i * 4}px,
        left: ${(i * 8) % 100}%,
        top: ${(i * 11) % 100}%,
        background: currentTheme.particles,
      }}
      animate={{
        y: currentTheme.mood === "marioneta" ? [0, -12, 0] : [0, -30, 0],
        x: currentTheme.mood === "sleaze" ? [0, 8, -6, 0] : [0, 4, 0],
        opacity:
          currentTheme.mood === "sleaze"
            ? [0.05, 0.18, 0.08]
            : [0.04, 0.14, 0.06],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: currentTheme.mood === "sleaze" ? 2.6 + i * 0.12 : 6 + i * 0.25,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  ))}
</div>
5. Ajoute les boutons précédent / suivant dans le header desktop
Dans cette zone :

<div className="hidden items-center gap-2 xl:flex">
remplace tout le bloc actuel par ça :

<div className="hidden items-center gap-2 xl:flex">
  <button
    onClick={prevMusic}
    className="rounded-xl border border-red-500/30 bg-black/40 px-3 py-2 text-xs text-white transition hover:bg-red-500/10"
    aria-label="Previous track"
  >
    ◀
  </button>

  <button
    onClick={() => void toggleBackgroundMusic()}
    className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-white transition hover:bg-red-500/15"
  >
    <span className="inline-flex items-center gap-2">
      {musicPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Music2 className="h-4 w-4" />
      )}
      {musicPlaying ? "Music ON" : "Music OFF"}
    </span>
  </button>

  <button
    onClick={nextMusic}
    className="rounded-xl border border-red-500/30 bg-black/40 px-3 py-2 text-xs text-white transition hover:bg-red-500/10"
    aria-label="Next track"
  >
    ▶
  </button>

  <div className="min-w-[120px] text-xs text-white/65">
    {currentTheme.title}
  </div>

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
6. Fais pareil pour le bloc mobile en bas à gauche
Remplace ce bloc :

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
par :

<div className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-2xl border border-red-500/35 bg-black/75 px-3 py-2 shadow-[0_0_18px_rgba(255,0,60,0.22)] backdrop-blur-xl xl:hidden">
  <button
    onClick={prevMusic}
    className="text-red-300"
    aria-label="Previous track"
  >
    ◀
  </button>

  <button
    onClick={() => void toggleBackgroundMusic()}
    className="text-red-300"
    aria-label="Toggle background music"
  >
    {musicPlaying ? <Pause className="h-5 w-5" /> : <Music2 className="h-5 w-5" />}
  </button>

  <button
    onClick={nextMusic}
    className="text-red-300"
    aria-label="Next track"
  >
    ▶
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
7. Deux petites corrections utiles dans ton code
A. Cette classe est fausse :
className="h-55 w-55 ..."
Tailwind ne connaît pas h-55 / w-55.
Remplace par par exemple :

className="h-[220px] w-[220px] rounded-2xl border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]"
B. Cette couleur est fausse :
text-white-300
Remplace par :

text-white
ou par exemple :

text-yellow-300
8. Ce que ça va faire
Après ça :

tu auras ◀ / ▶ pour changer de musique

le lecteur changera de piste

le fond changera automatiquement selon la musique

le fond sera animé :

doux et sacré pour LILIUM

glitch / néon pour Sleaze On It

slow dreamy pour Love Sillage

plus nerveux pour MARIONETA

rouge agressif pour Come Home

9. Important avant que ça marche
Vérifie bien que tes fichiers sont dans :

public/audio/
avec des noms exacts.

Si tu veux, au prochain message je peux te redonner la partie complète de App() déjà réécrite proprement avec ces modifs directement intégrées, pour que tu aies moins de copier-coller dispersé.


c'est a dire apres togglebackground music où ?

Oui, juste après le bloc complet toggleBackgroundMusic, avant le premier useEffect.

Dans ton screen, tu as ça :

const toggleBackgroundMusic = useCallback(async () => {
  if (musicPlaying) {
    pauseBackgroundMusic();
    return;
  }
  await playBackgroundMusic();
}, [musicPlaying, pauseBackgroundMusic, playBackgroundMusic]);
👉 C’est juste en dessous de ça que tu colles :

const nextMusic = useCallback(() => {
  setMusicSrcIndex((i) => (i + 1) % MUSIC_THEMES.length);
}, []);

const prevMusic = useCallback(() => {
  setMusicSrcIndex((i) => (i - 1 + MUSIC_THEMES.length) % MUSIC_THEMES.length);
}, []);

const currentTheme = MUSIC_THEMES[musicSrcIndex];
Donc l’ordre devient :
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

const nextMusic = useCallback(() => {
  setMusicSrcIndex((i) => (i + 1) % MUSIC_THEMES.length);
}, []);

const prevMusic = useCallback(() => {
  setMusicSrcIndex((i) => (i - 1 + MUSIC_THEMES.length) % MUSIC_THEMES.length);
}, []);

const currentTheme = MUSIC_THEMES[musicSrcIndex];

useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;
  audio.volume = musicVolume;
}, [musicVolume]);
En très simple
Tu colles :

après toggleBackgroundMusic

avant le premier useEffect

Si tu veux, je peux aussi te dire où remplacer précisément :

src={BACKGROUND_MUSIC_URLS[musicSrcIndex]}

le fond fixe

les boutons Music ON/OFF par ◀ ▶.


je viens de te donenr le code tu peux rajouter tout ça et me redonner ?

Oui.
Je te redonne une version déjà modifiée de la partie utile pour ajouter :

5 musiques

boutons précédent / suivant

fond dynamique selon la musique

titre de la musique affiché

boutons mobile aussi

Je te donne les blocs à remplacer dans ton fichier, sinon un message entier avec tout le fichier serait trop énorme et très risqué à recoller.

1. Remplace ton bloc BACKGROUND_MUSIC_URLS
Supprime ça :

const BACKGROUND_MUSIC_URLS = [
  "/audio/come-home-sped-up.mp3",
  "/audio/Jace%20June%20-%20Come%20Home%20(Sped%20Up).mp3",
  "/audio/Jace June - Come Home (Sped Up).mp3",
] as const;
et mets ça :

const MUSIC_THEMES = [
  {
    title: "Come Home",
    audio: "/audio/come-home-sped-up.mp3",
    mood: "red",
    background:
      "radial-gradient(circle at top, rgba(255,0,60,0.18), transparent 34%), radial-gradient(circle at 85% 18%, rgba(255,0,0,0.08), transparent 24%), linear-gradient(to bottom, #040404, #0b0b0b, #040404)",
    glow: "rgba(255,0,60,0.14)",
    particles: "rgba(255,120,120,0.09)",
  },
  {
    title: "LILIUM (Music Box II)",
    audio: "/audio/lilium-music-box-ii.mp3",
    mood: "lilium",
    background:
      "radial-gradient(circle at top, rgba(255,255,255,0.10), transparent 30%), radial-gradient(circle at 75% 15%, rgba(180,0,0,0.16), transparent 26%), linear-gradient(to bottom, #060606, #140707, #030303)",
    glow: "rgba(255,255,255,0.10)",
    particles: "rgba(255,255,255,0.08)",
  },
  {
    title: "Sleaze On It",
    audio: "/audio/sleaze-on-it.mp3",
    mood: "sleaze",
    background:
      "radial-gradient(circle at top, rgba(255,0,170,0.18), transparent 32%), radial-gradient(circle at 85% 18%, rgba(130,0,255,0.16), transparent 25%), linear-gradient(to bottom, #050308, #13051a, #040307)",
    glow: "rgba(255,0,200,0.16)",
    particles: "rgba(255,255,255,0.05)",
  },
  {
    title: "Love Sillage",
    audio: "/audio/love-sillage.mp3",
    mood: "love",
    background:
      "radial-gradient(circle at top, rgba(255,180,220,0.18), transparent 32%), radial-gradient(circle at 82% 18%, rgba(180,120,255,0.14), transparent 24%), linear-gradient(to bottom, #06050a, #100816, #040408)",
    glow: "rgba(255,180,220,0.14)",
    particles: "rgba(255,220,240,0.07)",
  },
  {
    title: "MARIONETA (sped up)",
    audio: "/audio/marioneta-sped-up.mp3",
    mood: "marioneta",
    background:
      "radial-gradient(circle at top, rgba(255,0,0,0.18), transparent 33%), radial-gradient(circle at 82% 18%, rgba(120,0,0,0.14), transparent 24%), linear-gradient(to bottom, #030303, #120404, #020202)",
    glow: "rgba(255,0,0,0.15)",
    particles: "rgba(255,80,80,0.08)",
  },
] as const;
2. Corrige l’image Netanyahu
Remplace :

className="h-55 w-55 rounded-2xl border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]"
par :

className="h-[220px] w-[220px] rounded-2xl border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]"
3. Dans App(), remplace toute la partie musique par celle-ci
Dans ton App(), garde :

const [musicPlaying, setMusicPlaying] = useState(false);
const [musicBlocked, setMusicBlocked] = useState(false);
const [musicVolume, setMusicVolume] = useState(0.06);
const [musicSrcIndex, setMusicSrcIndex] = useState(0);
const audioRef = useRef<HTMLAudioElement | null>(null);
Ensuite remplace tes fonctions musique par ça :

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

const nextMusic = useCallback(() => {
  setMusicSrcIndex((i) => (i + 1) % MUSIC_THEMES.length);
}, []);

const prevMusic = useCallback(() => {
  setMusicSrcIndex((i) => (i - 1 + MUSIC_THEMES.length) % MUSIC_THEMES.length);
}, []);

const currentTheme = MUSIC_THEMES[musicSrcIndex];

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
  if (audioRef.current) {
    audioRef.current.load();
  }

  if (musicPlaying) {
    void playBackgroundMusic();
  }
}, [musicSrcIndex, musicPlaying, playBackgroundMusic]);
4. Remplace le bloc <audio ... />
Supprime ton ancien bloc :

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
et mets :

<audio
  ref={audioRef}
  src={MUSIC_THEMES[musicSrcIndex].audio}
  loop
  preload="auto"
  onPlay={() => setMusicPlaying(true)}
  onPause={() => setMusicPlaying(false)}
  onCanPlay={() => setMusicBlocked(false)}
  onError={() => {
    setMusicPlaying(false);
    setMusicBlocked(true);
    setMusicSrcIndex((i) => (i < MUSIC_THEMES.length - 1 ? i + 1 : 0));
  }}
/>
5. Remplace le fond fixe par un fond dynamique
Supprime :

<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,60,0.15),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(255,0,0,0.08),transparent_24%),linear-gradient(to_bottom,#040404,#0b0b0b,#040404)]" />
<div className="absolute left-1/2 top-0 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />
et mets :

<motion.div
  key={currentTheme.title}
  className="absolute inset-0"
  initial={{ opacity: 0.75, scale: 1.03 }}
  animate={{
    opacity: [0.82, 1, 0.9, 1],
    scale: currentTheme.mood === "marioneta" ? [1, 1.025, 1] : [1, 1.015, 1],
  }}
  transition={{
    duration: currentTheme.mood === "marioneta" ? 4 : 10,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  style={{ background: currentTheme.background }}
/>

<motion.div
  className="absolute left-1/2 top-0 h-64 w-[38rem] -translate-x-1/2 rounded-full blur-3xl"
  animate={{
    opacity:
      currentTheme.mood === "sleaze"
        ? [0.2, 0.32, 0.18, 0.3]
        : currentTheme.mood === "marioneta"
        ? [0.14, 0.26, 0.12, 0.24]
        : [0.12, 0.2, 0.14, 0.18],
    scale:
      currentTheme.mood === "lilium"
        ? [1, 1.04, 1]
        : currentTheme.mood === "love"
        ? [1, 1.03, 1]
        : [1, 1.06, 1],
  }}
  transition={{
    duration: currentTheme.mood === "sleaze" ? 3.5 : 7,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  style={{ backgroundColor: currentTheme.glow }}
/>

<div className="pointer-events-none absolute inset-0 overflow-hidden">
  {Array.from({ length: 12 }).map((_, i) => (
    <motion.span
      key={i}
      className="absolute rounded-full blur-xl"
      style={{
        width: ${18 + i * 4}px,
        height: ${18 + i * 4}px,
        left: ${(i * 8) % 100}%,
        top: ${(i * 11) % 100}%,
        background: currentTheme.particles,
      }}
      animate={{
        y: currentTheme.mood === "marioneta" ? [0, -12, 0] : [0, -30, 0],
        x: currentTheme.mood === "sleaze" ? [0, 8, -6, 0] : [0, 4, 0],
        opacity:
          currentTheme.mood === "sleaze"
            ? [0.05, 0.18, 0.08]
            : [0.04, 0.14, 0.06],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: currentTheme.mood === "sleaze" ? 2.6 + i * 0.12 : 6 + i * 0.25,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  ))}
</div>
6. Remplace le bloc musique desktop du header
Trouve :

<div className="hidden items-center gap-2 xl:flex">
  <button
    onClick={() => void toggleBackgroundMusic()}
    className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-white transition hover:bg-red-500/15"
  >
    <span className="inline-flex items-center gap-2">
      {musicPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Music2 className="h-4 w-4" />
      )}
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
et remplace par :

<div className="hidden items-center gap-2 xl:flex">
  <button
    onClick={prevMusic}
    className="rounded-xl border border-red-500/30 bg-black/40 px-3 py-2 text-xs text-white transition hover:bg-red-500/10"
    aria-label="Previous track"
  >
    ◀
  </button>

  <button
    onClick={() => void toggleBackgroundMusic()}
    className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-white transition hover:bg-red-500/15"
  >
    <span className="inline-flex items-center gap-2">
      {musicPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Music2 className="h-4 w-4" />
      )}
      {musicPlaying ? "Music ON" : "Music OFF"}
    </span>
  </button>

  <button
    onClick={nextMusic}
    className="rounded-xl border border-red-500/30 bg-black/40 px-3 py-2 text-xs text-white transition hover:bg-red-500/10"
    aria-label="Next track"
  >
   

non je veux que tu  me donne tout le code d'un coup et je copie colle c'est clair ?


Réflexion durant 15s




Je te refais le fichier complet d’un coup, avec les boutons ◀ ▶, les 5 musiques, le fond dynamique selon la musique, et je corrige aussi les erreurs de syntaxe qui s’étaient glissées dans ton code.

Thought for 1m 5s
Voici le `App.tsx` complet, prêt à copier-coller. ```tsx "use client"; import React, { useCallback, useEffect, useMemo, useRef, useState, } from "react"; import { supabase } from "./supabase"; import { AnimatePresence, motion } from "framer-motion"; import { ArrowUp, ChevronRight, Crosshair, Flame, HeartHandshake, Menu, Music2, Pause, PlayCircle, Search, Shield, Sword, Target, Volume2, VolumeX, X, Zap, } from "lucide-react"; const pages = [ "Home", "Why Fiora ADC Works", "Runes", "Build", "Skill Order", "Matchups", "Lane Phase", "Fiora's Support", "Mid/Late Game", "Mechanical Tips", "Videos / Clips", ] as const; type PageName = (typeof pages)[number]; const MUSIC_THEMES = [ { title: "Come Home", audio: "/audio/come-home-sped-up.mp3", mood: "red", background: "radial-gradient(circle at top, rgba(255,0,60,0.18), transparent 34%), radial-gradient(circle at 85% 18%, rgba(255,0,0,0.08), transparent 24%), linear-gradient(to bottom, #040404, #0b0b0b, #040404)", glow: "rgba(255,0,60,0.14)", particles: "rgba(255,120,120,0.09)", }, { title: "LILIUM (Music Box II)", audio: "/audio/lilium-music-box-ii.mp3", mood: "lilium", background: "radial-gradient(circle at top, rgba(255,255,255,0.10), transparent 30%), radial-gradient(circle at 75% 15%, rgba(180,0,0,0.16), transparent 26%), linear-gradient(to bottom, #060606, #140707, #030303)", glow: "rgba(255,255,255,0.10)", particles: "rgba(255,255,255,0.08)", }, { title: "Sleaze On It", audio: "/audio/sleaze-on-it.mp3", mood: "sleaze", background: "radial-gradient(circle at top, rgba(255,0,170,0.18), transparent 32%), radial-gradient(circle at 85% 18%, rgba(130,0,255,0.16), transparent 25%), linear-gradient(to bottom, #050308, #13051a, #040307)", glow: "rgba(255,0,200,0.16)", particles: "rgba(255,255,255,0.05)", }, { title: "Love Sillage", audio: "/audio/love-sillage.mp3", mood: "love", background: "radial-gradient(circle at top, rgba(255,180,220,0.18), transparent 32%), radial-gradient(circle at 82% 18%, rgba(180,120,255,0.14), transparent 24%), linear-gradient(to bottom, #06050a, #100816, #040408)", glow: "rgba(255,180,220,0.14)", particles: "rgba(255,220,240,0.07)", }, { title: "MARIONETA (sped up)", audio: "/audio/marioneta-sped-up.mp3", mood: "marioneta", background: "radial-gradient(circle at top, rgba(255,0,0,0.18), transparent 33%), radial-gradient(circle at 82% 18%, rgba(120,0,0,0.14), transparent 24%), linear-gradient(to bottom, #030303, #120404, #020202)", glow: "rgba(255,0,0,0.15)", particles: "rgba(255,80,80,0.08)", }, ] as const; const HERO_CERTIFIED_IMAGE = "/netanyahu.png"; type NarrationEntry = { image: string; mood: string; summary: string; position?: string; }; const pageMeta: Record<PageName, NarrationEntry> = { Home: { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_0.jpg", mood: "Cold confidence", summary: "If top lane bores you, this guide turns Fiora ADC into a real plan instead of a random troll pick.", position: "center 22%", }, "Why Fiora ADC Works": { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_1.jpg", mood: "Calculated arrogance", summary: "This page explains why Fiora ADC creates pressure when enemies misjudge spacing, cooldowns, and all-in timing.", position: "center 24%", }, Runes: { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg", mood: "Precision", summary: "Your rune page changes how the lane starts: immediate burst or stronger mobility and chase comfort.", position: "center 24%", }, Build: { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_3.jpg", mood: "Methodical", summary: "The build follows the game state. Start with tempo and sustain, then choose burst, stability, or safety.", position: "78% center", }, "Skill Order": { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg", mood: "Discipline", summary: "Early skill points decide whether lane is only survivable or actually threatening.", position: "center 24%", }, Matchups: { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg", mood: "Analysis", summary: "Matchups are trends, not destiny. One first lead changes the whole lane dynamic.", position: "center 24%", }, "Lane Phase": { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg", mood: "Aggressive patience", summary: "Lane phase is about timing, brush control, level spikes, and waiting for one committed opening.", position: "62% center", }, "Fiora's Support": { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg", mood: "In sync", summary: "Fiora does not need random help. She needs clean access, protected entry, and coordinated timing.", position: "58% center", }, "Mid/Late Game": { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg", mood: "Clear-minded", summary: "After lane, pick one plan and execute it well: split, flank, pick, or group with intent.", position: "56% center", }, "Mechanical Tips": { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg", mood: "Demanding", summary: "Mechanics are not only speed. They are angle, timing, discipline, and confidence under pressure.", position: "60% center", }, "Videos / Clips": { image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg", mood: "Showy", summary: "Clips should teach setup and decisions, not just show flashy kills.", position: "center 24%", }, }; const pageSubtitle: Record<PageName, string> = { Home: "Fast draft read with a support-first priority.", "Why Fiora ADC Works": "Why the pick works when played with structure and intent.", Runes: "Two rune pages, two clear purposes.", Build: "Core route plus adaptations and finishing logic.", "Skill Order": "Early levels and simple baseline progression.", Matchups: "Trend-based reading with practical expectations.", "Lane Phase": "Key lane information without giant unreadable walls.", "Fiora's Support": "What support must actually do for Fiora ADC.", "Mid/Late Game": "How to convert lane advantage into game pressure.", "Mechanical Tips": "Short execution reminders before queue.", "Videos / Clips": "Space for examples, highlights, and teaching clips.", }; const voiceText: Record<PageName, string> = { Home: "Welcome to the Fiora ADC lab. This guide is built for players who want a real plan, a carry mindset, and a support-first draft read.", "Why Fiora ADC Works": "Fiora ADC works because she punishes bad spacing, panicked reactions, and bot lanes that do not understand her real all-in windows.", Runes: "Runes define your lane identity before the first trade begins. PTA for short burst windows, Phase Rush for mobility, cleaner access, and safer exits.", Build: "The build is not random. Start with Tiamat and Ravenous Hydra, then choose burst, stability, or defense depending on what the game demands.", "Skill Order": "Your early levels matter a lot. Q for access, E for burst timing, W for Riposte control and safer commits.", Matchups: "Treat matchups as trends. A hard lane can become playable if Fiora gets first lead, better tempo, or one strong support engage.", "Lane Phase": "Lane phase is patience plus violence. Manage HP, control brushes, respect level spikes, then commit completely when the opening is real.", "Fiora's Support": "Support sync is mandatory. Fiora wants a clean entry, vision support, and protection through the first committed action.", "Mid/Late Game": "After lane, pick one plan and commit to it. Splitting, flanking, or grouping all work, but random drifting wastes pressure.", "Mechanical Tips": "Good Fiora mechanics are not just fast fingers. They are calm timing, correct angles, and clean execution under pressure.", "Videos / Clips": "Use clips to study decisions, spacing, entry timing, and reset windows, not only the highlights.", }; type Matchup = { name: string; level: string; danger: string; image: string; position: string; explanation: string; }; const matchups: Matchup[] = [ { name: "Jhin", level: "Favorable", danger: "Medium", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Jhin_0.jpg", position: "center 24%", explanation: "Punishable if he oversteps and support setup is not clean. Good opening windows if you take initiative.", }, { name: "Jinx", level: "Favorable", danger: "Medium", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Jinx_0.jpg", position: "center 24%", explanation: "No dash means one catch can flip lane control quickly when wave and brush state are favorable.", }, { name: "Kai'Sa", level: "Playable", danger: "Medium", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Kaisa_0.jpg", position: "center 22%", explanation: "Volatile lane. Support timing and first all-in quality matter more than raw labels.", }, { name: "Ashe", level: "Difficult", danger: "High", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Ashe_0.jpg", position: "center 22%", explanation: "The slow breaks lane rhythm. You need cleaner HP discipline and more decisive engages.", }, { name: "Draven", level: "Difficult", danger: "High", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Draven_0.jpg", position: "center 20%", explanation: "If he gets tempo first, the lane becomes very punishing. Every trade needs clear purpose.", }, { name: "Caitlyn", level: "Difficult", danger: "High", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Caitlyn_0.jpg", position: "center 20%", explanation: "Range, traps, and push punish sloppy movement. Respect lane state, then punish overconfidence.", }, ]; const runeIcons = { pta: [ "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png", "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Triumph/Triumph.png", "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png", "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LastStand/LastStand.png", "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png", "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/JackOfAllTrades/JackOfAllTrades2.png", ], phase: [ "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png", "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/NimbusCloak/6361.png", "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png", "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png", "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png", "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LastStand/LastStand.png", ], }; const itemIcons = { tiamat: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3077.png", hydra: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3074.png", cyclosword: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/6699.png", triforce: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3078.png", eclipse: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/6692.png", dd: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/6333.png", iceborn: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/6662.png", maw: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3156.png", shojin: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3161.png", ga: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3026.png", bt: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3072.png", }; const supportProfiles = [ { name: "Alistar", role: "Hard engage", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Alistar_0.jpg", position: "center 18%", size: "h-72", text: "Excellent with Fiora ADC because he gives immediate access to target and creates very clear commit windows.", }, { name: "Braum", role: "Dive + peel", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Braum_0.jpg", position: "center 20%", size: "h-64", text: "A strong hybrid profile. He protects entry, stabilizes chaos, and still helps you commit when the opening is real.", }, { name: "Yuumi", role: "Sustain + scaling", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Yuumi_0.jpg", position: "center 28%", size: "h-52", text: "Special case. She gives healing, shielding, chase comfort, and extended pressure patterns once lane becomes survivable.", }, ] as const; const supportClips = [ { title: "Support Clip 1", description: "Opening timing and first engage window.", url: "https://youtu.be/ck-PQSpfRDY", embed: "https://www.youtube.com/embed/ck-PQSpfRDY", }, { title: "Support Clip 2", description: "Follow-up pressure after first trade.", url: "https://youtu.be/sTytoEHfY9w", embed: "https://www.youtube.com/embed/sTytoEHfY9w", }, { title: "Support Clip 3", description: "Positioning and setup around engage support.", url: "https://www.youtube.com/embed/4ASFCDwcHco", embed: "https://www.youtube.com/embed/4ASFCDwcHco", }, { title: "Support Clip 4", description: "Dive or cleanup sequence with support sync.", url: "https://youtu.be/rNob-ZD26Xs", embed: "https://www.youtube.com/embed/rNob-ZD26Xs", }, ] as const; const laneSections = [ { id: "early", title: "Early Lane", summary: "Preserve HP, track spikes, then punish the first real opening.", points: [ "Fiora ADC is short range, so losing HP for free is one of the fastest ways to lose lane control.", "Level 2 with Q then E can create surprising kill pressure, especially with PTA and support follow-up.", "At level 3, Riposte changes how confidently you can stand your ground if enemy CC has been identified.", ], }, { id: "wave", title: "Wave / Bush Control", summary: "Vision and brush state often decide whether your all-in is fake or real.", points: [ "Bush control creates hidden engage angles and can force panic spells from the enemy lane.", "If enemy Flash is burned, the next longer wave often becomes an excellent jungle punish timing.", "Into ranged lanes, preserve HP first and do not convert annoyance into random desperation trades.", ], }, { id: "support", title: "Support Sync", summary: "Support timing matters more here than on a standard ADC lane.", points: [ "Engage and hook supports are premium because they create direct target access for Fiora.", "After Ravenous Hydra, repeated pressure becomes easier because Fiora can sustain and re-enter more comfortably.", "Protective supports still work if the plan is survive lane, hold health, and spike later with cleaner entries.", ], }, { id: "matchups", title: "Matchup Trend", summary: "Treat labels as tendencies, not absolute truths.", points: [ "Favorable trends: Jhin, Jinx, Kai'Sa, Lucian, Senna, Sivir, Miss Fortune.", "Harder trends: Ashe, Draven, Kog'Maw, Varus, Vayne, Twitch, Caitlyn.", "Most lanes become far more playable once Fiora gets first lead, better tempo, or superior support timing.", ], }, ] as const; const DEFAULT_FIORA_IMAGE = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_0.jpg"; const DEFAULT_RUNE_ICON = "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png"; const DEFAULT_ITEM_ICON = "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3077.png"; function recoverImage( event: React.SyntheticEvent<HTMLImageElement>, fallback: string = DEFAULT_FIORA_IMAGE ) { const img = event.currentTarget; if (img.src !== fallback) { img.src = fallback; } } function recoverAssetImage( event: React.SyntheticEvent<HTMLImageElement>, fallback: string ) { const img = event.currentTarget; if (img.src !== fallback) { img.src = fallback; } } const mechanics = [ { title: "Spacing", content: "Threaten without overcommitting. Good spacing forces panic movement before you even press forward fully.", }, { title: "Riposte timing", content: "Parry the spell that actually decides the fight, not the first animation that looks scary.", }, { title: "Burst windows", content: "Commit when support sync, target access, and lane state all agree. Do not force half-openings.", }, { title: "Vital angle", content: "Use movement to create clean passive angles before full commitment whenever the lane allows it.", }, ] as const; function cn(...classes: Array<string | false | null | undefined>) { return classes.filter(Boolean).join(" "); } function NeonCard({ className = "", children, }: { className?: string; children: React.ReactNode; }) { return ( <div className={cn( "rounded-3xl border border-red-500/25 bg-white/[0.04] backdrop-blur-md shadow-[0_0_24px_rgba(255,0,60,0.12)]", className )} > {children} </div> ); } function SectionTitle({ icon: Icon, title, subtitle, }: { icon: React.ComponentType<{ className?: string }>; title: string; subtitle: string; }) { return ( <div className="space-y-3"> <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-red-200"> <Icon className="h-4 w-4" /> Section </div> <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl"> {title} </h2> <p className="max-w-3xl text-white/70">{subtitle}</p> </div> ); } function PageButton({ active, label, onClick, }: { active: boolean; label: string; onClick: () => void; }) { return ( <button onClick={onClick} className={cn( "rounded-xl border px-3 py-2 text-sm transition", active ? "border-red-500/40 bg-red-500/15 text-red-300" : "border-transparent text-white/75 hover:bg-white/5 hover:text-white" )} > {label} </button> ); } function StatCard({ label, value, text, }: { label: string; value: string; text: string; }) { return ( <NeonCard className="p-5"> <p className="text-sm uppercase tracking-[0.18em] text-red-300"> {label} </p> <p className="mt-2 text-lg font-bold text-white">{value}</p> <p className="mt-2 text-sm text-white/65">{text}</p> </NeonCard> ); } function IconRow({ icons }: { icons: string[] }) { return ( <div className="flex flex-wrap gap-3"> {icons.map((src, index) => ( <img key={`${src}-${index}`} src={src} alt="rune icon" className="h-14 w-14 rounded-xl border border-red-500/30 bg-black/50 object-cover" onError={(event) => recoverAssetImage(event, DEFAULT_RUNE_ICON)} /> ))} </div> ); } function ItemPath({ title, items, text, }: { title: string; items: string[]; text: string; }) { return ( <NeonCard className="p-5"> <p className="text-sm uppercase tracking-[0.16em] text-red-300"> {title} </p> <div className="mt-3 flex flex-wrap items-center gap-2"> {items.map((it, i) => ( <div key={`${it}-${i}`} className="flex items-center gap-2"> <img src={it} alt="item" className="h-12 w-12 rounded-lg border border-red-500/30 bg-black/40 object-cover" onError={(event) => recoverAssetImage(event, DEFAULT_ITEM_ICON)} /> {i < items.length - 1 ? ( <span className="text-red-300">→</span> ) : null} </div> ))} </div> <p className="mt-3 text-white/75">{text}</p> </NeonCard> ); } function HomeSupportShowcase() { const heroSupports = [ supportProfiles[0], supportProfiles[1], supportProfiles[2], ]; return ( <div className="hidden h-full lg:block"> <div className="flex h-full flex-col justify-between gap-4 p-6 md:p-8"> <div className="rounded-3xl border border-red-500/25 bg-black/25 p-5 backdrop-blur-sm"> <p className="text-xs uppercase tracking-[0.28em] text-red-300"> AUTO WIN </p> <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-red-200"> netanyahu certified </p> <div className="mt-4 flex items-start gap-4"> <img src={HERO_CERTIFIED_IMAGE} alt="Certified badge" className="h-[180px] w-[180px] rounded-2xl border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]" onError={(event) => recoverImage(event, DEFAULT_FIORA_IMAGE)} /> <div> <p className="text-lg font-black uppercase tracking-[0.08em] text-white"> Support shell </p> <p className="mt-3 max-w-[180px] text-sm text-white/65"> Alistar, Braum, and Yuumi are showcased here as the safest auto-win support core. </p> </div> </div> </div> <div className="grid gap-3"> {heroSupports.map((support) => ( <div key={support.name} className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-black/25 p-3 backdrop-blur-sm" > <img src={support.image} alt={support.name} className="h-20 w-20 rounded-2xl border border-red-500/25 object-cover" onError={(event) => recoverImage(event, DEFAULT_FIORA_IMAGE)} style={{ objectPosition: support.position }} /> <div> <p className="text-base font-bold text-white">{support.name}</p> <p className="text-xs uppercase tracking-[0.16em] text-red-300"> {support.role} </p> </div> </div> ))} </div> </div> </div> ); } function NarrationPanel({ page }: { page: PageName }) { const config = pageMeta[page]; const [auto, setAuto] = useState(true); const [speaking, setSpeaking] = useState(false); const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]); const [selectedVoice, setSelectedVoice] = useState(""); const [rate, setRate] = useState(0.92); const [pitch, setPitch] = useState(0.84); const [displayText, setDisplayText] = useState(voiceText[page]); const tickerRef = useRef<number | null>(null); const stop = useCallback(() => { if (tickerRef.current) { window.clearInterval(tickerRef.current); tickerRef.current = null; } if (typeof window !== "undefined" && "speechSynthesis" in window) { window.speechSynthesis.cancel(); } setSpeaking(false); setDisplayText(voiceText[page]); }, [page]); const speak = useCallback(() => { if (typeof window === "undefined" || !("speechSynthesis" in window)) { setDisplayText(voiceText[page]); setSpeaking(false); return; } stop(); const text = voiceText[page]; setDisplayText(""); const utterance = new SpeechSynthesisUtterance(text); const available = window.speechSynthesis.getVoices(); const chosen = available.find((v) => v.voiceURI === selectedVoice); const english = available.find((v) => v.lang.toLowerCase().startsWith("en") ); utterance.voice = chosen || english || null; utterance.lang = (chosen || english)?.lang || "en-US"; utterance.rate = rate; utterance.pitch = pitch; setSpeaking(true); let index = 0; tickerRef.current = window.setInterval(() => { index += 2; setDisplayText(text.slice(0, index)); if (index >= text.length && tickerRef.current) { window.clearInterval(tickerRef.current); tickerRef.current = null; } }, 18); utterance.onend = () => { if (tickerRef.current) { window.clearInterval(tickerRef.current); tickerRef.current = null; } setSpeaking(false); setDisplayText(text); }; utterance.onerror = () => { if (tickerRef.current) { window.clearInterval(tickerRef.current); tickerRef.current = null; } setSpeaking(false); setDisplayText(text); }; window.speechSynthesis.speak(utterance); }, [page, pitch, rate, selectedVoice, stop]); useEffect(() => { if (typeof window === "undefined" || !("speechSynthesis" in window)) { return undefined; } const loadVoices = () => { const list = window.speechSynthesis.getVoices(); setVoices(list); if (!selectedVoice && list.length) { const english = list.find((v) => v.lang.toLowerCase().startsWith("en")); setSelectedVoice((english || list[0]).voiceURI); } }; loadVoices(); window.speechSynthesis.onvoiceschanged = loadVoices; return () => { window.speechSynthesis.onvoiceschanged = null; stop(); }; }, [selectedVoice, stop]); useEffect(() => { setDisplayText(voiceText[page]); if (!auto) { stop(); return undefined; } const timer = window.setTimeout(() => speak(), 240); return () => window.clearTimeout(timer); }, [auto, page, speak, stop]); return ( <NeonCard className="overflow-hidden"> <div className="grid gap-0 lg:grid-cols-[320px_1fr]"> <div className="relative min-h-[300px] overflow-hidden bg-black/40"> <motion.img key={config.image} src={config.image} alt={`Fiora ${page}`} initial={{ opacity: 0.8, scale: 1.04 }} animate={{ opacity: 1, scale: 1, y: speaking ? [0, -4, 0, -2, 0] : [0, -1, 0], }} transition={{ duration: speaking ? 1.3 : 3, repeat: Infinity, ease: "easeInOut", }} className="absolute inset-0 h-full w-full object-cover" onError={(event) => recoverImage(event, DEFAULT_FIORA_IMAGE)} style={{ objectPosition: config.position || "center 14%" }} /> <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" /> <div className="absolute bottom-4 left-4 right-4"> <p className="text-xs uppercase tracking-[0.25em] text-red-300"> Fiora </p> <p className="mt-1 font-semibold text-white">{config.mood}</p> <div className="mt-3 flex items-center gap-2 text-xs text-white/65"> <span className={cn( "inline-block h-2.5 w-2.5 rounded-full", speaking ? "bg-red-400 shadow-[0_0_12px_rgba(255,0,60,0.55)]" : "bg-white/30" )} /> {speaking ? "Fiora is speaking" : "Fiora is waiting"} </div> </div> </div> <div className="space-y-4 bg-gradient-to-br from-white/[0.03] to-red-500/[0.08] p-6 md:p-8"> <div className="flex flex-wrap items-center gap-2"> <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200"> <span className="inline-block h-2 w-2 rounded-full bg-red-400" /> Fiora analysis </div> <button onClick={speak} className="rounded-full border border-red-500/30 bg-black/40 px-3 py-1.5 text-xs text-white hover:bg-red-500/10" > <span className="inline-flex items-center gap-2"> <Volume2 className="h-3.5 w-3.5" /> Speak </span> </button> <button onClick={stop} className="rounded-full border border-red-500/30 bg-black/40 px-3 py-1.5 text-xs text-white hover:bg-red-500/10" > <span className="inline-flex items-center gap-2"> <VolumeX className="h-3.5 w-3.5" /> Stop </span> </button> <button onClick={() => setAuto((v) => !v)} className={cn( "rounded-full border px-3 py-1.5 text-xs", auto ? "border-red-500/40 bg-red-500/10 text-red-200" : "border-white/15 bg-black/40 text-white" )} > Auto: {auto ? "ON" : "OFF"} </button> </div> <div className="grid gap-3 md:grid-cols-3"> <label className="flex flex-col gap-2 text-xs text-white/65"> Voice <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="rounded-xl border border-red-500/25 bg-black/45 px-3 py-2 text-sm text-white outline-none" > {voices .filter((v) => v.lang.toLowerCase().startsWith("en")) .map((v) => ( <option key={v.voiceURI} value={v.voiceURI}> {v.name} </option> ))} </select> </label> <label className="flex flex-col gap-2 text-xs text-white/65"> Rate: {rate.toFixed(2)} <input type="range" min="0.75" max="1.05" step="0.01" value={rate} onChange={(e) => setRate(Number(e.target.value))} /> </label> <label className="flex flex-col gap-2 text-xs text-white/65"> Pitch: {pitch.toFixed(2)} <input type="range" min="0.7" max="1.1" step="0.01" value={pitch} onChange={(e) => setPitch(Number(e.target.value))} /> </label> </div> <div className="relative rounded-[28px] border border-red-500/25 bg-black/35 p-5 shadow-[0_0_22px_rgba(255,0,60,0.12)] md:p-6"> <p className="min-h-[120px] text-lg leading-relaxed text-white md:text-xl"> {displayText} {speaking ? ( <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} className="ml-1 text-red-300" > ▋ </motion.span> ) : null} </p> <p className="mt-4 text-sm text-white/60">{config.summary}</p> </div> </div> </div> </NeonCard> ); } function ReportVoteBlock() { const [counts, setCounts] = useState({ up: 0, down: 0, poop: 0, }); const [selected, setSelected] = useState<"up" | "down" | "poop" | null>( null ); const [loading, setLoading] = useState(false); useEffect(() => { const savedVote = localStorage.getItem("report_vote_choice"); if (savedVote === "up" || savedVote === "down" || savedVote === "poop") { setSelected(savedVote); } const loadVotes = async () => { const { data, error } = await supabase .from("report_votes") .select("option_key, count"); if (error || !data) { console.error(error); return; } const next = { up: 0, down: 0, poop: 0 }; for (const row of data) { if (row.option_key === "up") next.up = row.count; if (row.option_key === "down") next.down = row.count; if (row.option_key === "poop") next.poop = row.count; } setCounts(next); }; void loadVotes(); }, []); const handleVote = async (choice: "up" | "down" | "poop") => { if (loading || selected) return; setLoading(true); const currentValue = counts[choice]; const { error } = await supabase .from("report_votes") .update({ count: currentValue + 1 }) .eq("option_key", choice); if (!error) { setCounts((prev) => ({ ...prev, [choice]: currentValue + 1, })); setSelected(choice); localStorage.setItem("report_vote_choice", choice); } else { console.error(error); } setLoading(false); }; const total = counts.up + counts.down + counts.poop; return ( <NeonCard className="p-4 md:p-5"> <div className="space-y-3"> <div> <p className="text-[20px] uppercase tracking-[0.24em] text-red-300"> VOTE HERE </p> <h2 className="mt-1 text-[18px] font-black text-white md:text-[24px]"> ARE YOU GOING TO REPORT ME? :3 </h2> <p className="mt-1 text-[12px] text-white/65">Pick one only.</p> </div> <div className="grid gap-2 sm:grid-cols-3"> <button onClick={() => void handleVote("up")} disabled={!!selected || loading} className={`rounded-xl border px-3 py-3 text-[13px] font-semibold transition ${ selected === "up" ? "border-green-400/40 bg-green-500/15 text-green-200" : "border-white/15 bg-white/5 text-white hover:bg-white/10" } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}`} > <div className="text-[18px]">⬆️</div> <div className="mt-1 text-[10px] uppercase tracking-[0.16em]"> Up </div> <div className="mt-1 text-[15px]">{counts.up}</div> </button> <button onClick={() => void handleVote("down")} disabled={!!selected || loading} className={`rounded-xl border px-3 py-3 text-[13px] font-semibold transition ${ selected === "down" ? "border-red-400/40 bg-red-500/15 text-red-200" : "border-white/15 bg-white/5 text-white hover:bg-white/10" } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}`} > <div className="text-[18px]">⬇️</div> <div className="mt-1 text-[10px] uppercase tracking-[0.16em]"> Down </div> <div className="mt-1 text-[15px]">{counts.down}</div> </button> <button onClick={() => void handleVote("poop")} disabled={!!selected || loading} className={`rounded-xl border px-3 py-3 text-[13px] font-semibold transition ${ selected === "poop" ? "border-yellow-400/40 bg-yellow-500/15 text-yellow-200" : "border-white/15 bg-white/5 text-white hover:bg-white/10" } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}`} > <div className="text-[18px]">💩</div> <div className="mt-1 text-[10px] uppercase tracking-[0.16em]"> Poop </div> <div className="mt-1 text-[15px]">{counts.poop}</div> </button> </div> <p className="text-[11px] text-white/55">Total votes: {total}</p> {selected && ( <p className="text-[11px] text-red-300"> Your vote has been recorded. </p> )} </div> </NeonCard> ); } export default function App() { const [currentPage, setCurrentPage] = useState<PageName>("Home"); const [mobileOpen, setMobileOpen] = useState(false); const [query, setQuery] = useState(""); const laneRefs = useRef<Record<string, HTMLDivElement | null>>({}); const [musicPlaying, setMusicPlaying] = useState(false); const [musicBlocked, setMusicBlocked] = useState(false); const [musicVolume, setMusicVolume] = useState(0.06); const [musicSrcIndex, setMusicSrcIndex] = useState(0); const audioRef = useRef<HTMLAudioElement | null>(null); const filteredPages = useMemo(() => { if (!query.trim()) return pages; return pages.filter((p) => p.toLowerCase().includes(query.toLowerCase())); }, [query]); const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" }); const playBackgroundMusic = useCallback(async () => { const audio = audioRef.current; if (!audio) return; try { audio.volume = musicVolume; audio.muted = false; await audio.play(); setMusicPlaying(true); setMusicBlocked(false); } catch { setMusicPlaying(false); setMusicBlocked(true); } }, [musicVolume]); const pauseBackgroundMusic = useCallback(() => { const audio = audioRef.current; if (!audio) return; audio.pause(); setMusicPlaying(false); }, []); const toggleBackgroundMusic = useCallback(async () => { if (musicPlaying) { pauseBackgroundMusic(); return; } await playBackgroundMusic(); }, [musicPlaying, pauseBackgroundMusic, playBackgroundMusic]); const nextMusic = useCallback(() => { setMusicSrcIndex((i) => (i + 1) % MUSIC_THEMES.length); }, []); const prevMusic = useCallback(() => { setMusicSrcIndex((i) => (i - 1 + MUSIC_THEMES.length) % MUSIC_THEMES.length); }, []); const currentTheme = MUSIC_THEMES[musicSrcIndex]; useEffect(() => { const audio = audioRef.current; if (!audio) return; audio.volume = musicVolume; }, [musicVolume]); useEffect(() => { const timer = window.setTimeout(() => { void playBackgroundMusic(); }, 300); return () => window.clearTimeout(timer); }, [playBackgroundMusic]); useEffect(() => { const unlock = () => { void playBackgroundMusic(); }; window.addEventListener("pointerdown", unlock, { once: true }); return () => window.removeEventListener("pointerdown", unlock); }, [playBackgroundMusic]); useEffect(() => { if (audioRef.current) { audioRef.current.load(); } if (musicPlaying) { void playBackgroundMusic(); } }, [musicSrcIndex, musicPlaying, playBackgroundMusic]); const goPage = (page: PageName) => { setCurrentPage(page); setMobileOpen(false); scrollTop(); }; const goLaneSection = (id: string) => { setCurrentPage("Lane Phase"); setTimeout(() => { laneRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start", }); }, 80); }; return ( <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white"> <audio ref={audioRef} src={MUSIC_THEMES[musicSrcIndex].audio} loop preload="auto" onPlay={() => setMusicPlaying(true)} onPause={() => setMusicPlaying(false)} onCanPlay={() => setMusicBlocked(false)} onError={() => { setMusicPlaying(false); setMusicBlocked(true); setMusicSrcIndex((i) => (i < MUSIC_THEMES.length - 1 ? i + 1 : 0)); }} /> <motion.div key={currentTheme.title} className="absolute inset-0" initial={{ opacity: 0.75, scale: 1.03 }} animate={{ opacity: [0.82, 1, 0.9, 1], scale: currentTheme.mood === "marioneta" ? [1, 1.025, 1] : [1, 1.015, 1], }} transition={{ duration: currentTheme.mood === "marioneta" ? 4 : 10, repeat: Infinity, ease: "easeInOut", }} style={{ background: currentTheme.background }} /> <motion.div className="absolute left-1/2 top-0 h-64 w-[38rem] -translate-x-1/2 rounded-full blur-3xl" animate={{ opacity: currentTheme.mood === "sleaze" ? [0.2, 0.32, 0.18, 0.3] : currentTheme.mood === "marioneta" ? [0.14, 0.26, 0.12, 0.24] : [0.12, 0.2, 0.14, 0.18], scale: currentTheme.mood === "lilium" ? [1, 1.04, 1] : currentTheme.mood === "love" ? [1, 1.03, 1] : [1, 1.06, 1], }} transition={{ duration: currentTheme.mood === "sleaze" ? 3.5 : 7, repeat: Infinity, ease: "easeInOut", }} style={{ backgroundColor: currentTheme.glow }} /> <div className="pointer-events-none absolute inset-0 overflow-hidden"> {Array.from({ length: 12 }).map((_, i) => ( <motion.span key={i} className="absolute rounded-full blur-xl" style={{ width: `${18 + i * 4}px`, height: `${18 + i * 4}px`, left: `${(i * 8) % 100}%`, top: `${(i * 11) % 100}%`, background: currentTheme.particles, }} animate={{ y: currentTheme.mood === "marioneta" ? [0, -12, 0] : [0, -30, 0], x: currentTheme.mood === "sleaze" ? [0, 8, -6, 0] : [0, 4, 0], opacity: currentTheme.mood === "sleaze" ? [0.05, 0.18, 0.08] : [0.04, 0.14, 0.06], scale: [1, 1.15, 1], }} transition={{ duration: currentTheme.mood === "sleaze" ? 2.6 + i * 0.12 : 6 + i * 0.25, repeat: Infinity, ease: "easeInOut", }} /> ))} </div> <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl"> <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6"> <div className="flex min-w-0 items-center gap-3"> <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-2 shadow-[0_0_18px_rgba(255,0,60,0.22)]"> <Sword className="h-5 w-5 text-red-400" /> </div> <div> <p className="text-sm font-black uppercase tracking-[0.18em]"> Fiora ADC </p> <p className="text-xs text-white/55">Hybrid final version</p> </div> </div> <nav className="hidden items-center gap-2 xl:flex"> {pages.map((page) => ( <PageButton key={page} label={page} active={currentPage === page} onClick={() => goPage(page)} /> ))} </nav> <div className="hidden items-center gap-2 xl:flex"> <button onClick={prevMusic} className="rounded-xl border border-red-500/30 bg-black/40 px-3 py-2 text-xs text-white transition hover:bg-red-500/10" aria-label="Previous track" > ◀ </button> <button onClick={() => void toggleBackgroundMusic()} className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-white transition hover:bg-red-500/15" > <span className="inline-flex items-center gap-2"> {musicPlaying ? ( <Pause className="h-4 w-4" /> ) : ( <Music2 className="h-4 w-4" /> )} {musicPlaying ? "Music ON" : "Music OFF"} </span> </button> <button onClick={nextMusic} className="rounded-xl border border-red-500/30 bg-black/40 px-3 py-2 text-xs text-white transition hover:bg-red-500/10" aria-label="Next track" > ▶ </button> <div className="min-w-[150px] text-xs text-white/65"> {currentTheme.title} </div> <div className="w-24"> <input type="range" min="0" max="0.5" step="0.01" value={musicVolume} onChange={(e) => setMusicVolume(Number(e.target.value))} /> </div> </div> <button className="rounded-xl border border-red-500/30 p-2 xl:hidden" onClick={() => setMobileOpen((v) => !v)} > {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />} </button> </div> <AnimatePresence> {mobileOpen && ( <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/10 xl:hidden" > <div className="flex flex-col gap-2 bg-black/85 px-4 pb-4 pt-3"> {pages.map((page) => ( <button key={page} onClick={() => goPage(page)} className={cn( "rounded-xl px-4 py-3 text-left", currentPage === page ? "bg-red-500/15 text-red-300" : "bg-white/5 text-white/80" )} > {page} </button> ))} </div> </motion.div> )} </AnimatePresence> </header> <main className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10"> {musicBlocked && ( <NeonCard className="p-4"> <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"> <div> <p className="text-sm font-semibold text-white"> Background music was blocked or file not found </p> <p className="text-sm text-white/65"> Click once to start sound. Current track: <span className="ml-1 text-red-300">{currentTheme.title}</span> </p> </div> <button onClick={() => void playBackgroundMusic()} className="rounded-2xl border border-red-400/40 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200" > Enable music </button> </div> </NeonCard> )} <NeonCard className="p-5 md:p-6"> <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"> <div> <p className="text-xs uppercase tracking-[0.24em] text-red-300"> Fiora ADC Guide </p> <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl"> {currentPage === "Home" ? ( <> Fiora ADC, structured and aggressive. <span className="block text-red-400"> SUPPORT CHECK BELOW{" "} <span className="text-yellow-300">☟</span> </span> </> ) : ( <> {currentPage} <span className="mt-1 block text-base font-medium text-white/70 md:text-lg"> {pageSubtitle[currentPage]} </span> </> )} </h1> </div> <div className="w-full lg:w-[360px]"> <div className="relative"> <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-300" /> <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search section" className="w-full rounded-2xl border border-red-500/25 bg-black/40 py-3 pl-10 pr-4 text-white placeholder:text-white/40" /> </div> {query && ( <div className="mt-3 flex flex-wrap gap-2"> {filteredPages.length ? ( filteredPages.map((page) => ( <button key={page} onClick={() => goPage(page)} className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-200" > {page} </button> )) ) : ( <span className="text-sm text-white/50">No result.</span> )} </div> )} </div> </div> </NeonCard> {currentPage === "Home" && <ReportVoteBlock />} {currentPage === "Home" && ( <NeonCard className="overflow-hidden"> <div className="grid lg:grid-cols-[1.15fr_0.85fr]"> <div className="relative min-h-[360px] overflow-hidden"> <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_8.jpg" alt="Aggressive Fiora" className="absolute inset-0 h-full w-full object-cover" onError={(event) => recoverImage(event)} style={{ objectPosition: "center 26%" }} /> <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent" /> <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8"> <div className="max-w-3xl rounded-3xl border border-red-500/20 bg-black/35 p-5 backdrop-blur-sm md:p-6"> <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-300"> Draft priority </p> <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl"> ARE YOU THE SUPPORT? <br /> CLICK HERE BEFORE I REPORT YOU </h2> <p className="mt-4 max-w-2xl text-white/75"> Support first read: engage timing, lane sync, wave pressure, brush control, and when Fiora can truly commit. </p> <div className="mt-6 flex flex-wrap gap-3"> <button onClick={() => goPage("Fiora's Support")} className="rounded-2xl border border-red-400/40 bg-red-500/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-red-200 transition hover:scale-[1.02] hover:bg-red-500/20" > Go to Fiora's Support </button> <button onClick={() => goLaneSection("support")} className="rounded-2xl border border-white/25 bg-black/45 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/90 transition hover:bg-white/10" > Open Lane Phase - Support </button> </div> </div> </div> </div> <HomeSupportShowcase /> </div> </NeonCard> )} <NarrationPanel page={currentPage} /> <AnimatePresence mode="wait"> <motion.div key={currentPage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-6" > {currentPage === "Home" && ( <> <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"> <StatCard label="Identity" value="Black / neon red / white" text="Aggressive visual language with strong contrast and draft readability." /> <StatCard label="Tone" value="Carry mindset" text="Direct, niche, practical, and built around pressure instead of autopilot." /> <StatCard label="Positioning" value="Technical pocket pick" text="Not random troll value. The guide frames it as a real structured strategy." /> <StatCard label="Use" value="Fast draft read" text="Support-first entry points make the site useful before lane even starts." /> </div> <NeonCard className="p-6 md:p-8"> <SectionTitle icon={Flame} title="Welcome to the Fiora ADC lab" subtitle="This version keeps the strongest personality cues but organizes them like a real final site: cleaner hierarchy, clearer pages, and faster access to what matters in draft." /> <div className="mt-6 grid gap-4 md:grid-cols-3"> <div className="rounded-2xl border border-white/10 bg-white/5 p-4"> <p className="text-sm text-red-300">Support-first</p> <p className="mt-2 text-white/75"> The most important lane partner information is pushed forward immediately. </p> </div> <div className="rounded-2xl border border-white/10 bg-white/5 p-4"> <p className="text-sm text-red-300">Guide structure</p> <p className="mt-2 text-white/75"> Runes, build, lane phase, support, mid-game, mechanics, and video sections all share one visual system. </p> </div> <div className="rounded-2xl border border-white/10 bg-white/5 p-4"> <p className="text-sm text-red-300">Personality</p> <p className="mt-2 text-white/75"> The site still feels like Fiora: sharp, confident, and slightly disrespectful in the right way. </p> </div> </div> </NeonCard> </> )} {currentPage === "Why Fiora ADC Works" && ( <> <SectionTitle icon={Target} title="Why Fiora ADC Works" subtitle="Same concept, cleaner presentation: fewer walls of text, more cards that are readable during draft or quick review." /> <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"> <NeonCard className="p-6"> <div className="mb-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-red-200"> Core concept </div> <h3 className="text-2xl font-black text-white md:text-3xl"> You win by forcing bad spacing and panic decisions </h3> <p className="mt-4 text-white/75"> Fiora ADC is not standard marksman flow. The pick works when you control timing, punish wrong movement, and convert enemy missteps into short, committed all-ins. </p> <p className="mt-4 text-white/75"> It is a technical choice, not a universal blind answer. But in the right structure, it creates discomfort that many bot lanes are not prepared to answer correctly. </p> </NeonCard> <NeonCard className="overflow-hidden p-3"> <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg" alt="Fiora visual" className="h-[260px] w-full rounded-2xl border border-red-500/25 object-cover" onError={(event) => recoverImage(event)} style={{ objectPosition: "center 26%" }} /> </NeonCard> </div> <div className="grid gap-4 md:grid-cols-2"> {[ [ "Surprise factor", "Most bot lanes do not know Fiora ADC limits and overtrade at the wrong moments.", ], [ "Duel pressure", "One clean opening can flip lane state even when the matchup looked uncomfortable on paper.", ], [ "Execution edge", "Riposte timing plus support sync creates disproportionate value off one enemy mistake.", ], [ "Snowball conversion", "First lead gives wave tempo, objective setup, and much freer lane movement.", ], ].map(([title, text]) => ( <NeonCard key={title} className="p-5"> <p className="text-lg font-bold text-white">{title}</p> <p className="mt-2 text-white/70">{text}</p> </NeonCard> ))} </div> </> )} {currentPage === "Runes" && ( <> <SectionTitle icon={Zap} title="Runes" subtitle="Explained setup choices with icon rows, practical logic, and clean side-by-side comparison." /> <div className="grid gap-4 xl:grid-cols-2"> <NeonCard className="space-y-4 p-5"> <p className="text-sm uppercase tracking-[0.16em] text-red-300"> PTA PAGE </p> <IconRow icons={runeIcons.pta} /> <div className="space-y-2 text-white/75"> <p> <span className="font-semibold text-white">Why PTA:</span>{" "} burst profile, short trades, and better punishment against fragile ADCs. </p> <p> <span className="font-semibold text-white"> Secondary logic: </span>{" "} Biscuits and Jack help survive lane and add long-term value in awkward matchups. </p> <p> <span className="font-semibold text-white">Mini runes:</span>{" "} Adaptive Force, Adaptive Force, Heal. </p> </div> </NeonCard> <NeonCard className="space-y-4 p-5"> <p className="text-sm uppercase tracking-[0.16em] text-red-300"> PHASE RUSH PAGE </p> <IconRow icons={runeIcons.phase} /> <div className="space-y-2 text-white/75"> <p> <span className="font-semibold text-white"> Why Phase Rush: </span>{" "} easier gap close, cleaner disengage, and better access against mobile or hard-to-reach lanes. </p> <p> <span className="font-semibold text-white"> Damage profile: </span>{" "} Absolute Focus and Last Stand keep the page threatening at different HP states. </p> <p> <span className="font-semibold text-white">Mini runes:</span>{" "} Adaptive Force, Attack Speed, Scaling Heal. </p> </div> </NeonCard> </div> </> )} {currentPage === "Build" && ( <> <SectionTitle icon={Shield} title="Build" subtitle="Complete routes with icons and explicit conditions, but still quick to scan." /> <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"> <ItemPath title="Core route" items={[itemIcons.tiamat, itemIcons.hydra]} text="Rush Tiamat then Ravenous Hydra for lane comfort, sustain, wave control, and faster map tempo." /> <ItemPath title="Snowball route" items={[itemIcons.hydra, itemIcons.cyclosword]} text="Take this when you can reach target reliably and kill before getting burst down." /> <ItemPath title="Stable route" items={[itemIcons.hydra, itemIcons.triforce]} text="A steadier profile when enemy damage makes pure glass-cannon play too risky." /> <ItemPath title="Safe burst route" items={[itemIcons.hydra, itemIcons.eclipse]} text="Shield plus burst when you need safer entries and a less greedy second item." /> <ItemPath title="Defensive adaptation" items={[itemIcons.dd, itemIcons.maw, itemIcons.iceborn]} text="DD for heavy AD, Maw for AP threat, Iceborn as a niche durability option." /> <ItemPath title="Late finish" items={[itemIcons.shojin, itemIcons.ga, itemIcons.bt]} text="Shojin for pressure, GA for safety, BT for final damage and sustain finish." /> </div> </> )} {currentPage === "Skill Order" && ( <> <SectionTitle icon={Crosshair} title="Skill Order" subtitle="Current practical baseline with a clearer final-site presentation." /> <div className="grid gap-4 md:grid-cols-3"> {[ [ "Level 1", "Q for access, repositioning, and creating your first real angle.", ], [ "Level 2", "E for burst timing, especially when PTA trade windows already look possible.", ], [ "Level 3", "W for Riposte control, CC answer, and far safer commitment.", ], ].map(([title, text]) => ( <NeonCard key={title} className="p-5"> <p className="text-lg font-bold text-white">{title}</p> <p className="mt-2 text-white/70">{text}</p> </NeonCard> ))} </div> </> )} {currentPage === "Matchups" && ( <> <SectionTitle icon={Sword} title="Matchups" subtitle="Readable matchup cards with practical notes and stronger visual framing." /> <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"> {matchups.map((m) => ( <NeonCard key={m.name} className="overflow-hidden p-4 transition hover:-translate-y-1" > <img src={m.image} alt={m.name} className="h-44 w-full rounded-2xl border border-red-500/25 object-cover" onError={(event) => recoverImage(event)} style={{ objectPosition: m.position }} /> <div className="mt-4 flex items-center justify-between"> <p className="text-xl font-bold text-white">{m.name}</p> <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200"> {m.danger} </span> </div> <p className="mt-1 text-sm text-red-300">{m.level}</p> <p className="mt-3 text-white/70">{m.explanation}</p> </NeonCard> ))} </div> </> )} {currentPage === "Lane Phase" && ( <> <SectionTitle icon={Target} title="Lane Phase" subtitle="The best compromise: fast jump buttons plus full sections visible on scroll, without forcing tab-switching to read the guide." /> <div className="flex flex-wrap gap-2"> {laneSections.map((section) => ( <button key={section.id} onClick={() => laneRefs.current[section.id]?.scrollIntoView({ behavior: "smooth", block: "start", }) } className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200" > {section.title} </button> ))} </div> <div className="grid gap-4 md:grid-cols-3"> <StatCard label="Primary goal" value="Preserve HP" text="Do not waste health before the real engage window exists." /> <StatCard label="First spikes" value="Level 2 and 3" text="Q/E pressure first, Riposte confidence second." /> <StatCard label="Vision rule" value="Ward first" text="Control the lane space before converting into aggression." /> </div> <div className="space-y-4"> {laneSections.map((section) => ( <NeonCard key={section.id} className="p-6"> <div ref={(el) => { laneRefs.current[section.id] = el; }} className="scroll-mt-28" > <p className="text-xs uppercase tracking-[0.2em] text-red-300"> Quick read </p> <h3 className="mt-2 text-2xl font-black text-white"> {section.title} </h3> <p className="mt-3 text-white/70">{section.summary}</p> <div className="mt-5 grid gap-4 md:grid-cols-3"> {section.points.map((point) => ( <div key={point} className="rounded-2xl border border-red-500/20 bg-black/35 p-4 text-white/75" > {point} </div> ))} </div> </div> </NeonCard> ))} </div> </> )} {currentPage === "Fiora's Support" && ( <> <SectionTitle icon={HeartHandshake} title="Fiora's Support" subtitle="Global support logic, profile details, and direct connection to lane-phase reading." /> <NeonCard className="p-6"> <p className="text-xs uppercase tracking-[0.2em] text-red-300"> Mandatory read </p> <h3 className="mt-2 text-2xl font-black text-white"> Supports must read Lane Phase too </h3> <p className="mt-3 max-w-3xl text-white/75"> This page explains support priorities, but lane execution details still live in Lane Phase. Read both to avoid desynced engages and fake all-ins. </p> <div className="mt-5 flex flex-wrap gap-3"> <button onClick={() => goLaneSection("early")} className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200" > Read Lane Phase: Early </button> <button onClick={() => goLaneSection("wave")} className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200" > Read Lane Phase: Wave </button> <button onClick={() => goLaneSection("support")} className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200" > Read Lane Phase: Support </button> </div> </NeonCard> <div className="grid items-end gap-4 md:grid-cols-2 xl:grid-cols-3"> {supportProfiles.map((s) => ( <NeonCard key={s.name} className="p-4"> <img src={s.image} alt={s.name} className={cn( "w-full rounded-3xl border border-red-500/25 object-cover", s.size )} onError={(event) => recoverImage(event)} style={{ objectPosition: s.position }} /> <p className="mt-3 text-xl font-bold text-white">{s.name}</p> <p className="text-sm text-red-300">{s.role}</p> <p className="mt-3 text-white/75">{s.text}</p> </NeonCard> ))} </div> <div className="grid gap-4 xl:grid-cols-3"> <NeonCard className="p-5"> <p className="mb-2 font-semibold text-red-300">Engage / hook</p> <p className="text-white/75"> Supports that create direct access are premium, because Fiora wins hardest when the target cannot freely kite the first commit. </p> </NeonCard> <NeonCard className="p-5"> <p className="mb-2 font-semibold text-red-300">Hydra timing</p> <p className="text-white/75"> Once Ravenous Hydra is completed, repeated pressure becomes easier because Fiora can sustain, reset, and re-enter faster. </p> </NeonCard> <NeonCard className="p-5"> <p className="mb-2 font-semibold text-red-300"> Protective supports </p> <p className="text-white/75"> They still work when the goal is to survive lane, keep HP high, and unlock later spikes with cleaner entries. </p> </NeonCard> </div> <SectionTitle icon={PlayCircle} title="Support Clips" subtitle="Integrated examples for support behavior around Fiora ADC." /> <div className="grid gap-4 md:grid-cols-2"> {supportClips.map((clip) => ( <NeonCard key={clip.url} className="overflow-hidden p-4"> <div className="overflow-hidden rounded-2xl border border-red-500/20 bg-black"> <iframe src={clip.embed} title={clip.title} className="h-72 w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> </div> <div className="mt-3"> <p className="font-semibold text-white">{clip.title}</p> <p className="mt-1 text-sm text-white/65"> {clip.description} </p> <a href={clip.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-200" > Open on YouTube </a> </div> </NeonCard> ))} </div> </> )} {currentPage === "Mid/Late Game" && ( <> <SectionTitle icon={Flame} title="Mid / Late Game" subtitle="Macro priorities in cards, without another giant paragraph block." /> <div className="grid gap-4 md:grid-cols-3"> {[ [ "Pick one plan", "Split, flank, pick, or group. Do not mix all plans at once.", ], [ "Entry timing", "Fight after vision and cooldown checks, not just because enemies are visible.", ], [ "Conversion", "Every successful fight should become objective pressure, tempo, or map space.", ], ].map(([title, text]) => ( <NeonCard key={title} className="p-5"> <p className="font-bold text-white">{title}</p> <p className="mt-2 text-white/70">{text}</p> </NeonCard> ))} </div> <NeonCard className="p-6"> <div className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-red-300"> Add later <ChevronRight className="h-4 w-4" /> Side pressure / vision setup / fight entry rules </div> </NeonCard> </> )} {currentPage === "Mechanical Tips" && ( <> <SectionTitle icon={Zap} title="Mechanical Tips" subtitle="Short tactical notes instead of bloated explanation blocks." /> <div className="grid gap-4 md:grid-cols-2"> {mechanics.map((item) => ( <NeonCard key={item.title} className="p-5"> <p className="font-bold text-white">{item.title}</p> <p className="mt-2 text-white/70">{item.content}</p> </NeonCard> ))} </div> </> )} {currentPage === "Videos / Clips" && ( <> <SectionTitle icon={PlayCircle} title="Videos / Clips" subtitle="Visual section ready for future highlight and teaching clip expansion." /> <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"> {[ { title: "Duel highlight", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg", pos: "center 24%", }, { title: "Timing sample", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg", pos: "center 24%", }, { title: "Carry sequence", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_7.jpg", pos: "center 25%", }, ].map((v) => ( <NeonCard key={v.title} className="overflow-hidden p-4"> <img src={v.image} alt={v.title} className="h-56 w-full rounded-2xl border border-red-500/25 object-cover" onError={(event) => recoverImage(event)} style={{ objectPosition: v.pos }} /> <p className="mt-3 font-semibold text-white">{v.title}</p> <p className="mt-1 text-sm text-white/65"> Reserved for your next clip and explanation block. </p> </NeonCard> ))} </div> </> )} </motion.div> </AnimatePresence> </main> <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-2xl border border-red-500/35 bg-black/75 px-3 py-2 shadow-[0_0_18px_rgba(255,0,60,0.22)] backdrop-blur-xl xl:hidden"> <button onClick={prevMusic} className="text-red-300" aria-label="Previous track" > ◀ </button> <button onClick={() => void toggleBackgroundMusic()} className="text-red-300" aria-label="Toggle background music" > {musicPlaying ? <Pause className="h-5 w-5" /> : <Music2 className="h-5 w-5" />} </button> <button onClick={nextMusic} className="text-red-300" aria-label="Next track" > ▶ </button> <input type="range" min="0" max="0.5" step="0.01" value={musicVolume} onChange={(e) => setMusicVolume(Number(e.target.value))} className="w-20" /> </div> <button onClick={scrollTop} className="fixed bottom-5 right-5 z-50 rounded-full border border-red-500/40 bg-black/70 p-3 text-red-300 shadow-[0_0_18px_rgba(255,0,60,0.25)]" aria-label="Back to top" > <ArrowUp className="h-5 w-5" /> </button> </div> ); } ``` Mets bien tes fichiers dans `public/audio/` avec exactement ces noms : `come-home-sped-up.mp3` `lilium-music-box-ii.mp3` `sleaze-on-it.mp3` `love-sillage.mp3` `marioneta-sped-up.mp3` Si tu veux, je peux ensuite te redonner aussi le `index.html` propre pour ton SEO Google, en version prête à copier-coller.

genere le en canva

Je te le mets dans le canvas directement.

Thought for 9s
C’est fait dans le canvas.


Image chargée
Image chargée
plusieurs probleme le fond n'est pas dynamique et ne correspond a mes attentes enoncées 
a chaque fois qu'on change de musique on doit re appuyer sur play moi je veux que lance directement sur play
ce que je t'ai mis en piece jointe" Fiora ADC, structured and aggressive. 
SUPPORT CHECK BELOW ☟ 
VOTE HERE

ARE YOU GOING TO REPORT ME? :3
Pick one only.


⬆️
Up
3

⬇️
Down
2

💩
Poop
4
Total votes: 9

Your vote has been recorded."

faut que ça soit dans un seul bloic et le Home tout en haut a gauche est mal positionné

Thought for 24s
Fiora Adc App Canvas
· typescript
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "./supabase";
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

const MUSIC_THEMES = [
  {
    title: "Come Home",
    audio: "/audio/come-home-sped-up.mp3",
    mood: "red",
    background:
      "radial-gradient(circle at top, rgba(255,0,60,0.18), transparent 34%), radial-gradient(circle at 85% 18%, rgba(255,0,0,0.08), transparent 24%), linear-gradient(to bottom, #040404, #0b0b0b, #040404)",
    glow: "rgba(255,0,60,0.14)",
    particles: "rgba(255,120,120,0.09)",
  },
  {
    title: "LILIUM (Music Box II)",
    audio: "/audio/lilium-music-box-ii.mp3",
    mood: "lilium",
    background:
      "radial-gradient(circle at top, rgba(255,255,255,0.10), transparent 30%), radial-gradient(circle at 75% 15%, rgba(180,0,0,0.16), transparent 26%), linear-gradient(to bottom, #060606, #140707, #030303)",
    glow: "rgba(255,255,255,0.10)",
    particles: "rgba(255,255,255,0.08)",
  },
  {
    title: "Sleaze On It",
    audio: "/audio/sleaze-on-it.mp3",
    mood: "sleaze",
    background:
      "radial-gradient(circle at top, rgba(255,0,170,0.18), transparent 32%), radial-gradient(circle at 85% 18%, rgba(130,0,255,0.16), transparent 25%), linear-gradient(to bottom, #050308, #13051a, #040307)",
    glow: "rgba(255,0,200,0.16)",
    particles: "rgba(255,255,255,0.05)",
  },
  {
    title: "Love Sillage",
C’est refait dans le canvas.

J’ai corrigé les 4 points que tu voulais :

le bloc titre + support check + vote est maintenant dans un seul grand bloc

le changement de musique relance automatiquement la lecture au switch

le fond est beaucoup plus animé et plus marqué selon chaque musique

le header en haut à gauche a été resserré pour éviter le mauvais positionnement

Teste d’abord dans le canvas.
Si tu veux, au prochain message je peux aussi te faire une version encore plus extrême du fond, surtout pour LILIUM et MARIONETA.





