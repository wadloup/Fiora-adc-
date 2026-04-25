import SpeakableCard from "./SpeakableCard";
import {
  DEFAULT_ITEM_ICON,
  recoverAssetImage,
} from "../../utils/imageFallback";

type ItemPathProps = {
  title: string;
  items: string[];
  text: string;
  audioSrc?: string;
};

export default function ItemPath({ title, items, text, audioSrc }: ItemPathProps) {
  return (
    <SpeakableCard
      text={`${title}. ${text}`}
      audioSrc={audioSrc}
      className="premium-hover-card p-4 md:p-5"
    >
      <p className="text-xs uppercase tracking-[0.16em] text-white/52 md:text-sm">
        {title}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-2">
            <img
              src={item}
              alt="item"
              className="h-12 w-12 rounded-lg border border-white/12 bg-black/40 object-cover"
              onError={(event) => recoverAssetImage(event, DEFAULT_ITEM_ICON)}
            />
            {index < items.length - 1 ? (
              <span className="text-sm text-white/38">{">"}</span>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/75">{text}</p>
    </SpeakableCard>
  );
}
