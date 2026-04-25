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
    <div className="hidden h-full lg:block">
      <div className="flex h-full flex-col justify-between gap-4 p-6 md:p-8">
        <SpeakableCard
          text="Auto win. Netanyahu certified. Support shell. Alistar, Braum, and Yuumi are showcased here as the safest auto-win support core."
          audioSrc={homeSupportShellAudio}
          className="premium-hover-card border-white/10 bg-[linear-gradient(180deg,rgba(15,15,18,0.82),rgba(8,8,10,0.72))] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.24)] xl:p-6"
        >
          <div className="inline-flex flex-col rounded-2xl border border-white/8 bg-black/26 px-3 py-2 shadow-[0_10px_28px_rgba(0,0,0,0.18)] backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-white/58 drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]">
              AUTO WIN
            </p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.72)]">
              NETANYAHU CERTIFIED
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4 xl:gap-5">
            <img
              src={heroCertifiedImage}
              alt="Certified badge"
                className="h-[9.25rem] w-[9.25rem] shrink-0 rounded-2xl border border-white/12 object-cover shadow-[0_18px_34px_rgba(0,0,0,0.28)] xl:h-[10rem] xl:w-[10rem]"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              onError={recoverImage}
            />
            <div className="min-w-0">
              <p className="text-lg font-black uppercase tracking-[0.08em] text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.72)] xl:text-[1.35rem]">
                Support shell
              </p>
              <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-white/78 drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
                Alistar, Braum, and Yuumi are showcased here as the safest auto-win support core.
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
              className="premium-hover-card border-white/10 bg-[linear-gradient(180deg,rgba(14,14,17,0.74),rgba(8,8,10,0.68))] p-3 shadow-[0_14px_34px_rgba(0,0,0,0.2)]"
              contentClassName="flex items-center gap-3"
            >
              <img
                src={support.image}
                alt={support.name}
                className="h-20 w-20 rounded-2xl border border-white/12 object-cover"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                onError={recoverImage}
                style={{ objectPosition: support.position }}
              />
              <div>
                <p className="text-base font-bold text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
                  {support.name}
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-white/54 drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]">
                  {support.role}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/72 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
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
