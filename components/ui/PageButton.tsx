import React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function PageButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3 py-2 text-sm transition",
        active
          ? "border-red-500/40 bg-red-500/15 text-red-300"
          : "border-transparent text-white/75 hover:bg-white/5 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}
