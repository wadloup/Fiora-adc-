import React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function NeonCard({
  className = "",
  children,
  noBlur = false,
}: {
  className?: string;
  children: React.ReactNode;
  noBlur?: boolean;
}) {
  return (
    <div
      className={cn(
        noBlur
          ? "rounded-3xl border border-red-500/25 bg-[rgba(20,6,10,0.72)] shadow-[0_0_24px_rgba(255,0,60,0.12)]"
          : "rounded-3xl border border-red-500/25 bg-white/[0.04] backdrop-blur-md shadow-[0_0_24px_rgba(255,0,60,0.12)]",
        className
      )}
    >
      {children}
    </div>
  );
}
