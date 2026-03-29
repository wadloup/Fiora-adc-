import React from "react";
import NeonCard from "./NeonCard";

const DEFAULT_ITEM_ICON =
  "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3077.png";

function recoverAssetImage(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallback: string
) {
  const img = event.currentTarget;
  if (img.src !== fallback) {
    img.src = fallback;
  }
}

export default function ItemPath({
  title,
  items,
  text,
}: {
  title: string;
  items: string[];
  text: string;
}) {
  return (
    <NeonCard className="p-5">
      <p className="text-sm uppercase tracking-[0.16em] text-red-300">
        {title}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <div key={`${it}-${i}`} className="flex items-center gap-2">
            <img
              src={it}
              alt="item"
              className="h-12 w-12 rounded-lg border border-red-500/30 bg-black/40 object-cover"
              onError={(event) => recoverAssetImage(event, DEFAULT_ITEM_ICON)}
            />
            {i < items.length - 1 ? (
              <span className="text-red-300">→</span>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-3 text-white/75">{text}</p>
    </NeonCard>
  );
}
