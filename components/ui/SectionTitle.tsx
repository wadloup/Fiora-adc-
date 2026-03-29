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
    <div className="space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-red-200">
        <Icon className="h-4 w-4" />
        Section
      </div>
      <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      <p className="max-w-3xl text-white/70">{subtitle}</p>
    </div>
  );
}
