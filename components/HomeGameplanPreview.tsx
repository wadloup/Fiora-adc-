import { ArrowRight, Crosshair, ShieldCheck, Sparkles, Swords } from "lucide-react";
import { useMemo, useState } from "react";
import { botLaneCarries } from "../data/botLaneCarries";
import { BOT_LANE_PATCH } from "../data/botLanePatch";
import { botLaneSupports } from "../data/botLaneSupports";
import { buildLaneGameplan } from "../data/laneGameplan";
import { readLaneGameplanSelection } from "../data/laneGameplanState";
import { recoverImage } from "../utils/imageFallback";

type HomeGameplanPreviewProps = {
  onOpenGameplan: () => void;
};

export default function HomeGameplanPreview({
  onOpenGameplan,
}: HomeGameplanPreviewProps) {
  const [selection] = useState(readLaneGameplanSelection);
  const allySupport =
    botLaneSupports.find((option) => option.id === selection.allySupport) ||
    botLaneSupports[0];
  const enemyCarry =
    botLaneCarries.find((option) => option.id === selection.enemyCarry) ||
    botLaneCarries[0];
  const enemySupport =
    botLaneSupports.find((option) => option.id === selection.enemySupport) ||
    botLaneSupports[0];

  const gameplan = useMemo(
    () =>
      buildLaneGameplan(allySupport, enemyCarry, enemySupport, {
        intent: selection.intent,
        arrival: selection.arrival,
        allySupportForward: selection.allySupportForward,
        enemyControlSpent: selection.enemyControlSpent,
        fioraFlashAvailable: selection.fioraFlashAvailable,
        enemyCarryFlashAvailable: selection.enemyCarryFlashAvailable,
        junglePathBot: selection.junglePathBot,
        triBrushControl: selection.triBrushControl,
      }),
    [allySupport, enemyCarry, enemySupport, selection]
  );

  const champions = [
    { label: "Your support", name: allySupport.name, image: allySupport.image },
    { label: "Enemy carry", name: enemyCarry.name, image: enemyCarry.image },
    { label: "Enemy support", name: enemySupport.name, image: enemySupport.image },
  ];

  return (
    <section className="overflow-hidden rounded-lg border border-white/12 bg-[rgba(7,8,11,0.9)] shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
      <div className="gameplan-preview-layout grid">
        <div className="gameplan-preview-primary border-b border-white/10 p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-normal text-red-200">
              <Sparkles className="h-3.5 w-3.5" /> Saved gameplan preview
            </p>
            <span className="border border-cyan-300/25 bg-cyan-300/[0.07] px-2 py-1 text-[11px] font-black uppercase tracking-normal text-cyan-100">
              Patch {BOT_LANE_PATCH.patch}
            </span>
          </div>

          <h2 className="mt-3 text-xl font-black leading-tight text-white md:text-2xl">
            {gameplan.levelOneCall}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/70">
            {gameplan.levelOneWhy}
          </p>

          <button
            type="button"
            onClick={onOpenGameplan}
            className="group mt-4 inline-flex min-h-11 w-full items-center justify-between gap-4 rounded-md border border-red-200/55 bg-red-500/18 px-4 text-left text-xs font-black uppercase tracking-[0.1em] text-white shadow-[0_0_24px_rgba(244,63,94,0.15)] transition hover:-translate-y-0.5 hover:border-red-100 hover:bg-red-500/28 hover:shadow-[0_0_34px_rgba(244,63,94,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/70 sm:w-auto"
          >
            <span>
              Open full gameplan
              <span className="mt-0.5 block text-[11px] font-semibold normal-case tracking-normal text-white/60">
                Draft controls, timeline and matchup logic
              </span>
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/20 bg-black/30 text-red-100 transition group-hover:translate-x-0.5 group-hover:bg-white/10">
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </div>

        <div className="p-4 md:p-5">
          <div className="grid gap-2 sm:grid-cols-3">
            {champions.map((champion) => (
              <div key={champion.label} className="flex min-w-0 items-center gap-2.5 border border-white/9 bg-white/[0.025] p-2.5">
                <img
                  src={champion.image}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-md border border-white/15 object-cover object-top"
                  loading="lazy"
                  decoding="async"
                  onError={recoverImage}
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-normal text-white/52">{champion.label}</p>
                  <p className="mt-1 truncate text-xs font-black text-white">{champion.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-px bg-white/10 sm:grid-cols-3">
            {[
              [Crosshair, "Rune", gameplan.rune],
              [ShieldCheck, "Level 2", gameplan.levelTwoSkill],
              [Swords, "First pivot", gameplan.pivot],
            ].map(([Icon, label, value]) => {
              const ItemIcon = Icon as typeof Crosshair;
              return (
                <div key={label as string} className="bg-[#090a0d] p-3">
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-normal text-white/55">
                    <ItemIcon className="h-3.5 w-3.5 text-cyan-200" /> {label as string}
                  </p>
                  <p className="mt-2 text-xs font-black leading-snug text-white">{value as string}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex gap-3 border-l-2 border-red-300/45 bg-red-300/[0.035] px-3 py-2.5">
            <Crosshair className="mt-0.5 h-4 w-4 shrink-0 text-red-200" />
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-normal text-red-100">First legal target</p>
              <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-white/68">{gameplan.targetPlan}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
