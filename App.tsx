import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  ChevronRight,
  Flame,
  Menu,
  Music2,
  Pause,
  Play,
  Search,
  Shield,
  Sword,
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
type VoteChoice = "up" | "down" | "poop";
type Mood = "lilium" | "sleaze" | "love" | "marioneta";

type Track = {
  label: string;
  src: string;
  mood: Mood;
  gradient: string;
  glow: string;
  dust: string;
  accent: string;
  tagline: string;
};

type PageData = {
  eyebrow: string;
  intro: string;
  cards: Array<{
    title: string;
    icon: "sword" | "shield" | "flame" | "zap";
    bullets: string[];
  }>;
};

const TRACKS: Track[] = [
  {
    label: "LILIUM (Music Box II)",
    src: "/audio/lilium-music-box-ii.mp3",
    mood: "lilium",
    gradient:
      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 22%), radial-gradient(circle at 75% 25%, rgba(155,0,0,0.28), transparent 30%), linear-gradient(135deg, #030303 0%, #120406 32%, #2a0609 58%, #060606 100%)",
    glow: "rgba(255, 240, 240, 0.14)",
    dust: "rgba(255,255,255,0.16)",
    accent: "text-rose-100",
    tagline: "sacred / tragic / white-red-black",
  },
  {
    label: "Sleaze On It",
    src: "/audio/sleaze-on-it.mp3",
    mood: "sleaze",
    gradient:
      "radial-gradient(circle at 20% 25%, rgba(255,0,170,0.22), transparent 24%), radial-gradient(circle at 80% 20%, rgba(143,0,255,0.22), transparent 26%), linear-gradient(120deg, #060606 0%, #220016 32%, #12001f 58%, #040404 100%)",
    glow: "rgba(255, 0, 170, 0.16)",
    dust: "rgba(255, 70, 200, 0.18)",
    accent: "text-fuchsia-200",
    tagline: "club / neon / chaotic",
  },
  {
    label: "Love Sillage",
    src: "/audio/love-sillage.mp3",
    mood: "love",
    gradient:
      "radial-gradient(circle at 28% 18%, rgba(255,220,240,0.18), transparent 20%), radial-gradient(circle at 72% 28%, rgba(205,165,255,0.2), transparent 26%), linear-gradient(140deg, #050505 0%, #160811 34%, #1b0f2a 62%, #050505 100%)",
    glow: "rgba(240, 180, 255, 0.14)",
    dust: "rgba(255, 220, 240, 0.16)",
    accent: "text-pink-200",
    tagline: "dream haze / soft danger",
  },
  {
    label: "MARIONETA (sped up)",
    src: "/audio/marioneta-sped-up.mp3",
    mood: "marioneta",
    gradient:
      "radial-gradient(circle at 50% 18%, rgba(255,255,255,0.09), transparent 18%), radial-gradient(circle at 75% 25%, rgba(255,0,0,0.22), transparent 28%), linear-gradient(135deg, #020202 0%, #170102 28%, #2d0306 60%, #030303 100%)",
    glow: "rgba(255, 0, 0, 0.14)",
    dust: "rgba(255, 80, 80, 0.16)",
    accent: "text-red-200",
    tagline: "control / strings / pressure",
  },
];

const PAGE_SUBTITLES: Record<PageName, string> = {
  Home: "Structured, aggressive, and made to force the lane.",
  "Why Fiora ADC Works": "Why this pick snowballs when you understand spacing.",
  Runes: "The pages that help you survive lane and keep tempo.",
  Build: "Damage first, but never blindly.",
  "Skill Order": "Priorities for lane control and all-in timing.",
  Matchups: "When to bully, when to chill, and what to respect.",
  "Lane Phase": "The section your support must know by heart.",
  "Fiora's Support": "What your support should do to not sabotage the lane.",
  "Mid/Late Game": "How to play fights without inting your lead.",
  "Mechanical Tips": "Spacing, parry timing, and target discipline.",
  "Videos / Clips": "What to record or showcase when you clip the game.",
};

const PAGE_DATA: Record<Exclude<PageName, "Home">, PageData> = {
  "Why Fiora ADC Works": {
    eyebrow: "Core idea",
    intro:
      "Fiora ADC works because most bot lanes are not used to repeated short trades from a duelist profile. You abuse movement, vital pressure, and sharper punish windows than a normal marksman lane expects.",
    cards: [
      {
        title: "Why it feels unfair",
        icon: "sword",
        bullets: [
          "You punish support mistakes faster than a standard ADC.",
          "Your short trade pattern is explosive when vitals line up.",
          "Enemies often misread your threat because they think 'off-meta = weak'.",
        ],
      },
      {
        title: "What you actually need",
        icon: "shield",
        bullets: [
          "Good spacing before every dash.",
          "A support that understands when to hold and when to commit.",
          "Discipline on wave state so you do not fight inside a bad crash.",
        ],
      },
    ],
  },
  Runes: {
    eyebrow: "Rune logic",
    intro:
      "Take runes that let you survive early pressure, keep lane access, and convert short bursts into kill windows. The exact page can move, but the logic should stay clean.",
    cards: [
      {
        title: "Primary focus",
        icon: "flame",
        bullets: [
          "Pick runes that reward short trade impact.",
          "Take sustain or durability when the matchup is hostile.",
          "Do not greed a full snowball page into double poke lanes.",
        ],
      },
      {
        title: "Secondary focus",
        icon: "zap",
        bullets: [
          "Movement and lane stability often matter more than raw greed.",
          "Your page should help the first 8 minutes, not only level 16 fantasy.",
          "The goal is lane access, not pretty rune screenshots.",
        ],
      },
    ],
  },
  Build: {
    eyebrow: "Item plan",
    intro:
      "The build should feel sharp, not random. Buy to solve the lane first, then amplify your duel pattern. A clean build wins more than a flashy one.",
    cards: [
      {
        title: "Early buys",
        icon: "sword",
        bullets: [
          "Prioritize components that make your first two trades stronger.",
          "Boot timing matters a lot because spacing is half the pick.",
          "Respect anti-burst or anti-poke buys when lane is rough.",
        ],
      },
      {
        title: "Mid game choices",
        icon: "shield",
        bullets: [
          "Do not overbuild glass cannon if one CC chain kills you.",
          "Against heavy frontline, buy to keep uptime not just screenshot damage.",
          "Adapt every third item to the enemy comp, not your ego.",
        ],
      },
    ],
  },
  "Skill Order": {
    eyebrow: "Order",
    intro:
      "Skill order depends on whether you need safer lane control or maximum punish. But the rule stays the same: level what gives the best reliable pressure, not the fanciest moment.",
    cards: [
      {
        title: "Lane priority",
        icon: "zap",
        bullets: [
          "Level your most reliable trading tool first.",
          "Take parry timing seriously when the lane has one key engage spell.",
          "Do not throw points into greed if the matchup is decided by survival.",
        ],
      },
      {
        title: "Before all-ins",
        icon: "flame",
        bullets: [
          "Think about cooldown sync with your support.",
          "Keep one answer ready for the enemy engage timer.",
          "Spacing plus parry setup matters more than mashing abilities.",
        ],
      },
    ],
  },
  Matchups: {
    eyebrow: "Reading lanes",
    intro:
      "Bot matchup knowledge decides whether Fiora ADC looks genius or reportable. The lane is playable when you know the enemy trigger points and which side controls the first mistake.",
    cards: [
      {
        title: "Good lanes",
        icon: "sword",
        bullets: [
          "Immobile carries that hate repeated short trades.",
          "Supports that commit in straight lines and can be punished by parry.",
          "Lanes that crumble once you break confidence early.",
        ],
      },
      {
        title: "Bad lanes",
        icon: "shield",
        bullets: [
          "Heavy range choke with layered poke.",
          "Point-and-click lockdown that removes your outplay margin.",
          "Kill lanes that beat you before your spacing even matters.",
        ],
      },
    ],
  },
  "Lane Phase": {
    eyebrow: "Important",
    intro:
      "This is the most important section for the lane. Your support must understand these points or the pick becomes way weaker. Most losses come from bad coordination here, not from the champion alone.",
    cards: [
      {
        title: "First minutes",
        icon: "zap",
        bullets: [
          "Do not hard force level 1 without a real angle.",
          "Hold the wave where your short trades are safe.",
          "Track enemy cooldowns before every forward step.",
        ],
      },
      {
        title: "When to commit",
        icon: "flame",
        bullets: [
          "Engage only when the enemy path is predictable.",
          "Fight after chip damage, not before.",
          "Never burn everything while the wave and jungle state are bad.",
        ],
      },
    ],
  },
  "Fiora's Support": {
    eyebrow: "Support briefing",
    intro:
      "If your support reads only one page, it should be Lane Phase. Their job is not to cosplay hero every wave. Their job is to create clean windows, protect tempo, and make your punish pattern easy.",
    cards: [
      {
        title: "What support should do",
        icon: "shield",
        bullets: [
          "Read Lane Phase first because that section decides everything.",
          "Hold vision and lane shape so Fiora can threaten calmly.",
          "Do not take random fights without cooldown confirmation.",
        ],
      },
      {
        title: "What support should never do",
        icon: "flame",
        bullets: [
          "Do not sprint in just because Fiora stepped forward once.",
          "Do not ruin the wave trying to force highlight plays.",
          "Do not leave lane state broken then blame the pick.",
        ],
      },
    ],
  },
  "Mid/Late Game": {
    eyebrow: "After lane",
    intro:
      "After lane, play like a sharp skirmisher, not a front-to-back marksman. You want angles, isolated targets, and controlled entry timing.",
    cards: [
      {
        title: "Mid game",
        icon: "sword",
        bullets: [
          "Push side only when you know where the collapse comes from.",
          "Hover fights from an angle instead of face-checking front line.",
          "Pick short skirmishes before full 5v5s whenever possible.",
        ],
      },
      {
        title: "Late game",
        icon: "shield",
        bullets: [
          "One parry can decide the fight, so hold your nerve.",
          "Do not overchase after first reset if peel is gone.",
          "Play for clean execution, not desperation mechanics.",
        ],
      },
    ],
  },
  "Mechanical Tips": {
    eyebrow: "Execution",
    intro:
      "The pick lives or dies on spacing and timing. The mechanics are not just flashy; they are the difference between pressure and griefing.",
    cards: [
      {
        title: "Micro habits",
        icon: "zap",
        bullets: [
          "Reposition before the vital, not after.",
          "Use movement to force enemy skillshots into worse lines.",
          "Think about parry as a planned answer, not panic spam.",
        ],
      },
      {
        title: "Clean habits",
        icon: "sword",
        bullets: [
          "Count key enemy cooldowns every wave.",
          "Reset camera and target focus before dashing in.",
          "Respect vision gaps because confidence without info is inting.",
        ],
      },
    ],
  },
  "Videos / Clips": {
    eyebrow: "Showcase",
    intro:
      "The best clips are not random montage moments. They show control: clean spacing, patient parry usage, and deliberate punish timing.",
    cards: [
      {
        title: "Clip ideas",
        icon: "flame",
        bullets: [
          "Short trade outplays with obvious cooldown bait.",
          "2v2 punish sequences where your support finally listened.",
          "Clean anti-engage parry moments into immediate turn.",
        ],
      },
      {
        title: "What looks good",
        icon: "shield",
        bullets: [
          "A visible plan before the fight starts.",
          "Minimal wasted movement.",
          "Fast finish after the punish window opens.",
        ],
      },
    ],
  },
};

const DEFAULT_VOTES = { up: 3, down: 2, poop: 4 };

function getCardIcon(icon: PageData["cards"][number]["icon"]) {
  if (icon === "sword") return Sword;
  if (icon === "shield") return Shield;
  if (icon === "flame") return Flame;
  return Zap;
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function NeonCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-[28px] border border-red-500/20 bg-black/35 shadow-[0_0_28px_rgba(255,0,70,0.12)] backdrop-blur-md",
        className
      )}
    >
      {children}
    </div>
  );
}

function DynamicBackground({ track }: { track: Track }) {
  const particleCount = track.mood === "sleaze" ? 24 : 18;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-black">
      <motion.div
        key={track.label}
        className="absolute inset-0"
        initial={{ opacity: 0.5, scale: 1.04 }}
        animate={{
          opacity:
            track.mood === "sleaze"
              ? [0.82, 1, 0.8, 1]
              : track.mood === "marioneta"
              ? [0.8, 0.96, 0.85, 0.98]
              : [0.86, 1, 0.9, 1],
          scale:
            track.mood === "lilium"
              ? [1, 1.03, 1.01, 1]
              : track.mood === "marioneta"
              ? [1, 1.045, 1, 1.03, 1]
              : [1, 1.025, 1],
        }}
        transition={{
          duration: track.mood === "sleaze" ? 4 : track.mood === "marioneta" ? 3.5 : 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ background: track.gradient }}
      />

      <motion.div
        className="absolute inset-0 mix-blend-screen"
        animate={{
          opacity:
            track.mood === "sleaze"
              ? [0.05, 0.18, 0.08, 0.16]
              : track.mood === "love"
              ? [0.04, 0.12, 0.06]
              : [0.03, 0.1, 0.05],
        }}
        transition={{
          duration: track.mood === "sleaze" ? 1.8 : 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            track.mood === "lilium"
              ? "linear-gradient(180deg, rgba(255,255,255,0.08), transparent 35%, rgba(120,0,0,0.08))"
              : track.mood === "sleaze"
              ? "linear-gradient(90deg, rgba(255,0,170,0.09), transparent 30%, rgba(150,0,255,0.08) 68%, transparent)"
              : track.mood === "love"
              ? "radial-gradient(circle at 22% 20%, rgba(255,255,255,0.12), transparent 18%), radial-gradient(circle at 75% 28%, rgba(255,200,240,0.08), transparent 22%)"
              : "linear-gradient(120deg, rgba(255,0,0,0.08), transparent 26%, rgba(255,255,255,0.03) 52%, transparent 68%)",
        }}
      />

      <motion.div
        className="absolute left-1/2 top-0 h-72 w-[44rem] -translate-x-1/2 rounded-full blur-3xl"
        animate={{
          opacity:
            track.mood === "sleaze"
              ? [0.12, 0.3, 0.14, 0.28]
              : track.mood === "marioneta"
              ? [0.1, 0.22, 0.12, 0.26]
              : [0.08, 0.18, 0.1],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: track.mood === "sleaze" ? 2.8 : 6.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ backgroundColor: track.glow }}
      />

      <div className="absolute inset-0">
        {Array.from({ length: particleCount }).map((_, index) => (
          <motion.span
            key={`${track.label}-${index}`}
            className="absolute rounded-full blur-xl"
            style={{
              width: `${10 + (index % 7) * 6}px`,
              height: `${10 + (index % 7) * 6}px`,
              left: `${(index * 13) % 100}%`,
              top: `${(index * 9) % 100}%`,
              background: track.dust,
            }}
            animate={{
              y:
                track.mood === "marioneta"
                  ? [0, -14, 0]
                  : track.mood === "lilium"
                  ? [0, -24, -8, 0]
                  : [0, -36, 0],
              x:
                track.mood === "sleaze"
                  ? [0, 12, -8, 0]
                  : track.mood === "love"
                  ? [0, 8, 0]
                  : [0, 4, 0],
              opacity:
                track.mood === "sleaze"
                  ? [0.03, 0.22, 0.05]
                  : [0.02, 0.12, 0.04],
              scale: [1, 1.18, 1],
            }}
            transition={{
              duration:
                track.mood === "sleaze"
                  ? 2.2 + index * 0.07
                  : track.mood === "marioneta"
                  ? 3 + index * 0.09
                  : 5.6 + index * 0.16,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {track.mood === "sleaze" &&
          Array.from({ length: 6 }).map((_, index) => (
            <motion.span
              key={`line-${index}`}
              className="absolute left-0 right-0 h-[2px] bg-fuchsia-300/20"
              style={{ top: `${14 + index * 12}%` }}
              animate={{ opacity: [0, 0.5, 0], x: [0, 14, -10, 0] }}
              transition={{ duration: 1.3 + index * 0.12, repeat: Infinity }}
            />
          ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.12)_52%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}

function ReportVoteBlock() {
  const [votes, setVotes] = useState(DEFAULT_VOTES);
  const [selected, setSelected] = useState<VoteChoice | null>(null);

  useEffect(() => {
    const savedVotes = localStorage.getItem("fiora-home-votes");
    const savedChoice = localStorage.getItem("fiora-home-vote-choice");

    if (savedVotes) {
      try {
        const parsed = JSON.parse(savedVotes) as typeof DEFAULT_VOTES;
        if (
          typeof parsed.up === "number" &&
          typeof parsed.down === "number" &&
          typeof parsed.poop === "number"
        ) {
          setVotes(parsed);
        }
      } catch {}
    }

    if (savedChoice === "up" || savedChoice === "down" || savedChoice === "poop") {
      setSelected(savedChoice);
    }
  }, []);

  const submitVote = (choice: VoteChoice) => {
    if (selected) return;

    setVotes((prev) => {
      const next = { ...prev, [choice]: prev[choice] + 1 };
      localStorage.setItem("fiora-home-votes", JSON.stringify(next));
      return next;
    });
    setSelected(choice);
    localStorage.setItem("fiora-home-vote-choice", choice);
  };

  const total = votes.up + votes.down + votes.poop;

  const options: Array<{ key: VoteChoice; label: string; emoji: string }> = [
    { key: "up", label: "Up", emoji: "⬆️" },
    { key: "down", label: "Down", emoji: "⬇️" },
    { key: "poop", label: "Poop", emoji: "💩" },
  ];

  return (
    <div className="mt-7 rounded-[24px] border border-red-500/20 bg-black/30 p-4 md:p-5">
      <p className="text-sm uppercase tracking-[0.34em] text-red-300">VOTE HERE</p>
      <h2 className="mt-3 text-2xl font-black text-white md:text-4xl">
        ARE YOU GOING TO REPORT ME? :3
      </h2>
      <p className="mt-2 text-sm text-white/60">Pick one only.</p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {options.map((option) => {
          const isSelected = selected === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => submitVote(option.key)}
              disabled={Boolean(selected)}
              className={cx(
                "rounded-[22px] border px-4 py-5 text-center transition",
                "bg-white/[0.03] hover:bg-white/[0.06]",
                isSelected && option.key === "up" && "border-green-400/40 bg-green-500/10",
                isSelected && option.key === "down" && "border-blue-400/40 bg-blue-500/10",
                isSelected && option.key === "poop" && "border-yellow-400/40 bg-yellow-500/10",
                !isSelected && "border-white/10",
                selected && !isSelected && "cursor-not-allowed opacity-70"
              )}
            >
              <div className="text-3xl">{option.emoji}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.3em] text-white/80">
                {option.label}
              </div>
              <div className="mt-2 text-3xl font-black text-white">{votes[option.key]}</div>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-white/55">Total votes: {total}</p>
      {selected && <p className="mt-2 text-sm text-red-300">Your vote has been recorded.</p>}
    </div>
  );
}

function PageSection({ page }: { page: Exclude<PageName, "Home"> }) {
  const data = PAGE_DATA[page];

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {data.cards.map((card) => {
        const Icon = getCardIcon(card.icon);
        return (
          <NeonCard key={card.title} className="p-5 md:p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-3">
                <Icon className="h-5 w-5 text-red-300" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.26em] text-red-300">{data.eyebrow}</p>
                <h2 className="mt-2 text-xl font-black text-white md:text-2xl">{card.title}</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-white/78">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-red-300" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </NeonCard>
        );
      })}
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("Home");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [trackIndex, setTrackIndex] = useState(0);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [muted, setMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[trackIndex];

  const filteredPages = useMemo(() => {
    if (!query.trim()) return pages;
    const lower = query.toLowerCase();
    return pages.filter((page) => page.toLowerCase().includes(lower));
  }, [query]);

  const heroQuickLinks = useMemo(
    () => ["Lane Phase", "Fiora's Support", "Matchups", "Build"] as PageName[],
    []
  );

  const goToPage = (page: PageName) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = muted ? 0 : volume;
    try {
      await audio.play();
      setIsPlaying(true);
      setMusicBlocked(false);
    } catch {
      setIsPlaying(false);
      setMusicBlocked(true);
    }
  }, [muted, volume]);

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = async () => {
    if (shouldPlay) {
      setShouldPlay(false);
      pauseAudio();
      return;
    }

    setShouldPlay(true);
    await tryPlay();
  };

  const cycleTrack = (direction: 1 | -1) => {
    setTrackIndex((prev) => {
      const next = (prev + direction + TRACKS.length) % TRACKS.length;
      return next;
    });
    setShouldPlay(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [muted, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();

    if (shouldPlay) {
      const timer = window.setTimeout(() => {
        void tryPlay();
      }, 70);
      return () => window.clearTimeout(timer);
    }

    pauseAudio();
  }, [trackIndex, shouldPlay, tryPlay, pauseAudio]);

  return (
    <div className="min-h-screen bg-black text-white">
      <DynamicBackground track={currentTrack} />

      <audio
        ref={audioRef}
        src={currentTrack.src}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="relative z-10">
        <header className="sticky top-0 z-30 border-b border-white/5 bg-black/35 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
            <button
              type="button"
              onClick={() => goToPage("Home")}
              className="flex min-w-0 items-center gap-3 text-left"
            >
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-2 shadow-[0_0_18px_rgba(255,0,60,0.22)]">
                <Sword className="h-5 w-5 text-red-400" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black uppercase tracking-[0.24em] text-white">
                  Fiora ADC
                </p>
                <p className="truncate text-xs text-white/55">hybrid final version</p>
              </div>
            </button>

            <nav className="hidden items-center gap-2 xl:flex">
              {pages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={cx(
                    "rounded-full px-3 py-2 text-sm transition",
                    currentPage === page
                      ? "bg-red-500/15 text-red-200"
                      : "text-white/65 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {page}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/30 px-2 py-1.5 md:flex">
                <button
                  type="button"
                  onClick={() => cycleTrack(-1)}
                  className="rounded-full p-2 text-white/70 transition hover:bg-white/5 hover:text-white"
                  aria-label="Previous track"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </button>

                <button
                  type="button"
                  onClick={() => void togglePlay()}
                  className="rounded-full border border-red-500/25 bg-red-500/10 p-2 text-red-200 transition hover:bg-red-500/15"
                  aria-label={isPlaying ? "Pause music" : "Play music"}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => cycleTrack(1)}
                  className="rounded-full p-2 text-white/70 transition hover:bg-white/5 hover:text-white"
                  aria-label="Next track"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <div className="hidden min-w-[190px] pl-1 lg:block">
                  <p className={cx("text-xs font-semibold", currentTrack.accent)}>{currentTrack.label}</p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    {currentTrack.tagline}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMuted((prev) => !prev)}
                  className="rounded-full p-2 text-white/70 transition hover:bg-white/5 hover:text-white"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="rounded-full border border-white/10 bg-black/30 p-2 text-white/85 xl:hidden"
                aria-label="Open menu"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="border-t border-white/5 bg-black/80 px-4 py-4 xl:hidden"
              >
                <div className="mx-auto max-w-7xl">
                  <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/20 bg-black/35 p-3">
                    <Music2 className="h-4 w-4 text-red-300" />
                    <div className="min-w-0">
                      <p className={cx("truncate text-sm font-semibold", currentTrack.accent)}>
                        {currentTrack.label}
                      </p>
                      <p className="text-xs text-white/45">{currentTrack.tagline}</p>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => cycleTrack(-1)}
                      className="rounded-full border border-white/10 bg-white/5 p-2"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void togglePlay()}
                      className="rounded-full border border-red-500/25 bg-red-500/10 p-2"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => cycleTrack(1)}
                      className="rounded-full border border-white/10 bg-white/5 p-2"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMuted((prev) => !prev)}
                      className="rounded-full border border-white/10 bg-white/5 p-2"
                    >
                      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="grid gap-2">
                    {pages.map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className={cx(
                          "rounded-2xl px-4 py-3 text-left text-sm transition",
                          currentPage === page
                            ? "bg-red-500/15 text-red-200"
                            : "bg-white/5 text-white/75"
                        )}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
          <NeonCard className="overflow-hidden p-5 md:p-7">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-4xl">
                <p className="text-xs uppercase tracking-[0.36em] text-red-300">FIORA ADC GUIDE</p>

                <h1 className="mt-3 text-4xl font-black leading-none md:text-6xl">
                  {currentPage === "Home" ? (
                    <>
                      <span className="block">Fiora ADC, structured and</span>
                      <span className="block">aggressive.</span>
                      <span className="mt-2 block text-red-400">
                        SUPPORT CHECK BELOW <span className="text-yellow-300">☟</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="block">{currentPage}</span>
                      <span className="mt-3 block text-lg font-medium text-white/68 md:text-xl">
                        {PAGE_SUBTITLES[currentPage]}
                      </span>
                    </>
                  )}
                </h1>

                {currentPage === "Home" ? (
                  <ReportVoteBlock />
                ) : (
                  <p className="mt-6 max-w-3xl text-base leading-7 text-white/72">
                    {PAGE_DATA[currentPage].intro}
                  </p>
                )}
              </div>

              <div className="w-full max-w-md lg:pt-6">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-red-300" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search section"
                    className="w-full rounded-[22px] border border-red-500/25 bg-black/40 py-4 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-red-400/35"
                  />
                </div>

                <div className="mt-4 rounded-[22px] border border-white/10 bg-black/25 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    {query ? "Search results" : "Quick access"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(query ? filteredPages : heroQuickLinks).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-100 transition hover:bg-red-500/15"
                      >
                        {page}
                      </button>
                    ))}
                    {query && filteredPages.length === 0 && (
                      <span className="text-sm text-white/45">No section found.</span>
                    )}
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className={cx("text-sm font-semibold", currentTrack.accent)}>{currentTrack.label}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">
                      active atmosphere
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/70">{currentTrack.tagline}</p>
                    {musicBlocked && (
                      <p className="mt-3 text-xs text-red-300">
                        Browser blocked autoplay once. Press play and track changes will continue automatically after that.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </NeonCard>

          {currentPage !== "Home" && (
            <div className="mt-6">
              <PageSection page={currentPage} />
            </div>
          )}

          {currentPage === "Home" && (
            <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.95fr]">
              <NeonCard className="p-5 md:p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-red-300">Lane identity</p>
                <h2 className="mt-3 text-2xl font-black md:text-3xl">
                  Structured aggression, not random running.
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
                  This version is built to feel cleaner, meaner, and easier to read. The Home card keeps the title,
                  support warning, search area, and vote section inside one single block. The music switch now keeps
                  playback intent, so changing track does not force you to press play again.
                </p>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {[
                    {
                      title: "Home block",
                      text: "Everything important stays in one card instead of split pieces.",
                    },
                    {
                      title: "Music flow",
                      text: "Next track keeps playing automatically after the first valid play action.",
                    },
                    {
                      title: "Background mood",
                      text: "Each track has a different animated atmosphere instead of a flat static backdrop.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <p className="text-sm font-black text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/68">{item.text}</p>
                    </div>
                  ))}
                </div>
              </NeonCard>

              <NeonCard className="p-5 md:p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-red-300">Most important reminder</p>
                <h2 className="mt-3 text-2xl font-black md:text-3xl">Support reads Lane Phase.</h2>
                <p className="mt-4 text-base leading-7 text-white/75">
                  The support section depends on Lane Phase. If your support ignores that page, the whole pick gets
                  worse. That is why the site keeps calling attention to it.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    "Lane Phase explains the timing of commits.",
                    "Fiora's Support tells them how to behave around those timings.",
                    "Matchups tells you when the lane is actually allowed to be aggressive.",
                  ].map((line) => (
                    <div key={line} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <ArrowUp className="mt-0.5 h-4 w-4 text-red-300" />
                      <p className="text-sm leading-6 text-white/72">{line}</p>
                    </div>
                  ))}
                </div>
              </NeonCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
