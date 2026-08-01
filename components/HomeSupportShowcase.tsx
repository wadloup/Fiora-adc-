import SpeakableCard from "./ui/SpeakableCard";
import {
  heroCertifiedImage,
  homeSupportShellAudio,
  supportProfiles,
} from "../data/siteData";
import { recoverImage } from "../utils/imageFallback";

export default function HomeSupportShowcase() {
  const heroSupports = supportProfiles.slice(0, 3);

  return (
    <div className="home-support-showcase hidden h-full lg:block">
      <div className="home-support-showcase-frame flex h-full flex-col justify-between gap-4">
        <SpeakableCard
          text="Support models. Alistar demonstrates fixed access, Braum demonstrates marked contact plus protection, and Yuumi demonstrates sustain after access. The draft must still answer wave control, target fixation, enemy peel, and Fiora's exit."
          audioSrc={homeSupportShellAudio}
          compactControl
          className="border-red-500/22 bg-[linear-gradient(180deg,rgba(18,6,10,0.56),rgba(10,4,8,0.42))] p-4 shadow-[0_0_20px_rgba(0,0,0,0.18)] backdrop-blur-[2px]"
          contentClassName="!pr-0"
        >
          <div className="inline-flex max-w-[calc(100%-2.75rem)] flex-col rounded-lg border border-white/12 bg-black/34 px-3 py-2 shadow-[0_10px_28px_rgba(0,0,0,0.18)] backdrop-blur-sm">
            <p className="text-xs uppercase tracking-normal text-red-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]">
              AUTO WIN
            </p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-normal text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.72)]">
              NETANYAHU CERTIFIED
            </p>
          </div>
          <div className="home-support-hero mt-4 grid min-w-0 grid-cols-[9.1rem_minmax(0,1fr)] items-center gap-4">
            <img
              src={heroCertifiedImage}
              alt="Certified badge"
              className="home-support-hero-image aspect-square w-full rounded-lg border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              onError={recoverImage}
            />
            <div className="min-w-0">
              <p className="text-lg font-black uppercase tracking-normal text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.72)] xl:text-[1.35rem]">
                Support shell
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/78 drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
                Alistar fixes the target. Braum marks and protects. Yuumi sustains after access. Read the job before judging the pairing.
              </p>
            </div>
          </div>
        </SpeakableCard>

        <div className="grid gap-3">
          {heroSupports.map((support) => (
            <SpeakableCard
              key={support.name}
              text={`${support.name}. ${support.role}. ${support.text}`}
              audioSrc={support.audio}
              compactControl
              className="border-red-500/18 bg-[linear-gradient(180deg,rgba(14,6,9,0.54),rgba(9,4,7,0.42))] p-3 shadow-[0_0_16px_rgba(0,0,0,0.14)] backdrop-blur-[2px]"
              contentClassName="home-support-profile grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] items-center gap-3 !pr-10"
            >
              <img
                src={support.image}
                alt={support.name}
                className="aspect-square w-full rounded-lg border border-red-500/25 object-cover"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                onError={recoverImage}
                style={{ objectPosition: support.position }}
              />
              <div className="min-w-0">
                <p className="text-base font-bold text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
                  {support.name}
                </p>
                <p className="text-xs uppercase tracking-normal text-red-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]">
                  {support.role}
                </p>
                <p className="mt-1 text-[0.8rem] leading-relaxed text-white/72 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
                  {support.text}
                </p>
              </div>
            </SpeakableCard>
          ))}
        </div>
      </div>
    </div>
  );
}
