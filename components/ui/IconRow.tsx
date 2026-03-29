import React from "react";

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

export default function IconRow({ icons }: { icons: string[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {icons.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt="rune icon"
          className="h-14 w-14 rounded-xl border border-red-500/30 bg-black/50 object-cover"
          onError={(event) => recoverAssetImage(event, DEFAULT_RUNE_ICON)}
        />
      ))}
    </div>
  );
}
