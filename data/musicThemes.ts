export type MusicTrackId =
  | "come-home"
  | "lilium"
  | "sleaze-on-it"
  | "love-sillage"
  | "marioneta";

export type ThemeGlow = {
  top: string;
  left: string;
  width: string;
  height: string;
  background: string;
  opacity: number;
  duration: number;
  x: [number, number, number];
  y: [number, number, number];
};

export type MusicTheme = {
  id: MusicTrackId;
  label: string;
  subtitle: string;
  mood: string;
  src: string;
  background: {
    base: string;
    overlay: string;
    pattern: string;
    patternSize: string;
    veil: string;
    artwork?: {
      src: string;
      kind?: "image" | "video";
      position?: string;
      opacity?: number;
      scale?: number;
      filter?: string;
    };
    glows: ThemeGlow[];
  };
};

export const defaultMusicTrackId: MusicTrackId = "come-home";

export const musicThemes: MusicTheme[] = [
  {
    id: "come-home",
    label: "Come Home",
    subtitle: "Dark / emotional / blood-red pulse",
    mood: "Emotional duel pressure",
    src: "/audio/Jace June - Come Home (Sped Up).mp3",
    background: {
      base: "linear-gradient(180deg, #020202 0%, #070707 46%, #020202 100%)",
      overlay:
        "linear-gradient(180deg, rgba(0, 0, 0, 0.14) 0%, rgba(35, 0, 10, 0.08) 40%, rgba(0, 0, 0, 0.2) 100%)",
      pattern: "none",
      patternSize: "100% 100%",
      veil: "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.28) 100%)",
      artwork: {
        src: "/backgrounds/come-home-wallpaper.mp4",
        kind: "video",
        position: "center center",
        opacity: 0.72,
        scale: 1,
        filter: "grayscale(0.04) contrast(1.02) brightness(0.72)",
      },
      glows: [],
    },
  },
  {
    id: "lilium",
    label: "LILIUM (Music Box II)",
    subtitle: "Sacred / tragic / cathedral haze",
    mood: "Innocence and violence",
    src: "/audio/lilium-music-box-ii.mp3",
    background: {
      base: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.12), transparent 24%), radial-gradient(circle at 18% 12%, rgba(160,0,20,0.16), transparent 24%), linear-gradient(180deg, #060606 0%, #15080b 42%, #030303 100%)",
      overlay:
        "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(140,0,24,0.06) 42%, rgba(0,0,0,0) 100%)",
      pattern:
        "linear-gradient(135deg, rgba(255,255,255,0.06) 12%, transparent 12%), linear-gradient(225deg, rgba(255,255,255,0.06) 12%, transparent 12%), linear-gradient(315deg, rgba(255,255,255,0.035) 12%, transparent 12%), linear-gradient(45deg, rgba(140,0,24,0.08) 12%, transparent 12%)",
      patternSize: "180px 180px",
      veil: "radial-gradient(circle at 50% 15%, rgba(255,255,255,0.12), transparent 46%)",
      glows: [
        {
          top: "-4%",
          left: "40%",
          width: "30rem",
          height: "20rem",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,220,220,0.08) 40%, transparent 74%)",
          opacity: 0.72,
          duration: 20,
          x: [0, 10, 0],
          y: [0, -10, 0],
        },
        {
          top: "28%",
          left: "6%",
          width: "22rem",
          height: "22rem",
          background:
            "radial-gradient(circle, rgba(170,0,35,0.26) 0%, rgba(110,0,24,0.12) 45%, transparent 70%)",
          opacity: 0.6,
          duration: 24,
          x: [0, 12, 0],
          y: [0, 10, 0],
        },
      ],
    },
  },
  {
    id: "sleaze-on-it",
    label: "Sleaze On It",
    subtitle: "Chaotic / club / neon overload",
    mood: "Dirty hyperpop night",
    src: "/audio/sleaze-on-it.mp3",
    background: {
      base: "radial-gradient(circle at 18% 18%, rgba(255,0,120,0.2), transparent 24%), radial-gradient(circle at 82% 22%, rgba(0,255,240,0.18), transparent 24%), linear-gradient(180deg, #040405 0%, #0d0715 45%, #030305 100%)",
      overlay:
        "linear-gradient(135deg, rgba(255, 0, 153, 0.16) 0%, rgba(0, 255, 240, 0.08) 48%, rgba(0,0,0,0) 100%)",
      pattern:
        "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      patternSize: "90px 90px",
      veil: "radial-gradient(circle at 50% -10%, rgba(255,0,160,0.14), transparent 50%)",
      glows: [
        {
          top: "6%",
          left: "16%",
          width: "24rem",
          height: "24rem",
          background:
            "radial-gradient(circle, rgba(255,0,153,0.34) 0%, rgba(255,0,102,0.16) 45%, transparent 72%)",
          opacity: 0.72,
          duration: 14,
          x: [0, 18, 0],
          y: [0, 12, 0],
        },
        {
          top: "26%",
          left: "68%",
          width: "24rem",
          height: "24rem",
          background:
            "radial-gradient(circle, rgba(0,255,240,0.34) 0%, rgba(0,170,255,0.14) 45%, transparent 70%)",
          opacity: 0.66,
          duration: 12,
          x: [0, -22, 0],
          y: [0, 18, 0],
        },
        {
          top: "72%",
          left: "42%",
          width: "20rem",
          height: "20rem",
          background:
            "radial-gradient(circle, rgba(255,255,0,0.22) 0%, rgba(255,120,0,0.08) 42%, transparent 68%)",
          opacity: 0.4,
          duration: 10,
          x: [0, 14, 0],
          y: [0, -10, 0],
        },
      ],
    },
  },
  {
    id: "love-sillage",
    label: "Love Sillage",
    subtitle: "Dreamy / glossy / reflective dark",
    mood: "Soft romance in midnight light",
    src: "/audio/love-sillage.mp3",
    background: {
      base: "radial-gradient(circle at 22% 12%, rgba(255,120,200,0.18), transparent 22%), radial-gradient(circle at 82% 18%, rgba(90,170,255,0.16), transparent 22%), linear-gradient(180deg, #05060d 0%, #12081a 46%, #04060d 100%)",
      overlay:
        "linear-gradient(135deg, rgba(255, 150, 220, 0.12) 0%, rgba(120, 150, 255, 0.09) 45%, rgba(0,0,0,0) 100%)",
      pattern:
        "linear-gradient(135deg, rgba(255,255,255,0.03) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,0.03) 25%, transparent 25%), linear-gradient(315deg, rgba(255,255,255,0.02) 25%, transparent 25%), linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%)",
      patternSize: "220px 220px",
      veil: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08), transparent 44%)",
      glows: [
        {
          top: "2%",
          left: "18%",
          width: "22rem",
          height: "22rem",
          background:
            "radial-gradient(circle, rgba(255,140,220,0.26) 0%, rgba(255,100,170,0.1) 45%, transparent 72%)",
          opacity: 0.72,
          duration: 18,
          x: [0, 16, 0],
          y: [0, 8, 0],
        },
        {
          top: "18%",
          left: "72%",
          width: "22rem",
          height: "22rem",
          background:
            "radial-gradient(circle, rgba(120,170,255,0.28) 0%, rgba(90,110,255,0.1) 45%, transparent 72%)",
          opacity: 0.68,
          duration: 20,
          x: [0, -14, 0],
          y: [0, 12, 0],
        },
      ],
    },
  },
  {
    id: "marioneta",
    label: "MARIONETA (sped up)",
    subtitle: "Theatrical / puppet-stage / eerie elegance",
    mood: "Stage lights and tension strings",
    src: "/audio/marioneta-sped-up.mp3",
    background: {
      base: "radial-gradient(circle at 50% 10%, rgba(255,220,220,0.1), transparent 20%), radial-gradient(circle at 18% 28%, rgba(110,0,40,0.16), transparent 24%), linear-gradient(180deg, #070506 0%, #17070d 42%, #050305 100%)",
      overlay:
        "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(100,0,40,0.1) 42%, rgba(0,0,0,0) 100%)",
      pattern:
        "linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
      patternSize: "120px 120px",
      veil: "radial-gradient(circle at 50% -10%, rgba(255,255,255,0.08), transparent 44%)",
      glows: [
        {
          top: "-2%",
          left: "38%",
          width: "28rem",
          height: "18rem",
          background:
            "radial-gradient(circle, rgba(255,220,220,0.18) 0%, rgba(255,180,180,0.06) 42%, transparent 72%)",
          opacity: 0.66,
          duration: 18,
          x: [0, 8, 0],
          y: [0, -10, 0],
        },
        {
          top: "34%",
          left: "10%",
          width: "22rem",
          height: "22rem",
          background:
            "radial-gradient(circle, rgba(130,0,60,0.24) 0%, rgba(80,0,40,0.1) 42%, transparent 70%)",
          opacity: 0.56,
          duration: 22,
          x: [0, 12, 0],
          y: [0, 12, 0],
        },
      ],
    },
  },
];

export const musicThemeMap = musicThemes.reduce(
  (map, theme) => {
    map[theme.id] = theme;
    return map;
  },
  {} as Record<MusicTrackId, MusicTheme>
);
