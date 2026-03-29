type IconRowProps = {
  icons: string[];
};

const DEFAULT_RUNE_ICON =
  "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png";

function recoverAssetImage(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallback: string
) {
  const img = event.currentTarget;
  if (img.src !== fallback) {
    img.src = fallback;
  }
}

export default function IconRow({ icons }: IconRowProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {icons.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className="flex aspect-square items-center justify-center rounded-xl border border-red-500/30 bg-black/50 p-2"
        >
          <img
            src={src}
            alt="rune icon"
            className="h-full w-full object-contain"
            onError={(event) => recoverAssetImage(event, DEFAULT_RUNE_ICON)}
          />
        </div>
      ))}
    </div>
  );
}
