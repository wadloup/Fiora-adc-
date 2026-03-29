import React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function NeonCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-red-500/25 bg-white/[0.04] backdrop-blur-md shadow-[0_0_24px_rgba(255,0,60,0.12)]",
        className
      )}
    >
      {children}
    </div>
  );
}
