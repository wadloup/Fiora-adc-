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
    <div className="border-b border-white/12 pb-4 md:pb-5">
      <div className="flex items-start gap-3.5 md:gap-4">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-red-300/30 bg-red-500/[0.1] text-red-100 shadow-[0_0_16px_rgba(255,0,60,0.1)] md:h-10 md:w-10">
          <Icon className="h-4 w-4 md:h-[1.125rem] md:w-[1.125rem]" />
        </span>
        <div className="min-w-0">
          <h2 className="text-2xl font-black leading-tight text-white md:text-[2rem]">
            {title}
          </h2>
          <p className="mt-1 max-w-[72ch] text-sm leading-relaxed text-white/64 md:text-[15px]">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
