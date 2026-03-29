import type React from "react";

type IconRowProps = {
  icons: string[];
};

const DEFAULT_RUNE_ICON =
  "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png";

function recoverAssetImage(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallback: string = DEFAULT_RUNE_ICON
) {
  const img = event.currentTarget;
  if (img.src !== fallback) {
    img.src = fallback;
  }
}

export default function IconRow({ icons }: IconRowProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {icons.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-red-500/30 bg-black/50"
        >
          <img
            src={src}
            alt={`rune icon ${index + 1}`}
            className="h-full w-full object-cover"
            onError={(event) => recoverAssetImage(event)}
          />
        </div>
      ))}
    </div>
  );
}
