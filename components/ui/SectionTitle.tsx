import React from "react";

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
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/66">
        <Icon className="h-4 w-4" />
        Section
      </div>
      <h2 className="text-2xl font-black leading-tight tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      <p className="max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
        {subtitle}
      </p>
    </div>
  );
}
