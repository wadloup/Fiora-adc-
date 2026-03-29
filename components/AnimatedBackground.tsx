import { AnimatePresence, motion } from "framer-motion";
import type { MusicTheme } from "../data/musicThemes";

type AnimatedBackgroundProps = {
  theme: MusicTheme;
};

type ThemeId = MusicTheme["id"];

function renderThemeScene(themeId: ThemeId) {
  switch (themeId) {
    case "come-home":
      return null;

    case "lilium":
      return (
        <>
          <motion.div
            className="absolute inset-x-[18%] top-0 h-[70%] blur-[2px]"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 88px), linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(180,0,30,0.08) 52%, transparent 100%)",
              clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
            }}
            animate={{ opacity: [0.45, 0.78, 0.45] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-1/2 top-0 h-[78%] w-[16rem] -translate-x-1/2 blur-[90px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.26) 0%, rgba(255,220,220,0.14) 32%, rgba(140,0,24,0.1) 65%, transparent 100%)",
            }}
            animate={{ opacity: [0.35, 0.62, 0.35], y: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-[14%] top-[18%] h-[20rem] w-[20rem] rounded-full blur-[110px]"
            style={{
              background:
                "radial-gradient(circle, rgba(180,0,40,0.28) 0%, rgba(90,0,24,0.14) 42%, transparent 72%)",
            }}
            animate={{ x: [0, 18, 0], y: [0, 18, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      );

    case "sleaze-on-it":
      return (
        <>
          <motion.div
            className="absolute inset-y-[-15%] left-[-12%] w-[35%] rotate-[18deg] blur-[70px]"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(255,0,160,0.42) 28%, rgba(255,40,120,0.18) 55%, transparent 100%)",
            }}
            animate={{ x: [0, 180, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-y-[-18%] right-[-10%] w-[28%] rotate-[-16deg] blur-[78px]"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(0,255,240,0.35) 30%, rgba(0,150,255,0.16) 56%, transparent 100%)",
            }}
            animate={{ x: [0, -170, 0], opacity: [0.35, 0.78, 0.35] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-[8%] h-[9rem]"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 14px, transparent 14px 50px)",
            }}
            animate={{ x: [0, 50, 0], opacity: [0.15, 0.34, 0.15] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          />
        </>
      );

    case "love-sillage":
      return (
        <>
          <motion.div
            className="absolute inset-y-[-20%] left-[12%] w-[26%] rotate-[24deg] blur-[90px]"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(255,150,220,0.28) 35%, rgba(255,255,255,0.12) 52%, transparent 100%)",
            }}
            animate={{ x: [0, 120, 0], opacity: [0.24, 0.55, 0.24] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[8%] top-[12%] h-[22rem] w-[22rem] rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgba(120,170,255,0.26) 0%, rgba(130,100,255,0.12) 45%, transparent 72%)",
            }}
            animate={{ x: [0, -18, 0], y: [0, 18, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-[18%] top-[48%] h-[14rem] w-[14rem] rounded-full blur-[90px]"
            style={{
              background:
                "radial-gradient(circle, rgba(255,180,220,0.24) 0%, rgba(255,120,190,0.1) 46%, transparent 72%)",
            }}
            animate={{ x: [0, 22, 0], y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      );

    case "marioneta":
      return (
        <>
          <motion.div
            className="absolute left-[14%] top-0 h-[82%] w-[14rem] blur-[100px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,235,235,0.2) 0%, rgba(255,205,205,0.1) 24%, rgba(90,0,30,0.08) 58%, transparent 100%)",
            }}
            animate={{ opacity: [0.22, 0.5, 0.22], x: [0, 18, 0] }}
            transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[14%] top-0 h-[82%] w-[14rem] blur-[100px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,235,235,0.18) 0%, rgba(210,150,170,0.08) 26%, rgba(90,0,40,0.08) 58%, transparent 100%)",
            }}
            animate={{ opacity: [0.2, 0.48, 0.2], x: [0, -18, 0] }}
            transition={{ duration: 7.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-x-0 top-0 h-[24%]"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0 2px, transparent 2px 120px)",
            }}
            animate={{ opacity: [0.12, 0.28, 0.12] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      );
  }

  return null;
}

export default function AnimatedBackground({ theme }: AnimatedBackgroundProps) {
  const artwork = theme.background.artwork;
  const artworkIsVideo = artwork?.kind === "video";
  const artworkIsGif = artwork?.src.toLowerCase().endsWith(".gif");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{ background: theme.background.base }}
        />

        {artwork && artworkIsVideo ? (
          <div className="absolute inset-0 overflow-hidden">
            <video
              key={artwork.src}
              src={artwork.src}
              poster={artwork.posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="h-full w-full"
              style={{
                objectFit: artwork.fit || "cover",
                objectPosition: artwork.position || "center center",
                backgroundColor: "transparent",
                opacity: artwork.opacity ?? 0.7,
                filter:
                  artwork.filter ||
                  "grayscale(0.08) contrast(1.02) brightness(0.7)",
                transform: `scale(${artwork.scale || 1})`,
              }}
            />
          </div>
        ) : null}

        {artwork && artworkIsGif ? (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={artwork.src}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
              style={{
                objectPosition: artwork.position || "center center",
                opacity: artwork.opacity ?? 0.18,
                filter:
                  artwork.filter ||
                  "grayscale(0.2) contrast(1.04) brightness(0.66)",
                transform: `scale(${artwork.scale || 1.04})`,
              }}
            />
          </div>
        ) : null}

        {artwork && !artworkIsGif && !artworkIsVideo ? (
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("${artwork.src}")`,
              backgroundPosition: artwork.position || "center center",
              backgroundSize: artwork.fit || "cover",
              opacity: artwork.opacity ?? 0.18,
              filter:
                artwork.filter || "grayscale(0.2) contrast(1.04) brightness(0.66)",
            }}
            animate={{
              scale: [artwork.scale || 1.04, (artwork.scale || 1.04) + 0.03, artwork.scale || 1.04],
              x: [0, -18, 0],
              y: [0, 10, 0],
            }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}

        {theme.background.pattern !== "none" ? (
          <motion.div
            className="absolute inset-0 opacity-55"
            style={{
              backgroundImage: theme.background.pattern,
              backgroundSize: theme.background.patternSize,
            }}
            animate={{ backgroundPosition: ["0% 0%", "100% 40%", "0% 0%"] }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          />
        ) : null}

        {theme.background.overlay !== "none" ? (
          <motion.div
            className="absolute inset-0 mix-blend-screen"
            style={{ background: theme.background.overlay }}
            animate={{ opacity: artworkIsVideo ? [0.22, 0.34, 0.22] : [0.5, 0.82, 0.5] }}
            transition={{ duration: artworkIsVideo ? 12 : 9, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}

        {theme.background.veil !== "none" ? (
          <motion.div
            className="absolute inset-0"
            style={{ background: theme.background.veil }}
            animate={{ opacity: artworkIsVideo ? [0.18, 0.3, 0.18] : [0.35, 0.8, 0.35] }}
            transition={{ duration: artworkIsVideo ? 11 : 8, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}

        {renderThemeScene(theme.id)}

        {theme.background.glows.map((glow, index) => (
          <motion.div
            key={`${theme.id}-${index}`}
            className="absolute rounded-full blur-3xl"
            style={{
              top: glow.top,
              left: glow.left,
              width: glow.width,
              height: glow.height,
              background: glow.background,
              opacity: glow.opacity,
            }}
            animate={{
              x: glow.x,
              y: glow.y,
              scale: [1, 1.14, 1],
              opacity: [glow.opacity * 0.72, glow.opacity, glow.opacity * 0.72],
            }}
            transition={{
              duration: glow.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {!artworkIsVideo ? (
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 120%, rgba(255,255,255,0.08), transparent 38%), radial-gradient(circle at 50% -15%, rgba(255,255,255,0.06), transparent 34%)",
            }}
            animate={{ opacity: [0.18, 0.34, 0.18] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}

        <div
          className={
            artworkIsVideo
              ? "absolute inset-0 bg-black/[0.02]"
              : "absolute inset-0 bg-black/18"
          }
        />
      </motion.div>
    </AnimatePresence>
  );
}
