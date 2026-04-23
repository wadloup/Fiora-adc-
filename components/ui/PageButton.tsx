type PageButtonProps = {
  active: boolean;
  label: string;
  index?: number;
  onClick: () => void;
};

export default function PageButton({
  active,
  label,
  index,
  onClick,
}: PageButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-2xl border px-3 py-2.5 text-[0.86rem] font-semibold transition duration-200 ${
        active
          ? "border-red-300/60 bg-gradient-to-b from-red-500/25 to-red-500/15 text-white shadow-[0_0_22px_rgba(255,0,60,0.22)]"
          : "border-white/10 bg-black/10 text-white/80 hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
      }`}
    >
      {typeof index === "number" ? (
        <span
          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full border px-1 text-[0.62rem] font-black ${
            active
              ? "border-red-200/45 bg-white/[0.12] text-red-50"
              : "border-white/10 bg-white/[0.04] text-white/45 group-hover:text-white/70"
          }`}
        >
          {index + 1}
        </span>
      ) : null}
      <span>{label}</span>
    </button>
  );
}
