import NeonCard from "./ui/NeonCard";
import { heroCertifiedImage, supportProfiles } from "../data/siteData";
import { recoverImage } from "../utils/imageFallback";

export default function HomeSupportShowcase() {
  const heroSupports = supportProfiles.slice(0, 3);

  return (
    <div className="hidden h-full lg:block">
      <div className="flex h-full flex-col justify-between gap-4 p-6 md:p-8">
        <NeonCard className="border-red-500/25 bg-black/25 p-5 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-red-300">
            AUTO WIN
          </p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-red-200">
            netanyahu certified
          </p>
          <div className="mt-4 flex items-start gap-4">
            <img
              src={heroCertifiedImage}
              alt="Certified badge"
              className="h-36 w-36 rounded-2xl border border-red-500/30 object-cover shadow-[0_0_18px_rgba(255,0,60,0.2)]"
              onError={recoverImage}
            />
            <div>
              <p className="text-lg font-black uppercase tracking-[0.08em] text-white">
                Support shell
              </p>
              <p className="mt-3 max-w-[180px] text-sm text-white/65">
                Alistar, Braum, and Yuumi are showcased here as the safest auto-win support core.
              </p>
            </div>
          </div>
        </NeonCard>

        <div className="grid gap-3">
          {heroSupports.map((support) => (
            <div
              key={support.name}
              className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-black/25 p-3 backdrop-blur-sm"
            >
              <img
                src={support.image}
                alt={support.name}
                className="h-20 w-20 rounded-2xl border border-red-500/25 object-cover"
                onError={recoverImage}
                style={{ objectPosition: support.position }}
              />
              <div>
                <p className="text-base font-bold text-white">{support.name}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-red-300">
                  {support.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
