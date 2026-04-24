import React from "react";
import { motion } from "framer-motion";

export default function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      className="scroll-reveal space-y-4"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.42, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="blade-chip inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-red-200">
          <Icon className="h-4 w-4" />
          Section
        </div>
        <div className="h-px min-w-20 flex-1 bg-gradient-to-r from-red-400/45 via-white/10 to-transparent" />
      </div>
      <h2 className="cinematic-title text-2xl font-black tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      <p className="max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
        {subtitle}
      </p>
    </motion.div>
  );
}
