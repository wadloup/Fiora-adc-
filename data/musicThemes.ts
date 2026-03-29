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
      posterSrc?: string;
      fit?: "cover" | "contain";
      position?: string;
      opacity?: number;
      scale?: number;
      filter?: string;
    };
    glows: ThemeGlow[];
  };
};

export const defaultMusicTrackId: MusicTrackId = "come-home";

const defaultComeHomeBlobUrl =
  "https://lsqneo6b3ck4w3wn.public.blob.vercel-storage.com/87094-601076610.mov";

const comeHomeBackgroundOverride =
  import.meta.env.VITE_COME_HOME_BACKGROUND_URL?.trim() || "";

const comeHomeBackgroundSrc =
  comeHomeBackgroundOverride ||
  defaultComeHomeBlobUrl ||
  "/backgrounds/come-home-wallpaper.jpg";

const inferArtworkKind = (src: string): "image" | "video" =>
  /\.(mp4|webm|mov|m4v)(\?|$)/i.test(src) ? "video" : "image";

const comeHomeBackgroundKind = inferArtworkKind(comeHomeBackgroundSrc);

export const musicThemes: MusicTheme[] = [
  {
    id: "come-home",
    label: "Come Home",
    subtitle: "Dark / emotional / blood-red pulse",
    mood: "Emotional duel pressure",
    src: "/audio/Jace June - Come Home (Sped Up).mp3",
    background: {
      base: "linear-gradient(180deg, #020202 0%, #070707 46%, #020202 100%)",
      overlay: "none",
      pattern: "none",
      patternSize: "100% 100%",
      veil: "none",
      artwork: {
        src: comeHomeBackgroundSrc,
        kind: comeHomeBackgroundKind,
        posterSrc: "/backgrounds/come-home-wallpaper.jpg",
        fit: "cover",
        position: "center center",
        opacity: 1,
        scale: comeHomeBackgroundKind === "video" ? 1 : 1.03,
        filter:
          comeHomeBackgroundKind === "video"
            ? "contrast(1.01) saturate(1.02) brightness(0.96)"
            : "contrast(1.06) saturate(1.04) brightness(0.8)",
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
      base: "linear-gradient(180deg, #020202 0%, #070506 42%, #010101 100%)",
      overlay:
        "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(120,0,24,0.04) 44%, rgba(0,0,0,0.14) 100%)",
      pattern: "none",
      patternSize: "100% 100%",
      veil: "radial-gradient(circle at 50% 8%, rgba(255,255,255,0.06), transparent 42%)",
      artwork: {
        src: "/backgrounds/lilium-wallpaper.mp4",
        kind: "video",
        posterSrc: "/backgrounds/lilium-wallpaper.jpg",
        fit: "cover",
        position: "center center",
        opacity: 0.96,
        scale: 1,
        filter: "contrast(1.01) saturate(0.92) brightness(0.86)",
      },
      glows: [],
    },
  },
  {
    id: "sleaze-on-it",
    label: "Sleaze On It",
    subtitle: "Chaotic / club / neon overload",
    mood: "Dirty hyperpop night",
    src: "/audio/sleaze-on-it.mp3",
    background: {
      base: "linear-gradient(180deg, #010101 0%, #06060a 44%, #010101 100%)",
      overlay:
        "linear-gradient(135deg, rgba(255, 0, 120, 0.06) 0%, rgba(0, 255, 240, 0.04) 48%, rgba(0,0,0,0.14) 100%)",
      pattern: "none",
      patternSize: "100% 100%",
      veil: "radial-gradient(circle at 50% -10%, rgba(255,0,160,0.08), transparent 46%)",
      artwork: {
        src: "/backgrounds/sleaze-wallpaper.mp4",
        kind: "video",
        posterSrc: "/backgrounds/sleaze-wallpaper.jpg",
        fit: "cover",
        position: "center center",
        opacity: 0.98,
        scale: 1,
        filter: "contrast(1.05) saturate(1.08) brightness(0.84)",
      },
      glows: [],
    },
  },
  {
    id: "love-sillage",
    label: "Love Sillage",
    subtitle: "Dreamy / glossy / reflective dark",
    mood: "Soft romance in midnight light",
    src: "/audio/love-sillage.mp3",
    background: {
      base: "linear-gradient(180deg, #05060d 0%, #0f0a14 46%, #04060d 100%)",
      overlay:
        "linear-gradient(135deg, rgba(255, 150, 220, 0.06) 0%, rgba(120, 190, 255, 0.06) 45%, rgba(0,0,0,0.12) 100%)",
      pattern: "none",
      patternSize: "100% 100%",
      veil: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05), transparent 42%)",
      artwork: {
        src: "/backgrounds/love-sillage-wallpaper.mp4",
        kind: "video",
        posterSrc: "/backgrounds/love-sillage-wallpaper.jpg",
        fit: "cover",
        position: "center center",
        opacity: 0.97,
        scale: 1,
        filter: "contrast(1.03) saturate(1.05) brightness(0.88)",
      },
      glows: [],
    },
  },
  {
    id: "marioneta",
    label: "MARIONETA (sped up)",
    subtitle: "Theatrical / puppet-stage / eerie elegance",
    mood: "Stage lights and tension strings",
    src: "/audio/marioneta-sped-up.mp3",
    background: {
      base: "linear-gradient(180deg, #050305 0%, #12070b 42%, #040204 100%)",
      overlay:
        "linear-gradient(180deg, rgba(120,0,40,0.12) 0%, rgba(90,0,40,0.18) 42%, rgba(0,0,0,0.16) 100%)",
      pattern: "none",
      patternSize: "100% 100%",
      veil: "radial-gradient(circle at 50% -10%, rgba(255,255,255,0.04), transparent 40%)",
      artwork: {
        src: "/backgrounds/marioneta-wallpaper.mp4",
        kind: "video",
        posterSrc: "/backgrounds/marioneta-wallpaper.jpg",
        fit: "cover",
        position: "center center",
        opacity: 0.94,
        scale: 1,
        filter: "contrast(1.05) saturate(0.86) brightness(0.54)",
      },
      glows: [],
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
