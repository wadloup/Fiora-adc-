import SpeakableCard from "./SpeakableCard";
import {
  DEFAULT_ITEM_ICON,
  recoverAssetImage,
} from "../../utils/imageFallback";

type ItemPathProps = {
  title: string;
  items: string[];
  text: string;
};

export default function ItemPath({ title, items, text }: ItemPathProps) {
  return (
    <SpeakableCard text={`${title}. ${text}`} className="p-4 md:p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-red-300 md:text-sm">
        {title}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-2">
            <img
              src={item}
              alt="item"
              className="h-12 w-12 rounded-lg border border-red-500/30 bg-black/40 object-cover"
              onError={(event) => recoverAssetImage(event, DEFAULT_ITEM_ICON)}
            />
            {index < items.length - 1 ? (
              <span className="text-sm text-red-300">{">"}</span>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/75">{text}</p>
    </SpeakableCard>
  );
}
