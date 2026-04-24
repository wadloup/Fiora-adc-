import { motion } from "framer-motion";
import { ArrowDown, BookOpen, Play, Shield, Swords } from "lucide-react";
import type { ReactNode } from "react";
import { homeHeroImage } from "../data/siteData";
import { cn } from "../utils/cn";

type StudioHeroProps = {
  launchCooldown: boolean;
  searchSlot: ReactNode;
  onStartExperience: () => void;
  onOpenGuide: () => void;
  onOpenSupport: () => void;
  onOpenManga: () => void;
};

const routeCards = [
  {
    label: "ADC route",
    title: "I play Fiora",
    description: "Pressure logic, rune setup, early spikes, and why the lane works.",
    icon: Swords,
    action: "guide" as const,
  },
  {
    label: "Support route",
    title: "Support check",
    description: "Engage timing, peel windows, wave sync, and lane access.",
    icon: Shield,
    action: "support" as const,
  },
  {
    label: "Manga board",
    title: "Read manga",
    description: "Open the cinematic reader and let the dedicated soundtrack take over.",
    icon: BookOpen,
    action: "manga" as const,
  },
];

export default function StudioHero({
  launchCooldown,
  searchSlot,
  onStartExperience,
  onOpenGuide,
  onOpenSupport,
  onOpenManga,
}: StudioHeroProps) {
  const runAction = (action: (typeof routeCards)[number]["action"]) => {
    if (action === "guide") {
      onOpenGuide();
      return;
    }

    if (action === "support") {
      onOpenSupport();
      return;
    }

    onOpenManga();
  };

  return (
    <section className="studio-hero relative min-h-[calc(100svh-6.5rem)] overflow-hidden rounded-[2.2rem] border border-white/12 bg-[#050507] shadow-[0_34px_120px_rgba(0,0,0,0.56)]">
      <div className="absolute inset-0">
        <motion.img
          src={homeHeroImage}
          alt="Fiora cinematic background"
          className="h-full w-full object-cover opacity-[0.72]"
          style={{ objectPosition: "center 24%" }}
          initial={{ scale: 1.08, x: 0 }}
          animate={{ scale: [1.08, 1.12, 1.08], x: [0, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,50,80,0.22),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.58)_36%,rgba(0,0,0,0.22)_62%,rgba(0,0,0,0.84)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_14%,rgba(70,0,18,0.2)_68%,rgba(0,0,0,0.92)_100%)]" />
        <div className="studio-depth-grid absolute inset-0" />
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute left-[6%] top-[16%] h-[52vh] w-px bg-gradient-to-b from-transparent via-red-200/42 to-transparent shadow-[0_0_26px_rgba(255,50,90,0.48)]"
        animate={{ opacity: [0.26, 0.72, 0.26], scaleY: [0.72, 1, 0.72] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-[9%] top-[10%] h-[44vh] w-px bg-gradient-to-b from-transparent via-white/35 to-transparent shadow-[0_0_22px_rgba(255,255,255,0.25)]"
        animate={{ opacity: [0.18, 0.54, 0.18], scaleY: [1, 0.76, 1] }}
        transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 grid min-h-[calc(100svh-6.5rem)] gap-6 p-4 md:p-6 lg:grid-cols-[minmax(0,1.06fr)_minmax(340px,0.62fr)] lg:p-8">
        <div className="flex min-h-[34rem] flex-col justify-end pb-2 pt-14 lg:min-h-0">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-5xl"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-red-300/20 bg-black/28 px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-red-100 shadow-[0_0_28px_rgba(255,0,60,0.12)] backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-red-300 shadow-[0_0_14px_rgba(255,80,110,0.75)]" />
              Bot lane heresy / blade protocol
            </div>

            <h1 className="mt-5 max-w-[10ch] text-[clamp(4.4rem,12vw,10.8rem)] font-black uppercase leading-[0.78] tracking-[-0.105em] text-white drop-shadow-[0_26px_52px_rgba(0,0,0,0.62)]">
              Fiora
              <span className="studio-title-cut block bg-gradient-to-r from-white via-red-100 to-red-400 bg-clip-text text-transparent">
                ADC
              </span>
            </h1>

            <div className="mt-6 grid max-w-3xl gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-2xl text-base leading-8 text-white/78 md:text-lg">
                A dangerous, precise, support-dependent guide staged like a
                carry lab. Pick the route, start the sound, and read the lane
                like a duel instead of a checklist.
              </p>

              <button
                type="button"
                onClick={onStartExperience}
                disabled={launchCooldown}
                className={cn(
                  "studio-primary-cta group inline-flex min-h-[4.25rem] items-center justify-center gap-3 rounded-2xl border border-red-200/50 bg-red-500/18 px-5 text-sm font-black uppercase tracking-[0.18em] text-red-50 shadow-[0_22px_70px_rgba(255,0,70,0.2)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-red-100/80 hover:bg-red-500/24",
                  launchCooldown && "cursor-not-allowed opacity-60"
                )}
              >
                <span className="rounded-xl bg-white/10 p-2 text-white">
                  <Play className="h-4 w-4 fill-current" />
                </span>
                Start experience
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
            className="mt-8 grid gap-3 md:grid-cols-3"
          >
            {routeCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <motion.button
                  key={card.action}
                  type="button"
                  onClick={() => runAction(card.action)}
                  className="studio-route-card group min-h-[11.5rem] rounded-[1.65rem] border border-white/12 bg-white/[0.045] p-4 text-left shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl transition"
                  whileHover={{ y: -8, rotateX: 3, rotateY: index === 1 ? 0 : index === 0 ? -4 : 4 }}
                  whileTap={{ scale: 0.985 }}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="rounded-2xl border border-red-300/22 bg-red-500/12 p-2.5 text-red-100">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/24 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/58">
                      {card.label}
                    </span>
                  </span>
                  <span className="mt-5 block text-xl font-black leading-tight text-white">
                    {card.title}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-white/66">
                    {card.description}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 28, rotateY: -8 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.78, ease: "easeOut", delay: 0.18 }}
          className="studio-command-panel self-end rounded-[2rem] border border-white/14 bg-black/42 p-4 shadow-[0_32px_110px_rgba(0,0,0,0.52)] backdrop-blur-2xl lg:sticky lg:top-28"
        >
          <div className="rounded-[1.45rem] border border-red-300/18 bg-red-500/[0.06] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-red-200">
              Command deck
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] text-white">
              Find the right window.
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/66">
              Search a page, matchup, rune, or route. The site should feel like
              a weapon, not a maze.
            </p>
          </div>

          <div className="mt-4">{searchSlot}</div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              ["11", "chapters"],
              ["30", "manga pages"],
              ["3", "routes"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-3"
              >
                <p className="text-xl font-black text-white">{value}</p>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/42">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.aside>
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/28 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/52 backdrop-blur-xl md:flex"
        animate={{ y: [0, 7, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll
        <ArrowDown className="h-3.5 w-3.5" />
      </motion.div>
    </section>
  );
}
