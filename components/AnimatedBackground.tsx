import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";
import type { MusicTheme } from "../data/musicThemes";

type AnimatedBackgroundProps = {
  theme: MusicTheme;
  active?: boolean;
};

type ThemeId = MusicTheme["id"];

const backgroundLayerTransition = {
  duration: 0.82,
  ease: [0.22, 1, 0.36, 1] as const,
};

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

function AnimatedBackground({
  theme,
  active = true,
}: AnimatedBackgroundProps) {
  const artwork = theme.background.artwork;
  const artworkIsVideo = artwork?.kind === "video";
  const artworkIsGif = artwork?.src.toLowerCase().endsWith(".gif");
  const [liteMode, setLiteMode] = useState(true);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const reduceEffects = liteMode || !active;
  const shouldRenderVideo = Boolean(artworkIsVideo && active && !liteMode);
  const stillArtworkSrc = artworkIsVideo
    ? artwork?.posterSrc || artwork?.src
    : artwork?.src;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");

    const updateCapability = () => {
      const runtimeNavigator = navigator as Navigator & {
        deviceMemory?: number;
        connection?: { saveData?: boolean };
      };
      const hardwareThreads = runtimeNavigator.hardwareConcurrency || 0;
      const deviceMemory = runtimeNavigator.deviceMemory || 0;
      const saveData = Boolean(runtimeNavigator.connection?.saveData);
      const shouldUseLiteMode =
        reducedMotionQuery.matches ||
        coarsePointerQuery.matches ||
        saveData ||
        (hardwareThreads > 0 && hardwareThreads <= 6) ||
        (deviceMemory > 0 && deviceMemory <= 4);

      setLiteMode(shouldUseLiteMode);
    };

    updateCapability();

    reducedMotionQuery.addEventListener("change", updateCapability);
    coarsePointerQuery.addEventListener("change", updateCapability);

    return () => {
      reducedMotionQuery.removeEventListener("change", updateCapability);
      coarsePointerQuery.removeEventListener("change", updateCapability);
    };
  }, []);

  useEffect(() => {
    const video = activeVideoRef.current;
    if (!video || !shouldRenderVideo) {
      return;
    }

    const startPlayback = () => {
      if (document.hidden) {
        return;
      }

      void video.play().catch(() => {
        // Decorative only: if autoplay is blocked for any reason,
        // the poster still gives an immediate visual switch.
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        return;
      }

      startPlayback();
    };

    video.load();

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      startPlayback();
      return;
    }

    video.addEventListener("canplay", startPlayback, { once: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      video.removeEventListener("canplay", startPlayback);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      video.pause();
    };
  }, [artwork?.src, shouldRenderVideo]);

  return (
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={theme.id}
          initial={{ opacity: 1, scale: 1.006 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.992 }}
          transition={{ ...backgroundLayerTransition, duration: 0.34 }}
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.72 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.68 }}
            transition={backgroundLayerTransition}
            style={{ background: theme.background.base }}
          />

        {artwork && shouldRenderVideo ? (
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 1, scale: 1.006 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.988 }}
            transition={{ ...backgroundLayerTransition, duration: 0.36 }}
          >
            <motion.video
              ref={activeVideoRef}
              key={artwork.src}
              src={artwork.src}
              poster={artwork.posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full"
              initial={{ opacity: artwork.opacity ?? 0.7 }}
              animate={{ opacity: artwork.opacity ?? 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ ...backgroundLayerTransition, duration: 0.36 }}
              style={{
                objectFit: artwork.fit || "cover",
                objectPosition: artwork.position || "center center",
                backgroundColor: "transparent",
                filter: liteMode ? "none" : undefined,
                transform: `scale(${artwork.scale || 1})`,
                willChange: "transform, opacity",
              }}
            />
          </motion.div>
        ) : null}

        {artwork && artworkIsGif ? (
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.988 }}
            transition={backgroundLayerTransition}
          >
            <motion.img
              src={artwork.src}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
              initial={{ opacity: 0.58 }}
              animate={{ opacity: artwork.opacity ?? 0.18 }}
              exit={{ opacity: 0 }}
              transition={backgroundLayerTransition}
              style={{
                objectPosition: artwork.position || "center center",
                filter:
                  artwork.filter ||
                  "grayscale(0.2) contrast(1.04) brightness(0.66)",
                transform: `scale(${artwork.scale || 1.04})`,
                willChange: "transform, opacity",
              }}
            />
          </motion.div>
        ) : null}

        {artwork && stillArtworkSrc && !artworkIsGif && !shouldRenderVideo ? (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: (artwork.scale || 1.04) + 0.025 }}
            animate={
              reduceEffects
                ? {
                    opacity: artwork.opacity ?? 0.18,
                    scale: artwork.scale || 1.04,
                    x: 0,
                    y: 0,
                  }
                : {
                    opacity: artwork.opacity ?? 0.18,
                    scale: [
                      artwork.scale || 1.04,
                      (artwork.scale || 1.04) + 0.03,
                      artwork.scale || 1.04,
                    ],
                    x: [0, -18, 0],
                    y: [0, 10, 0],
                  }
            }
            exit={{ opacity: 0, scale: artwork.scale || 1.04 }}
            transition={
              reduceEffects
                ? backgroundLayerTransition
                : {
                    opacity: backgroundLayerTransition,
                    scale: {
                      duration: 16,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    x: {
                      duration: 16,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    y: {
                      duration: 16,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
            }
            style={{
              backgroundImage: `url("${stillArtworkSrc}")`,
              backgroundPosition: artwork.position || "center center",
              backgroundSize: artwork.fit || "cover",
              filter:
                artwork.filter || "grayscale(0.2) contrast(1.04) brightness(0.66)",
              willChange: reduceEffects ? "auto" : "transform, opacity",
            }}
          />
        ) : null}

        {theme.background.pattern !== "none" ? (
          <motion.div
            className="absolute inset-0 opacity-55"
            initial={{ opacity: 0 }}
            animate={
              reduceEffects
                ? { opacity: 0.38 }
                : { opacity: 0.55, backgroundPosition: ["0% 0%", "100% 40%", "0% 0%"] }
            }
            exit={{ opacity: 0 }}
            transition={
              reduceEffects
                ? backgroundLayerTransition
                : {
                    opacity: backgroundLayerTransition,
                    backgroundPosition: {
                      duration: 26,
                      repeat: Infinity,
                      ease: "linear",
                    },
                  }
            }
            style={{
              backgroundImage: theme.background.pattern,
              backgroundSize: theme.background.patternSize,
            }}
          />
        ) : null}

        {theme.background.overlay !== "none" ? (
          <motion.div
            className="absolute inset-0 mix-blend-screen"
            style={{ background: theme.background.overlay }}
            initial={{ opacity: 0 }}
            animate={
              reduceEffects
                ? { opacity: artworkIsVideo ? 0.18 : 0.4 }
                : {
                    opacity: artworkIsVideo ? [0.22, 0.34, 0.22] : [0.5, 0.82, 0.5],
                  }
            }
            exit={{ opacity: 0 }}
            transition={
              reduceEffects
                ? backgroundLayerTransition
                : {
                    opacity: {
                      duration: artworkIsVideo ? 12 : 9,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
            }
          />
        ) : null}

        {theme.background.veil !== "none" ? (
          <motion.div
            className="absolute inset-0"
            style={{ background: theme.background.veil }}
            initial={{ opacity: 0 }}
            animate={
              reduceEffects
                ? { opacity: artworkIsVideo ? 0.14 : 0.28 }
                : {
                    opacity: artworkIsVideo ? [0.18, 0.3, 0.18] : [0.35, 0.8, 0.35],
                  }
            }
            exit={{ opacity: 0 }}
            transition={
              reduceEffects
                ? backgroundLayerTransition
                : {
                    opacity: {
                      duration: artworkIsVideo ? 11 : 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
            }
          />
        ) : null}

        {!reduceEffects ? renderThemeScene(theme.id) : null}

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
            animate={
              reduceEffects
                ? undefined
                : {
                    x: glow.x,
                    y: glow.y,
                    scale: [1, 1.14, 1],
                    opacity: [
                      glow.opacity * 0.72,
                      glow.opacity,
                      glow.opacity * 0.72,
                    ],
                  }
            }
            transition={
              reduceEffects
                ? undefined
                : {
                    duration: glow.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />
        ))}

        {!artworkIsVideo ? (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={
              reduceEffects
                ? { opacity: 0.14 }
                : { opacity: [0.18, 0.34, 0.18] }
            }
            exit={{ opacity: 0 }}
            transition={
              reduceEffects
                ? backgroundLayerTransition
                : {
                    opacity: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                  }
            }
            style={{
              background:
                "radial-gradient(circle at 50% 120%, rgba(255,255,255,0.08), transparent 38%), radial-gradient(circle at 50% -15%, rgba(255,255,255,0.06), transparent 34%)",
            }}
          />
        ) : null}

        <motion.div
          className={
            artworkIsVideo
              ? "absolute inset-0 bg-black/[0.02]"
              : "absolute inset-0 bg-black/18"
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={backgroundLayerTransition}
        />
        </motion.div>
      </AnimatePresence>
  );
}

export default memo(AnimatedBackground);
