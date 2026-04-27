import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { BookOpen, Brain, Shield, Swords, X } from "lucide-react";

type FirstVisitIntroProps = {
  onClose: () => void;
  onOpenGuide: () => void;
  onOpenSupport: () => void;
  onOpenManga: () => void;
  onOpenIQTest: () => void;
  musicSlot?: ReactNode;
  voteSlot?: ReactNode;
};

const introChoices = [
  {
    label: "Home Page",
    kicker: "ADC route",
    description: "Open the pressure logic, runes, and lane setup first.",
    icon: Swords,
    action: "guide" as const,
  },
  {
    label: "I am support",
    kicker: "Support check",
    description: "Go straight to the support-first part before lane starts.",
    icon: Shield,
    action: "support" as const,
  },
  {
    label: "Test your IQ",
    kicker: "Fake science",
    description: "Five questions, one number, and no emotional refund.",
    icon: Brain,
    action: "iq" as const,
  },
  {
    label: "Read Fiora's Manga",
    kicker: "Manga board",
    description: "Open the reader and let the manga soundtrack take over.",
    icon: BookOpen,
    action: "manga" as const,
  },
];

export default function FirstVisitIntro({
  onClose,
  onOpenGuide,
  onOpenSupport,
  onOpenManga,
  onOpenIQTest,
  musicSlot,
  voteSlot,
}: FirstVisitIntroProps) {
  const runChoice = (action: (typeof introChoices)[number]["action"]) => {
    if (action === "guide") {
      onOpenGuide();
      return;
    }

    if (action === "support") {
      onOpenSupport();
      return;
    }

    if (action === "iq") {
      onOpenIQTest();
      return;
    }

    onOpenManga();
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Fiora ADC intro"
      className="fixed inset-0 z-[140] overflow-x-hidden overflow-y-auto bg-black text-white"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,40,82,0.34),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(0,200,255,0.2),transparent_24%),linear-gradient(135deg,rgba(85,0,18,0.88),rgba(0,0,0,0.96)_44%,rgba(15,5,9,1))]" />
      <div className="intro-cinematic-grid absolute inset-0 opacity-70" />
      <div className="intro-scanline absolute inset-0 opacity-50" />

      <motion.div
        initial={{ x: "-110%" }}
        animate={{ x: ["-110%", "12%", "112%"] }}
        transition={{ duration: 1.18, ease: [0.18, 0.84, 0.22, 1], delay: 0.25 }}
        className="absolute left-0 top-[18%] h-px w-[72vw] bg-gradient-to-r from-transparent via-red-200 to-transparent shadow-[0_0_22px_rgba(255,80,120,0.9)]"
      />
      <motion.div
        initial={{ x: "110%" }}
        animate={{ x: ["110%", "-4%", "-112%"] }}
        transition={{ duration: 1.22, ease: [0.18, 0.84, 0.22, 1], delay: 0.58 }}
        className="absolute right-0 top-[72%] h-px w-[66vw] bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_22px_rgba(0,220,255,0.72)]"
      />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 rounded-2xl border border-white/15 bg-black/50 p-3 text-white/80 backdrop-blur-xl transition hover:border-red-300/50 hover:text-red-100"
        aria-label="Skip intro"
      >
        <X className="h-5 w-5" />
      </button>

      {musicSlot ? (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.42, ease: "easeOut", delay: 1.05 }}
          className="absolute right-4 top-20 z-20 hidden w-[330px] md:block"
        >
          {musicSlot}
        </motion.div>
      ) : null}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-8 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.25 }}
          className="max-w-4xl"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.42em" }}
            animate={{ opacity: 1, letterSpacing: "0.28em" }}
            transition={{ duration: 0.65, delay: 0.45 }}
            className="max-w-3xl text-sm font-black tracking-[0.08em] text-red-200 md:text-base"
          >
            Oh, a new visitor. I hope your IQ is above two digits :)
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.68, ease: "easeOut", delay: 0.75 }}
            className="mt-4 text-[clamp(3.1rem,9vw,7.8rem)] font-black uppercase leading-[0.82] tracking-[-0.075em] text-white"
          >
            Fiora ADC
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 1.15 }}
            className="mt-5 grid max-w-3xl gap-2 text-lg font-black uppercase tracking-[0.04em] text-red-100 md:text-2xl"
          >
            <span className="text-white/92">Surprise guaranteed.</span>
            <span className="text-red-200">Right pressure.</span>
            <span className="bg-gradient-to-r from-white via-red-100 to-cyan-100 bg-clip-text text-transparent">
              Pick your route.
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 1.65 }}
          className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4"
        >
          {introChoices.map((choice, index) => {
            const Icon = choice.icon;

            return (
              <motion.button
                key={choice.action}
                type="button"
                onClick={() => runChoice(choice.action)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 1.88 + index * 0.12 }}
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                className="group relative min-h-[156px] overflow-hidden rounded-3xl border border-white/14 bg-white/[0.045] p-4 text-left shadow-[0_20px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl transition hover:border-red-300/60 hover:bg-red-500/[0.09]"
              >
                <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-red-200/70 to-transparent opacity-0 transition group-hover:opacity-100" />
                <span className="flex items-center justify-between gap-3">
                  <span className="rounded-2xl border border-red-300/25 bg-red-500/12 p-2.5 text-red-100">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/55">
                    {choice.kicker}
                  </span>
                </span>
                <span className="mt-5 block text-2xl font-black leading-tight tracking-[-0.03em] text-white">
                  {choice.label}
                </span>
                <span className="mt-2 block text-sm leading-6 text-white/68">
                  {choice.description}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {voteSlot ? (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, ease: "easeOut", delay: 2.08 }}
            className="mt-5 w-full max-w-[56rem]"
          >
            {voteSlot}
          </motion.div>
        ) : null}

        {musicSlot ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 2.22 }}
            className="mt-5 w-full max-w-[330px] md:hidden"
          >
            {musicSlot}
          </motion.div>
        ) : null}

      </div>
    </motion.div>
  );
}
