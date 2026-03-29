import { AnimatePresence, motion } from "framer-motion";
import type { MusicTheme } from "../data/musicThemes";

type AnimatedBackgroundProps = {
  theme: MusicTheme;
};

export default function AnimatedBackground({ theme }: AnimatedBackgroundProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{ background: theme.background.base }}
        />

        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: theme.background.pattern,
            backgroundSize: theme.background.patternSize,
          }}
        />

        <div
          className="absolute inset-0 mix-blend-screen"
          style={{ background: theme.background.overlay }}
        />

        <div
          className="absolute inset-0"
          style={{ background: theme.background.veil }}
        />

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
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: glow.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="absolute inset-0 bg-black/35" />
      </motion.div>
    </AnimatePresence>
  );
}
