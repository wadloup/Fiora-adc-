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
      className={`shrink-0 whitespace-nowrap rounded-xl border px-3 py-2 text-sm transition ${
        active
          ? "border-red-500/40 bg-red-500/15 text-red-300"
          : "border-transparent text-white/75 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
