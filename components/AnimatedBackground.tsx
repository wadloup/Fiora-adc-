import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";
import { musicThemes, type MusicTheme } from "../data/musicThemes";

type AnimatedBackgroundProps = {
  theme: MusicTheme;
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

function AnimatedBackground({ theme }: AnimatedBackgroundProps) {
  const artwork = theme.background.artwork;
  const artworkIsVideo = artwork?.kind === "video";
  const artworkIsGif = artwork?.src.toLowerCase().endsWith(".gif");
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorFxEnabled, setCursorFxEnabled] = useState(false);
  const [liteMode, setLiteMode] = useState(false);
  const [videoReady, setVideoReady] = useState(!artworkIsVideo);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorVisibleRef = useRef(false);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const warmedVideoSrcsRef = useRef<Set<string>>(new Set());
  const backgroundPreloadVideosRef = useRef<Map<string, HTMLVideoElement>>(
    new Map()
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
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
      setCursorFxEnabled(mediaQuery.matches && !shouldUseLiteMode);
    };

    updateCapability();

    mediaQuery.addEventListener("change", updateCapability);
    reducedMotionQuery.addEventListener("change", updateCapability);
    coarsePointerQuery.addEventListener("change", updateCapability);

    return () => {
      mediaQuery.removeEventListener("change", updateCapability);
      reducedMotionQuery.removeEventListener("change", updateCapability);
      coarsePointerQuery.removeEventListener("change", updateCapability);
    };
  }, []);

  useEffect(() => {
    if (!cursorFxEnabled || typeof window === "undefined") {
      cursorVisibleRef.current = false;
      setCursorVisible(false);
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);

      if (!cursorVisibleRef.current) {
        cursorVisibleRef.current = true;
        setCursorVisible(true);
      }
    };

    const onPointerLeave = () => {
      if (!cursorVisibleRef.current) {
        return;
      }

      cursorVisibleRef.current = false;
      setCursorVisible(false);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
    };
  }, [cursorFxEnabled, cursorX, cursorY]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;

    if (cursorFxEnabled) {
      root.classList.add("custom-cursor-active");
    } else {
      root.classList.remove("custom-cursor-active");
    }

    return () => {
      root.classList.remove("custom-cursor-active");
    };
  }, [cursorFxEnabled]);

  useEffect(() => {
    setVideoReady(!artworkIsVideo);
  }, [artwork?.src, artworkIsVideo]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    musicThemes.forEach((themeOption) => {
      const themeArtwork = themeOption.background.artwork;
      if (!themeArtwork) {
        return;
      }

      const posterSrc = themeArtwork.posterSrc || themeArtwork.src;
      if (!posterSrc) {
        return;
      }

      const image = new Image();
      image.src = posterSrc;
    });
  }, []);

  useEffect(() => {
    const video = activeVideoRef.current;
    if (!video || !artworkIsVideo) {
      return;
    }

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setVideoReady(true);
    }
  }, [artwork?.src, artworkIsVideo]);

  useEffect(() => {
    if (
      typeof document === "undefined" ||
      liteMode
    ) {
      return;
    }

    const currentThemeIndex = musicThemes.findIndex(
      (themeOption) => themeOption.id === theme.id
    );

    if (currentThemeIndex === -1) {
      return;
    }

    const warmTargets = [
      musicThemes[(currentThemeIndex + 1) % musicThemes.length],
      musicThemes[
        (currentThemeIndex - 1 + musicThemes.length) % musicThemes.length
      ],
    ]
      .map((themeOption) => themeOption.background.artwork)
      .filter(
        (themeArtwork): themeArtwork is NonNullable<typeof themeArtwork> =>
          Boolean(themeArtwork?.kind === "video" && themeArtwork.src)
      );

    const timers: number[] = [];

    warmTargets.forEach((themeArtwork, index) => {
      if (warmedVideoSrcsRef.current.has(themeArtwork.src)) {
        return;
      }

      const timer = window.setTimeout(() => {
        if (
          warmedVideoSrcsRef.current.has(themeArtwork.src) ||
          backgroundPreloadVideosRef.current.has(themeArtwork.src)
        ) {
          return;
        }

        const preloadVideo = document.createElement("video");
        preloadVideo.src = themeArtwork.src;
        preloadVideo.preload = "auto";
        preloadVideo.muted = true;
        preloadVideo.playsInline = true;
        preloadVideo.style.position = "fixed";
        preloadVideo.style.width = "1px";
        preloadVideo.style.height = "1px";
        preloadVideo.style.opacity = "0";
        preloadVideo.style.pointerEvents = "none";
        preloadVideo.style.left = "-9999px";
        preloadVideo.style.top = "-9999px";

        document.body.appendChild(preloadVideo);
        preloadVideo.load();

        backgroundPreloadVideosRef.current.set(themeArtwork.src, preloadVideo);
        warmedVideoSrcsRef.current.add(themeArtwork.src);
      }, 180 + index * 240);

      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [liteMode, theme.id]);

  useEffect(() => {
    const preloadVideos = backgroundPreloadVideosRef.current;
    const warmedVideoSrcs = warmedVideoSrcsRef.current;

    return () => {
      preloadVideos.forEach((preloadVideo) => {
        preloadVideo.remove();
      });
      preloadVideos.clear();
      warmedVideoSrcs.clear();
    };
  }, []);

  const cursorLens =
    cursorFxEnabled && cursorVisible ? (
      <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
        <motion.div
          className="absolute h-[5.4rem] w-[5.4rem] rounded-full"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.07) 44%, transparent 74%)",
            filter: "blur(7px)",
            mixBlendMode: "screen",
            willChange: "transform, opacity",
            opacity: 0.7,
          }}
        />

        <motion.div
          className="absolute h-[3.2rem] w-[3.2rem] rounded-full"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
            background: "transparent",
            border: "2px solid rgba(16,16,16,0.9)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.26), 0 0 10px rgba(255,255,255,0.1)",
            willChange: "transform",
          }}
        />

        <motion.div
          className="absolute h-[2.35rem] w-[2.35rem] rounded-full"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 52%, transparent 76%)",
            willChange: "transform",
          }}
        />
      </div>
    ) : null;

  return (
    <>
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={theme.id}
          initial={{ opacity: 0, scale: 1.018 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.992 }}
          transition={backgroundLayerTransition}
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

        {artwork && artworkIsVideo ? (
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.988 }}
            transition={{ ...backgroundLayerTransition, duration: 1.02 }}
          >
            {artwork.posterSrc ? (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0.42 }}
                animate={{ opacity: videoReady ? 0.16 : artwork.opacity ?? 0.94 }}
                exit={{ opacity: 0 }}
                transition={{ ...backgroundLayerTransition, duration: 0.52 }}
                style={{
                  backgroundImage: `url("${artwork.posterSrc}")`,
                  backgroundPosition: artwork.position || "center center",
                  backgroundSize: artwork.fit || "cover",
                  filter:
                    artwork.filter || "contrast(1.03) saturate(0.98) brightness(0.84)",
                  transform: `scale(${artwork.scale || 1})`,
                  willChange: "opacity",
                }}
              />
            ) : null}

            <motion.video
              ref={activeVideoRef}
              key={artwork.src}
              src={artwork.src}
              poster={artwork.posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: videoReady ? (artwork.opacity ?? 0.7) : 0 }}
              exit={{ opacity: 0 }}
              transition={{ ...backgroundLayerTransition, duration: 1.08 }}
              onLoadedData={() => setVideoReady(true)}
              onCanPlay={() => setVideoReady(true)}
              onPlaying={() => setVideoReady(true)}
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

        {artwork && !artworkIsGif && !artworkIsVideo ? (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: (artwork.scale || 1.04) + 0.025 }}
            animate={{
              opacity: artwork.opacity ?? 0.18,
              scale: [artwork.scale || 1.04, (artwork.scale || 1.04) + 0.03, artwork.scale || 1.04],
              x: [0, -18, 0],
              y: [0, 10, 0],
            }}
            exit={{ opacity: 0, scale: artwork.scale || 1.04 }}
            transition={{
              opacity: backgroundLayerTransition,
              scale: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 16, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              backgroundImage: `url("${artwork.src}")`,
              backgroundPosition: artwork.position || "center center",
              backgroundSize: artwork.fit || "cover",
              filter:
                artwork.filter || "grayscale(0.2) contrast(1.04) brightness(0.66)",
              willChange: "transform, opacity",
            }}
          />
        ) : null}

        {theme.background.pattern !== "none" ? (
          <motion.div
            className="absolute inset-0 opacity-55"
            initial={{ opacity: 0 }}
            animate={
              liteMode
                ? { opacity: 0.38 }
                : { opacity: 0.55, backgroundPosition: ["0% 0%", "100% 40%", "0% 0%"] }
            }
            exit={{ opacity: 0 }}
            transition={
              liteMode
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
              liteMode
                ? { opacity: artworkIsVideo ? 0.18 : 0.4 }
                : {
                    opacity: artworkIsVideo ? [0.22, 0.34, 0.22] : [0.5, 0.82, 0.5],
                  }
            }
            exit={{ opacity: 0 }}
            transition={
              liteMode
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
              liteMode
                ? { opacity: artworkIsVideo ? 0.14 : 0.28 }
                : {
                    opacity: artworkIsVideo ? [0.18, 0.3, 0.18] : [0.35, 0.8, 0.35],
                  }
            }
            exit={{ opacity: 0 }}
            transition={
              liteMode
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

        {!liteMode ? renderThemeScene(theme.id) : null}

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
              liteMode
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
              liteMode
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
            animate={liteMode ? { opacity: 0.14 } : { opacity: [0.18, 0.34, 0.18] }}
            exit={{ opacity: 0 }}
            transition={
              liteMode
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
      {cursorLens}
    </>
  );
}

export default memo(AnimatedBackground);
