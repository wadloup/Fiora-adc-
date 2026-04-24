type PageButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

export default function PageButton({
  active,
  label,
  onClick,
}: PageButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`premium-nav-pill shrink-0 whitespace-nowrap rounded-2xl border px-3 py-2.5 text-[0.88rem] font-semibold tracking-[-0.01em] transition duration-200 ${
        active
          ? "border-red-400/70 bg-gradient-to-b from-red-500/28 to-red-500/14 text-white shadow-[0_0_22px_rgba(255,0,60,0.24)]"
          : "border-white/5 bg-transparent text-white/82 hover:border-white/10 hover:bg-white/8 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
