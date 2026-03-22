import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sword,
  Flame,
  Target,
  Music2,
  Pause,
  ChevronDown,
  Search,
  ArrowUp,
  PlayCircle,
  Shield,
  Zap,
  Crosshair,
  Menu,
  X,
  HeartHandshake,
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
type LaneTabId = "early" | "wave" | "support" | "matchups";

const BACKGROUND_MUSIC_URL =
  "/audio/Jace%20June%20-%20Come%20Home%20(Sped%20Up).mp3";

type Matchup = {
  name: string;
  level: string;
  danger: string;
  image: string;
  summary: string;
  position?: string;
};

type IconItem = { name: string; image: string };

type SupportCard = {
  name: string;
  role: string;
  image: string;
  size: string;
  position?: string;
};

type LaneTab = {
  id: LaneTabId;
  label: string;
  text: string;
};

type FioraNarrationEntry = {
  image: string;
  mood: string;
  text: string;
  position?: string;
};

const matchupData: readonly Matchup[] = [
  {
    name: "Jhin",
    level: "Rather favorable",
    danger: "Medium",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Jhin_0.jpg",
    summary:
      "You can punish him if he walks up too far, but his ranged trades are still annoying.",
    position: "center 20%",
  },
  {
    name: "Caitlyn",
    level: "Difficult",
    danger: "High",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Caitlyn_0.jpg",
    summary:
      "Very annoying in lane. Range, poke, and wave control mean you need to play clean.",
    position: "center 18%",
  },
  {
    name: "Ezreal",
    level: "Playable",
    danger: "Medium",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Ezreal_0.jpg",
    summary:
      "If he misses his timings and skillshots, you can quickly take over the lane.",
    position: "center 18%",
  },
  {
    name: "Samira",
    level: "Explosive",
    danger: "High",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Samira_0.jpg",
    summary:
      "A volatile lane. Everything depends on spacing, resets, and support presence.",
    position: "center 22%",
  },
  {
    name: "Ashe",
    level: "Tricky",
    danger: "Medium",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Ashe_0.jpg",
    summary:
      "The slow ruins your rhythm, but she is still punishable if you find the right opening.",
    position: "center 18%",
  },
  {
    name: "Kai'Sa",
    level: "Technical",
    danger: "Medium",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Kaisa_0.jpg",
    summary:
      "She has burst, but you can surprise her if you take the initiative.",
    position: "center 20%",
  },
];

const runeImageGroups: Record<"pta" | "phaseRush", readonly IconItem[]> = {
  pta: [
    {
      name: "Press the Attack",
      image:
        "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png",
    },
    {
      name: "Triumph",
      image:
        "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Triumph/Triumph.png",
    },
    {
      name: "Legend: Alacrity",
      image:
        "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png",
    },
    {
      name: "Last Stand",
      image:
        "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LastStand/LastStand.png",
    },
    {
      name: "Biscuit Delivery",
      image:
        "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png",
    },
    {
      name: "Jack of All Trades",
      image:
        "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/JackOfAllTrades/JackOfAllTrades2.png",
    },
  ],
  phaseRush: [
    {
      name: "Phase Rush",
      image:
        "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png",
    },
    {
      name: "Nimbus Cloak",
      image:
        "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/NimbusCloak/6361.png",
    },
    {
      name: "Absolute Focus",
      image:
        "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png",
    },
    {
      name: "Gathering Storm",
      image:
        "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png",
    },
    {
      name: "Legend: Alacrity",
      image:
        "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png",
    },
    {
      name: "Last Stand",
      image:
        "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LastStand/LastStand.png",
    },
  ],
};

const buildImageGroups: Record<
  "core" | "options" | "defense",
  readonly IconItem[]
> = {
  core: [
    {
      name: "Tiamat",
      image:
        "https://ddragon.leagueoflegends.com/cdn/15.21.1/img/item/3077.png",
    },
    {
      name: "Ravenous Hydra",
      image:
        "https://ddragon.leagueoflegends.com/cdn/15.21.1/img/item/3074.png",
    },
  ],
  options: [
    {
      name: "Voltaic Cyclosword",
      image:
        "https://ddragon.leagueoflegends.com/cdn/15.21.1/img/item/6699.png",
    },
    {
      name: "Trinity Force",
      image:
        "https://ddragon.leagueoflegends.com/cdn/15.21.1/img/item/3078.png",
    },
    {
      name: "Eclipse",
      image:
        "https://ddragon.leagueoflegends.com/cdn/15.21.1/img/item/6692.png",
    },
  ],
  defense: [
    {
      name: "Death's Dance",
      image:
        "https://ddragon.leagueoflegends.com/cdn/15.21.1/img/item/6333.png",
    },
    {
      name: "Iceborn Gauntlet",
      image:
        "https://ddragon.leagueoflegends.com/cdn/15.21.1/img/item/6662.png",
    },
    {
      name: "Maw of Malmortius",
      image:
        "https://ddragon.leagueoflegends.com/cdn/15.21.1/img/item/3156.png",
    },
    {
      name: "Spear of Shojin",
      image:
        "https://ddragon.leagueoflegends.com/cdn/15.21.1/img/item/3161.png",
    },
    {
      name: "Guardian Angel",
      image:
        "https://ddragon.leagueoflegends.com/cdn/15.21.1/img/item/3026.png",
    },
    {
      name: "Bloodthirster",
      image:
        "https://ddragon.leagueoflegends.com/cdn/15.21.1/img/item/3072.png",
    },
  ],
};

const supportShowcase: readonly SupportCard[] = [
  {
    name: "Alistar",
    role: "Hard engage",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Alistar_0.jpg",
    size: "h-72",
    position: "center 18%",
  },
  {
    name: "Braum",
    role: "Dive / peel / stability",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Braum_0.jpg",
    size: "h-60",
    position: "center 18%",
  },
  {
    name: "Yuumi",
    role: "Buffs / sustain / scaling",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Yuumi_0.jpg",
    size: "h-48",
    position: "center 30%",
  },
];

const runeRows = [
  [
    "Page 1",
    "PTA",
    "Fast burst, short trades, and immediate punishment against fragile ADCs",
  ],
  [
    "Page 2",
    "Phase Rush",
    "Gap close, mobility, and safer trades into hard-to-reach lanes",
  ],
] as const;

const buildRows = [
  [
    "Core path",
    "Tiamat -> Ravenous Hydra",
    "Better lane comfort, sustain, waveclear, and map presence",
  ],
  [
    "Snowball option",
    "Voltaic Cyclosword",
    "When you can kill fast without getting blown up instantly",
  ],
  [
    "Stable option",
    "Trinity Force",
    "More stability, more HP, and a less fragile profile",
  ],
  ["Safer option", "Eclipse", "Safer into burst with a useful shield"],
  [
    "AD adaptation",
    "Death's Dance / Iceborn Gauntlet",
    "When physical damage or enemy DPS becomes too heavy",
  ],
  [
    "AP adaptation",
    "Maw of Malmortius",
    "Prioritize this if the biggest threat is magic damage",
  ],
  [
    "Late build",
    "Spear of Shojin / Guardian Angel / Bloodthirster",
    "To finish with more pressure, safety, or raw damage",
  ],
] as const;

const laneTabs: readonly LaneTab[] = [
  {
    id: "early",
    label: "Early Lane",
    text: `Fiora is short range in bot lane, so she can be punished if she plays too directly.

Level 1 depends heavily on support posture. If your support cannot create pressure, you often need to absorb safely.

If you reach level 2 first (Q level 1, E level 2, PTA), your burst can be unexpectedly high and can flip lane early.

At level 3, Riposte gives much more confidence and allows cleaner punish patterns.`,
  },
  {
    id: "wave",
    label: "Wave Control",
    text: `Bushes are key. If enemy has no vision, your engage angles become much stronger.

Do not force random 2v2 fights. Wait for one true opening and commit hard.

Burning enemy flash creates a strong next-wave gank timing for your jungler.

Into ranged lanes, preserve HP first and wait for a real all-in window.`,
  },
  {
    id: "support",
    label: "You are Fiora's support",
    text: `Fiora ADC values supports that create direct access to target.

Engage/hook supports are ideal for opening all-ins.

Protective supports can work too if lane plan is survival into spike timing.`,
  },
  {
    id: "matchups",
    label: "Matchup Trends",
    text: `Favorable trend: Jhin, Jinx, Kai'Sa, Lucian, Senna, Sivir, Miss Fortune.

Harder trend: Ashe, Draven, Kog'Maw, Varus, Vayne, Twitch, Caitlyn.

These are trends, not strict rules. First lead can make difficult lanes playable.`,
  },
];

const mechanics = [
  {
    title: "Aggressive spacing",
    content:
      "Threaten without overexposing. Force enemy discomfort before you commit.",
  },
  {
    title: "Riposte timing",
    content:
      "Hold W for the spell that decides the fight, not the first animation.",
  },
  {
    title: "Punishing mistakes",
    content:
      "One wrong enemy step should become trade advantage, flash burn, or kill threat.",
  },
  {
    title: "Passive and positioning",
    content:
      "Use vital angle intelligently to optimize burst and duel pressure.",
  },
] as const;

const supportClips = [
  {
    title: "Support Clip 1",
    description: "Opening window and engage timing example.",
    url: "https://youtu.be/ck-PQSpfRDY",
    embed: "https://www.youtube.com/embed/ck-PQSpfRDY",
  },
  {
    title: "Support Clip 2",
    description: "Follow-up pressure and lane execution example.",
    url: "https://youtu.be/sTytoEHfY9w",
    embed: "https://www.youtube.com/embed/sTytoEHfY9w",
  },
  {
    title: "Support Clip 3",
    description: "Positioning and setup example for support synergy.",
    url: "https://youtu.be/4ASFCDwcHco",
    embed: "https://www.youtube.com/embed/4ASFCDwcHco",
  },
  {
    title: "Support Clip 4",
    description: "Dive or cleanup sequence example.",
    url: "https://youtu.be/rNob-ZD26Xs",
    embed: "https://www.youtube.com/embed/rNob-ZD26Xs",
  },
] as const;

const fioraNarration: Record<PageName, FioraNarrationEntry> = {
  Home: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Fiora_0.jpg",
    mood: "Cold confidence",
    text: "Welcome. Top lane bores you? Turn Fiora ADC into a real weapon.",
    position: "center 12%",
  },
  "Why Fiora ADC Works": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Fiora_1.jpg",
    mood: "Calculated arrogance",
    text: "Fiora ADC works by forcing bad spacing and panic responses.",
    position: "center 14%",
  },
  Runes: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Fiora_2.jpg",
    mood: "Precision",
    text: "Runes define your lane identity before first trade starts.",
    position: "center 14%",
  },
  Build: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Fiora_3.jpg",
    mood: "Methodical",
    text: "Build route follows game state, not ego.",
    position: "center 15%",
  },
  "Skill Order": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Fiora_4.jpg",
    mood: "Discipline",
    text: "Early points decide lane control.",
    position: "center 14%",
  },
  Matchups: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Fiora_5.jpg",
    mood: "Analysis",
    text: "Matchups are trends, not destiny.",
    position: "center 16%",
  },
  "Lane Phase": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Fiora_6.jpg",
    mood: "Aggressive",
    text: "Timing, bushes, level spikes, and one perfect opening.",
    position: "center 15%",
  },
  "Fiora's Support": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Fiora_7.jpg",
    mood: "In sync",
    text: "Support role: create access or protect entry.",
    position: "center 14%",
  },
  "Mid/Late Game": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Fiora_8.jpg",
    mood: "Clear-minded",
    text: "Choose one macro plan and execute it.",
    position: "center 14%",
  },
  "Mechanical Tips": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Fiora_9.jpg",
    mood: "Demanding",
    text: "Mechanics are timing plus composure.",
    position: "center 14%",
  },
  "Videos / Clips": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Fiora_10.jpg",
    mood: "Showy",
    text: "Clips should teach decisions and angles.",
    position: "center 14%",
  },
};

function getPageSpeechText(page: PageName, laneTab: LaneTab): string {
  switch (page) {
    case "Home":
      return [
        fioraNarration[page].text,
        "Welcome to the Fiora ADC guide.",
        "If you are the support, open support section first.",
      ].join(" ");
    case "Lane Phase":
      return [fioraNarration[page].text, laneTab.label, laneTab.text].join(" ");
    case "Matchups":
      return [
        fioraNarration[page].text,
        ...matchupData.map((m) => `${m.name}: ${m.level}. ${m.summary}`),
      ].join(" ");
    default:
      return fioraNarration[page].text;
  }
}

function runSanityChecks() {
  const uniquePages = new Set(pages);
  const uniqueLaneTabs = new Set(laneTabs.map((tab) => tab.id));

  if (uniquePages.size !== pages.length) {
    console.warn("Duplicate page names detected.");
  }
  if (uniqueLaneTabs.size !== laneTabs.length) {
    console.warn("Duplicate lane tab ids detected.");
  }
}
runSanityChecks();

function NeonCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-red-500/30 bg-white/5 backdrop-blur-md shadow-[0_0_25px_rgba(255,0,51,0.12)] ${className}`}
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
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-3">
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-2 shadow-[0_0_18px_rgba(255,0,60,0.25)]">
          <Icon className="h-5 w-5 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          {title}
        </h2>
      </div>
      {subtitle ? <p className="max-w-3xl text-white/70">{subtitle}</p> : null}
    </div>
  );
}

function AccordionItem({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-red-500/20 bg-black/30">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/5"
      >
        <span className="font-semibold text-white">{title}</span>
        <ChevronDown
          className={`h-5 w-5 text-red-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-white/75">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VisualIcon({
  name,
  image,
  className = "h-16 w-16",
  rounded = "rounded-2xl",
}: {
  name: string;
  image: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <img
        src={image}
        alt={name}
        className={`${className} ${rounded} border border-red-500/30 object-cover shadow-[0_0_16px_rgba(255,0,60,0.16)]`}
      />
      <span className="text-xs text-white/70">{name}</span>
    </div>
  );
}

function ImageStrip({
  title,
  items,
  iconSize = "h-16 w-16",
}: {
  title: string;
  items: readonly IconItem[];
  iconSize?: string;
}) {
  return (
    <NeonCard className="p-5">
      <p className="mb-4 font-semibold text-red-300">{title}</p>
      <div className="flex flex-wrap gap-4">
        {items.map((item) => (
          <VisualIcon
            key={item.name}
            name={item.name}
            image={item.image}
            className={iconSize}
            rounded="rounded-2xl"
          />
        ))}
      </div>
    </NeonCard>
  );
}

function FioraSpeaker({
  page,
  laneTab,
}: {
  page: PageName;
  laneTab: LaneTab;
}) {
  const config = fioraNarration[page];
  const pageSpeechText = useMemo(() => getPageSpeechText(page, laneTab), [
    page,
    laneTab,
  ]);

  const [visibleText, setVisibleText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [speechRate, setSpeechRate] = useState(0.92);
  const [speechPitch, setSpeechPitch] = useState(0.82);
  const intervalRef = useRef<number | null>(null);

  const clearTicker = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    clearTicker();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setVisibleText(pageSpeechText);
  }, [clearTicker, pageSpeechText]);

  const startSpeaking = useCallback(() => {
    clearTicker();
    setVisibleText("");

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setVisibleText(pageSpeechText);
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(pageSpeechText);
    const voices = window.speechSynthesis.getVoices();

    const selectedVoice = voices.find((v) => v.voiceURI === selectedVoiceURI);
    const fallbackEnglish = voices.find((v) =>
      v.lang.toLowerCase().startsWith("en")
    );

    utterance.lang = selectedVoice?.lang || fallbackEnglish?.lang || "en-US";
    utterance.voice = selectedVoice || fallbackEnglish || null;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.volume = 1;

    setIsSpeaking(true);

    let index = 0;
    intervalRef.current = window.setInterval(() => {
      index += 2;
      setVisibleText(pageSpeechText.slice(0, index));
      if (index >= pageSpeechText.length) {
        clearTicker();
      }
    }, 18);

    utterance.onend = () => {
      clearTicker();
      setVisibleText(pageSpeechText);
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      clearTicker();
      setVisibleText(pageSpeechText);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [clearTicker, pageSpeechText, selectedVoiceURI, speechPitch, speechRate]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return undefined;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      setVoicesReady(true);

      if (!selectedVoiceURI) {
        const english = voices.find((v) =>
          v.lang.toLowerCase().startsWith("en")
        );
        const chosen = english || voices[0];
        if (chosen) setSelectedVoiceURI(chosen.voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
      clearTicker();
    };
  }, [clearTicker, selectedVoiceURI]);

  useEffect(() => {
    setVisibleText("");
    setIsSpeaking(false);

    if (!autoPlay) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      clearTicker();
      return undefined;
    }

    const timer = window.setTimeout(() => {
      startSpeaking();
    }, 250);

    return () => {
      window.clearTimeout(timer);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      clearTicker();
    };
  }, [autoPlay, clearTicker, page, laneTab, startSpeaking]);

  const englishVoices = availableVoices.filter((v) =>
    v.lang.toLowerCase().startsWith("en")
  );

  return (
    <NeonCard className="mb-8 overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
        <div className="relative min-h-[320px] overflow-hidden bg-black/40">
          <motion.img
            key={config.image}
            src={config.image}
            alt={`Fiora - ${page}`}
            initial={{ scale: 1.04, opacity: 0.85 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: isSpeaking ? [0, -5, 0, -3, 0] : [0, -2, 0],
              rotate: isSpeaking ? [0, -0.6, 0.8, -0.4, 0] : [0, -0.15, 0],
            }}
            transition={{
              duration: isSpeaking ? 1.4 : 3.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 h-full w-full object-cover"
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
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  isSpeaking
                    ? "bg-red-400 shadow-[0_0_12px_rgba(255,0,60,0.55)]"
                    : "bg-white/30"
                }`}
              />
              {isSpeaking ? "Fiora is speaking" : "Fiora is waiting"}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-gradient-to-br from-white/5 to-red-500/5 p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200">
              <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
              Fiora analysis
            </div>
            <button
              onClick={startSpeaking}
              className="rounded-full border border-red-500/30 bg-black/40 px-3 py-1.5 text-xs text-white hover:bg-red-500/10"
            >
              Speak
            </button>
            <button
              onClick={stopSpeaking}
              className="rounded-full border border-red-500/30 bg-black/40 px-3 py-1.5 text-xs text-white hover:bg-red-500/10"
            >
              Stop
            </button>
            <button
              onClick={() => setAutoPlay((v) => !v)}
              className={`rounded-full border px-3 py-1.5 text-xs ${
                autoPlay
                  ? "border-red-500/40 bg-red-500/10 text-red-200"
                  : "border-white/15 bg-black/40 text-white"
              }`}
            >
              Auto: {autoPlay ? "ON" : "OFF"}
            </button>
            {!voicesReady && (
              <span className="text-xs text-white/45">Loading voices...</span>
            )}
          </div>

          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-xs text-white/65">
              Voice
              <select
                value={selectedVoiceURI}
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className="rounded-xl border border-red-500/25 bg-black/45 px-3 py-2 text-sm text-white outline-none"
              >
                {(englishVoices.length ? englishVoices : availableVoices).map(
                  (voice) => (
                    <option
                      key={voice.voiceURI}
                      value={voice.voiceURI}
                      className="bg-black text-white"
                    >
                      {voice.name} ({voice.lang})
                    </option>
                  )
                )}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-xs text-white/65">
              Rate: {speechRate.toFixed(2)}
              <input
                type="range"
                min="0.7"
                max="1.05"
                step="0.01"
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
              />
            </label>
            <label className="flex flex-col gap-2 text-xs text-white/65">
              Pitch: {speechPitch.toFixed(2)}
              <input
                type="range"
                min="0.65"
                max="1.15"
                step="0.01"
                value={speechPitch}
                onChange={(e) => setSpeechPitch(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="relative rounded-[28px] border border-red-500/25 bg-black/35 p-5 shadow-[0_0_22px_rgba(255,0,60,0.12)] md:p-6">
            <div className="absolute -left-3 top-8 h-6 w-6 rotate-45 border-b border-l border-red-500/25 bg-black/35" />
            <p className="min-h-[120px] text-lg leading-relaxed text-white md:text-xl">
              {visibleText || (!isSpeaking ? pageSpeechText : "")}
              {isSpeaking && (
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9 }}
                  className="ml-1 text-red-300"
                >
                  ▋
                </motion.span>
              )}
            </p>
          </div>
        </div>
      </div>
    </NeonCard>
  );
}

export default function FioraADCGuideSite() {
  const [currentPage, setCurrentPage] = useState<PageName>("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [laneTab, setLaneTab] = useState<LaneTabId>("early");

  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.22);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredPages = useMemo(() => {
    if (!query.trim()) return pages;
    return pages.filter((p) => p.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const activeLaneTab = laneTabs.find((tab) => tab.id === laneTab) ?? laneTabs[0];

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

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <audio
        ref={audioRef}
        src={BACKGROUND_MUSIC_URL}
        loop
        preload="auto"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,60,0.14),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(255,0,0,0.08),transparent_22%),linear-gradient(to_bottom,#050505,#0c0c0c,#050505)]" />
      <div className="absolute left-1/2 top-0 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-2 shadow-[0_0_18px_rgba(255,0,60,0.22)]">
              <Sword className="h-5 w-5 text-red-400" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black uppercase tracking-[0.18em] text-white">
                Fiora ADC
              </p>
              <p className="truncate text-xs text-white/55">
                Niche guide, technical playstyle
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 xl:flex">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  scrollTop();
                }}
                className={`rounded-xl px-3 py-2 text-sm transition ${
                  currentPage === page
                    ? "border border-red-500/40 bg-red-500/15 text-red-300 shadow-[0_0_14px_rgba(255,0,60,0.18)]"
                    : "border border-transparent text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {page}
              </button>
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
            className="rounded-xl border border-red-500/30 p-2 text-white xl:hidden"
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
                    onClick={() => {
                      setCurrentPage(page);
                      setMobileOpen(false);
                      scrollTop();
                    }}
                    className={`rounded-xl px-4 py-3 text-left ${
                      currentPage === page
                        ? "bg-red-500/15 text-red-300"
                        : "bg-white/5 text-white/75"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        {musicBlocked && (
          <NeonCard className="mb-6 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Background music is ready
                </p>
                <p className="text-sm text-white/65">
                  Browser blocked autoplay with sound. Press play once.
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

        <div className="mb-8">
          <NeonCard className="p-4 md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.25em] text-red-300">
                  Experimental guide
                </p>
                <h1 className="text-3xl font-black leading-tight md:text-5xl">
                  Playing{" "}
                  <span className="text-red-400 drop-shadow-[0_0_14px_rgba(255,0,60,0.5)]">
                    Fiora ADC
                  </span>
                </h1>
                <p className="mt-3 max-w-3xl text-white/70">
                  Dark and aggressive site-guide for players who want to optimize
                  this niche pick.
                </p>
              </div>

              <div className="w-full md:w-[360px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-300" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search a page..."
                    className="w-full rounded-2xl border border-red-500/25 bg-black/40 py-3 pl-10 pr-4 text-white outline-none placeholder:text-white/35 focus:border-red-400/50"
                  />
                </div>
                {!!query && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {filteredPages.length ? (
                      filteredPages.map((page) => (
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page);
                            scrollTop();
                          }}
                          className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-red-500/10 hover:text-red-300"
                        >
                          {page}
                        </button>
                      ))
                    ) : (
                      <span className="text-sm text-white/50">No results.</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </NeonCard>
        </div>

        <FioraSpeaker page={currentPage} laneTab={activeLaneTab} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            {currentPage === "Home" && (
              <div className="space-y-8">
                <div className="grid gap-6 lg:grid-cols-[1fr]">
                  <NeonCard className="overflow-hidden">
                    <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                      <div className="relative min-h-[320px] overflow-hidden">
                        <img
                          src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_8.jpg"
                          alt="Aggressive Fiora"
                          className="absolute inset-0 h-full w-full object-cover"
                          style={{ objectPosition: "center 26%" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent" />
                        <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
                          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-300">
                            Draft priority
                          </p>
                          <h3 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
                            ARE YOU THE SUPPORT?
                            <br />
                            CLICK HERE BEFORE I REPORT YOU
                          </h3>
                          <p className="mt-4 max-w-xl text-white/75">
                            Fast read for supports: engage timing, lane sync,
                            wave pressure, and all-in windows.
                          </p>
                          <div className="mt-6 flex flex-wrap gap-3">
                            <button
                              onClick={() => {
                                setCurrentPage("Fiora's Support");
                                scrollTop();
                              }}
                              className="rounded-2xl border border-red-400/40 bg-red-500/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-red-200 shadow-[0_0_18px_rgba(255,0,60,0.25)] transition hover:scale-[1.02] hover:bg-red-500/20"
                            >
                              Go to Fiora's Support
                            </button>
                            <button
                              onClick={() => {
                                setCurrentPage("Lane Phase");
                                setLaneTab("support");
                                scrollTop();
                              }}
                              className="rounded-2xl border border-white/25 bg-black/45 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/90 transition hover:bg-white/10"
                            >
                              Open Lane Phase - Support
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="hidden lg:block" />
                    </div>
                  </NeonCard>

                  <NeonCard className="p-6 md:p-8">
                    <SectionTitle
                      icon={Flame}
                      title="Welcome to the Fiora ADC lab"
                      subtitle="Cleaner sections, direct links, and practical lane-focused information."
                    />
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-red-300">Identity</p>
                        <p className="mt-2 font-semibold text-white">
                          Black / neon red / white
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-red-300">Tone</p>
                        <p className="mt-2 font-semibold text-white">
                          Fun, aggressive, carry mindset
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-red-300">Positioning</p>
                        <p className="mt-2 font-semibold text-white">
                          Niche pick, optimized troll
                        </p>
                      </div>
                    </div>
                  </NeonCard>
                </div>
              </div>
            )}

            {currentPage === "Why Fiora ADC Works" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={Target}
                  title="Why Fiora ADC Works"
                  subtitle="Same information, cleaner format."
                />
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <NeonCard className="p-6">
                    <div className="mb-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-red-200">
                      Core concept
                    </div>
                    <h3 className="text-2xl font-black text-white">
                      You win by forcing bad spacing and panic decisions
                    </h3>
                    <p className="mt-3 text-white/75">
                      Fiora ADC is about forcing uncomfortable trades,
                      punishing mistakes, and committing on exact timing.
                    </p>
                  </NeonCard>
                  <NeonCard className="overflow-hidden p-3">
                    <img
                      src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg"
                      alt="Fiora visual"
                      className="h-[260px] w-full rounded-2xl border border-red-500/25 object-cover"
                      style={{ objectPosition: "center 26%" }}
                    />
                  </NeonCard>
                </div>
              </div>
            )}

            {currentPage === "Runes" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={Zap}
                  title="Runes"
                  subtitle="PTA or Phase Rush depending on lane goals."
                />

                <NeonCard className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-[640px] w-full text-left">
                      <thead className="bg-red-500/10">
                        <tr>
                          {["Page", "Keystone", "General idea"].map((head) => (
                            <th
                              key={head}
                              className="px-5 py-4 font-semibold text-red-300"
                            >
                              {head}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {runeRows.map((row, index) => (
                          <tr key={index} className="border-t border-white/10">
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-5 py-4 text-white/75"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </NeonCard>

                <div className="grid gap-6 xl:grid-cols-2">
                  <NeonCard className="p-6 md:p-7">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-2">
                        <Target className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">PTA Page</h3>
                      </div>
                    </div>

                    <div className="space-y-5 text-white/80">
                      <ImageStrip
                        title="Main runes"
                        items={runeImageGroups.pta}
                        iconSize="h-16 w-16"
                      />
                      <div className="rounded-2xl border border-red-500/20 bg-black/30 p-4">
                        <p className="mb-2 font-semibold text-white">Mini runes</p>
                        <p className="text-white/75">
                          Adaptive force / Adaptive force / Heal
                        </p>
                      </div>
                    </div>
                  </NeonCard>

                  <NeonCard className="p-6 md:p-7">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-2">
                        <Flame className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          Phase Rush Page
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-5 text-white/80">
                      <ImageStrip
                        title="Main runes"
                        items={runeImageGroups.phaseRush}
                        iconSize="h-16 w-16"
                      />
                      <div className="rounded-2xl border border-red-500/20 bg-black/30 p-4">
                        <p className="mb-2 font-semibold text-white">Mini runes</p>
                        <p className="text-white/75">
                          Adaptive force / Attack speed / Scaling heal
                        </p>
                      </div>
                    </div>
                  </NeonCard>
                </div>
              </div>
            )}

            {currentPage === "Build" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={Shield}
                  title="Build"
                  subtitle="Core route then game-state adaptations."
                />
                <div className="grid gap-6 lg:grid-cols-3">
                  <ImageStrip
                    title="Core"
                    items={buildImageGroups.core}
                    iconSize="h-20 w-20"
                  />
                  <ImageStrip
                    title="Offensive options"
                    items={buildImageGroups.options}
                    iconSize="h-20 w-20"
                  />
                  <ImageStrip
                    title="Defense / late build"
                    items={buildImageGroups.defense}
                    iconSize="h-20 w-20"
                  />
                </div>

                <NeonCard className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-[620px] w-full text-left">
                      <thead className="bg-red-500/10">
                        <tr>
                          {["Step", "Choice", "Comments"].map((head) => (
                            <th
                              key={head}
                              className="px-5 py-4 font-semibold text-red-300"
                            >
                              {head}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {buildRows.map((row, index) => (
                          <tr key={index} className="border-t border-white/10">
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-5 py-4 text-white/75"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </NeonCard>
              </div>
            )}

            {currentPage === "Skill Order" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={Crosshair}
                  title="Skill Order"
                  subtitle="Baseline order and logic."
                />
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    [
                      "Levels 1-3",
                      "Q level 1, E level 2, W level 3 is the practical baseline.",
                    ],
                    [
                      "Main max order",
                      "Adapt by game state. Keep lane pressure and survivability balanced.",
                    ],
                    [
                      "Variations",
                      "Use matchup and support synergy to adjust early points.",
                    ],
                  ].map(([title, text]) => (
                    <NeonCard key={title} className="p-5">
                      <h3 className="text-lg font-bold text-white">{title}</h3>
                      <p className="mt-3 text-white/70">{text}</p>
                    </NeonCard>
                  ))}
                </div>
              </div>
            )}

            {currentPage === "Matchups" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={Sword}
                  title="Matchups"
                  subtitle="Readable cards, expandable later."
                />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {matchupData.map((m) => (
                    <motion.div key={m.name} whileHover={{ y: -4 }}>
                      <NeonCard className="h-full overflow-hidden p-4">
                        <img
                          src={m.image}
                          alt={m.name}
                          className="h-44 w-full rounded-2xl border border-red-500/20 object-cover"
                          style={{ objectPosition: m.position || "center 20%" }}
                        />
                        <div className="mt-4 flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xl font-bold text-white">{m.name}</p>
                            <p className="mt-1 text-sm text-red-300">{m.level}</p>
                          </div>
                          <span className="rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1 text-xs text-red-200">
                            Danger {m.danger}
                          </span>
                        </div>
                        <p className="mt-4 text-white/70">{m.summary}</p>
                      </NeonCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {currentPage === "Lane Phase" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={Target}
                  title="Lane Phase"
                  subtitle="Key points first, details second."
                />
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    [
                      "Primary goal",
                      "Preserve HP and wait for one committed opening.",
                    ],
                    [
                      "First spikes",
                      "Level 2 timing then level 3 Riposte control.",
                    ],
                    ["Vision rule", "Control ward first, all-in after."],
                  ].map(([title, text]) => (
                    <NeonCard key={title} className="p-5">
                      <p className="text-sm uppercase tracking-[0.18em] text-red-300">
                        {title}
                      </p>
                      <p className="mt-2 text-white/75">{text}</p>
                    </NeonCard>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {laneTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setLaneTab(tab.id)}
                      className={`rounded-xl border px-4 py-2 transition ${
                        laneTab === tab.id
                          ? "border-red-500/40 bg-red-500/15 text-red-300"
                          : "border-white/10 bg-white/5 text-white/70 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <NeonCard className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-red-300">
                    Quick read
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    {activeLaneTab.label}
                  </h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {activeLaneTab.text
                      .split("\n\n")
                      .filter((part) => part.trim().length > 0)
                      .map((part, index) => (
                        <div
                          key={`${activeLaneTab.id}-${index}`}
                          className="rounded-2xl border border-red-500/20 bg-black/35 p-4 text-white/75"
                        >
                          {part}
                        </div>
                      ))}
                  </div>
                </NeonCard>
              </div>
            )}

            {currentPage === "Fiora's Support" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={HeartHandshake}
                  title="Fiora's Support"
                  subtitle="Support-first layout and direct lane references."
                />

                <NeonCard className="p-5 md:p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-red-300">
                    Mandatory read
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    Supports must read Lane Phase too
                  </h3>
                  <p className="mt-2 max-w-3xl text-white/75">
                    This section is not enough alone. Support players should also
                    review lane timings, bush/wave control, and engage windows in
                    Lane Phase.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setCurrentPage("Lane Phase");
                        setLaneTab("early");
                        scrollTop();
                      }}
                      className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200"
                    >
                      Read Lane Phase: Early
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage("Lane Phase");
                        setLaneTab("wave");
                        scrollTop();
                      }}
                      className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200"
                    >
                      Read Lane Phase: Wave
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage("Lane Phase");
                        setLaneTab("support");
                        scrollTop();
                      }}
                      className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200"
                    >
                      Read Lane Phase: Support
                    </button>
                  </div>
                </NeonCard>

                <div className="grid items-end gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {supportShowcase.map((support) => (
                    <NeonCard
                      key={support.name}
                      className="flex flex-col items-center justify-end p-4 text-center"
                    >
                      <img
                        src={support.image}
                        alt={support.name}
                        className={`w-full ${support.size} rounded-3xl border border-red-500/25 object-cover`}
                        style={{
                          objectPosition: support.position || "center 20%",
                        }}
                      />
                      <p className="mt-4 text-xl font-bold text-white">
                        {support.name}
                      </p>
                      <p className="mt-1 text-sm text-red-300">{support.role}</p>
                    </NeonCard>
                  ))}
                </div>

                <SectionTitle
                  icon={PlayCircle}
                  title="Support Clips"
                  subtitle="Concrete support examples."
                />
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
                      <div className="mt-4">
                        <p className="font-semibold text-white">{clip.title}</p>
                        <p className="mt-2 text-sm text-white/65">
                          {clip.description}
                        </p>
                        <a
                          href={clip.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-200 hover:bg-red-500/15"
                        >
                          Open on YouTube
                        </a>
                      </div>
                    </NeonCard>
                  ))}
                </div>
              </div>
            )}

            {currentPage === "Mid/Late Game" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={Flame}
                  title="Mid / Late Game"
                  subtitle="Cleaner cards for macro priorities."
                />
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    [
                      "Pick one plan",
                      "Split, flank, pick, or group. Do not mix all plans at once.",
                    ],
                    [
                      "Entry timing",
                      "Fight when enemy CC cooldowns and vision state are favorable.",
                    ],
                    [
                      "Conversion",
                      "Every kill should become objective pressure immediately.",
                    ],
                  ].map(([title, text]) => (
                    <NeonCard key={title} className="p-5">
                      <p className="font-bold text-white">{title}</p>
                      <p className="mt-2 text-white/70">{text}</p>
                    </NeonCard>
                  ))}
                </div>
                <NeonCard className="overflow-hidden p-3">
                  <img
                    src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_6.jpg"
                    alt="Mid late visual"
                    className="h-[280px] w-full rounded-2xl border border-red-500/25 object-cover"
                    style={{ objectPosition: "center 24%" }}
                  />
                </NeonCard>
              </div>
            )}

            {currentPage === "Mechanical Tips" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={Zap}
                  title="Mechanical Tips"
                  subtitle="Concrete tips that are fast to read."
                />
                <div className="space-y-3">
                  {mechanics.map((item) => (
                    <AccordionItem
                      key={item.title}
                      title={item.title}
                      content={item.content}
                    />
                  ))}
                </div>
              </div>
            )}

            {currentPage === "Videos / Clips" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={PlayCircle}
                  title="Videos / Clips"
                  subtitle="Visual cards for future clips."
                />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {[
                    {
                      title: "Duel highlight",
                      image:
                        "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg",
                      position: "center 24%",
                    },
                    {
                      title: "Timing sample",
                      image:
                        "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg",
                      position: "center 24%",
                    },
                    {
                      title: "Carry sequence",
                      image:
                        "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_7.jpg",
                      position: "center 25%",
                    },
                  ].map((item) => (
                    <NeonCard key={item.title} className="overflow-hidden p-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-56 w-full rounded-2xl border border-red-500/25 object-cover"
                        style={{ objectPosition: item.position }}
                      />
                      <div className="mt-4">
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="mt-2 text-sm text-white/65">
                          Reserved for your next clip + explanation block.
                        </p>
                      </div>
                    </NeonCard>
                  ))}
                </div>
              </div>
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
          {musicPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Music2 className="h-5 w-5" />
          )}
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
        className="fixed bottom-5 right-5 z-50 rounded-full border border-red-500/40 bg-black/70 p-3 text-red-300 shadow-[0_0_18px_rgba(255,0,60,0.25)] transition hover:scale-105"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}
