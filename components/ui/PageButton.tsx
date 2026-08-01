import type { LucideIcon } from "lucide-react";

type PageButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  count?: number;
  compact?: boolean;
};

export default function PageButton({
  active,
  label,
  onClick,
  icon: Icon,
  count,
  compact = false,
}: PageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border font-semibold tracking-normal transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/65 ${
        compact
          ? "min-h-9 rounded-md px-3 py-1.5 text-xs"
          : "min-h-10 rounded-lg px-3 py-2 text-sm"
      } ${
        active
          ? "border-red-300/65 bg-red-500/18 text-white shadow-[0_0_18px_rgba(255,0,60,0.2)]"
          : "border-white/10 bg-white/[0.035] text-white/76 hover:-translate-y-0.5 hover:border-white/24 hover:bg-white/[0.075] hover:text-white"
      }`}
    >
      {Icon ? (
        <Icon
          className={`shrink-0 ${compact ? "h-3.5 w-3.5" : "h-4 w-4"} ${
            active ? "text-red-200" : "text-white/48 group-hover:text-white/78"
          }`}
        />
      ) : null}
      <span>{label}</span>
      {count && count > 1 ? (
        <span
          className={`inline-flex min-w-5 items-center justify-center rounded-full border px-1.5 py-0.5 text-[10px] font-black ${
            active
              ? "border-red-200/30 bg-red-200/10 text-red-100"
              : "border-white/10 bg-black/20 text-white/48"
          }`}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
