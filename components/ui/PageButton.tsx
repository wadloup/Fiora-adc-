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
      className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-[0.82rem] font-semibold tracking-[-0.01em] transition duration-200 ${
        active
          ? "border-white/18 bg-white/[0.1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          : "border-transparent bg-transparent text-white/62 hover:border-white/10 hover:bg-white/[0.055] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
