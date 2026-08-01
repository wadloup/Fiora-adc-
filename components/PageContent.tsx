import type React from "react";
import { lazy, Suspense } from "react";
import {
  ChevronRight,
  Crosshair,
  Flame,
  Footprints,
  HeartHandshake,
  Clock3,
  Layers3,
  PlayCircle,
  Shield,
  ShieldCheck,
  Sword,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import SectionTitle from "./ui/SectionTitle";
import NeonCard from "./ui/NeonCard";
import SpeakableCard from "./ui/SpeakableCard";
import StatCard from "./ui/StatCard";
import GuidePageSectionNav from "./GuidePageSectionNav";
import {
  buildAllyReads,
  buildCoreStages,
  buildEnemyReads,
  buildExceptionRules,
  buildLateRules,
  buildStartRules,
  homeFeatureCards,
  homeStatCards,
  homeStatValues,
  laneSections,
  matchups,
  mechanics,
  runeDecisionChecks,
  runeMatchupRules,
  runePages,
  skillLevelSequence,
  skillOrderCards,
  skillProgressionSections,
  summonerDecisionRules,
  summonerSpellPlans,
  supportClips,
  supportPrinciples,
  supportProfiles,
  type EvidenceKind,
  type LaneSectionId,
  type PageName,
  videoCards,
  whyWorksPoints,
  whyWorksVisualImage,
} from "../data/siteData";
import {
  DEFAULT_CHAMPION_IMAGE,
  DEFAULT_RUNE_PAGE_IMAGE,
  recoverAssetImage,
  recoverImage,
} from "../utils/imageFallback";

const LazySupportCompatibilityScanner = lazy(
  () => import("./SupportCompatibilityScanner")
);
const LazyVitalRushGame = lazy(() => import("./VitalRushGame"));
const LazyMidLateCommandRoom = lazy(() => import("./MidLateCommandRoom"));

const deferredFeatureFallback = (
  <NeonCard className="p-6">
    <div className="h-48 animate-pulse rounded-2xl bg-white/[0.04]" />
  </NeonCard>
);

const evidenceMeta: Record<
  EvidenceKind,
  { label: string; description: string; className: string }
> = {
  official: {
    label: "Official mechanic",
    description: "Current Riot spell, rune, or item behavior.",
    className: "border-cyan-300/25 bg-cyan-300/[0.07] text-cyan-100",
  },
  observed: {
    label: "Observed corpus",
    description: "Descriptive signal from the reviewed Fiora ADC games.",
    className:
      "border-emerald-300/25 bg-emerald-300/[0.07] text-emerald-100",
  },
  author: {
    label: "Author standard",
    description: "The route taught by this guide, not a universal optimum.",
    className: "border-red-300/30 bg-red-400/[0.09] text-red-100",
  },
  inference: {
    label: "Mechanical inference",
    description: "A testable game-state deduction, not a measured win rate.",
    className: "border-amber-300/25 bg-amber-300/[0.07] text-amber-100",
  },
};

function EvidenceBadges({ items }: { items: readonly EvidenceKind[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          title={evidenceMeta[item].description}
          className={`inline-flex min-h-7 items-center border px-2.5 py-1 text-[11px] font-black uppercase tracking-normal ${evidenceMeta[item].className}`}
        >
          {evidenceMeta[item].label}
        </span>
      ))}
    </div>
  );
}

function EvidenceLegend() {
  return (
    <div className="guide-responsive-grid guide-responsive-grid--four grid border-y border-white/10 bg-white/[0.018]">
      {(Object.keys(evidenceMeta) as EvidenceKind[]).map((key) => (
        <div
          key={key}
          className="border-b border-white/10 px-4 py-3 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 xl:border-b-0 xl:[&:nth-child(2n)]:border-r xl:last:border-r-0"
        >
          <EvidenceBadges items={[key]} />
          <p className="mt-2 text-[13px] leading-relaxed text-white/62">
            {evidenceMeta[key].description}
          </p>
        </div>
      ))}
    </div>
  );
}

const skillTone = {
  Q: "border-red-300/35 bg-red-400/[0.09] text-red-100",
  W: "border-cyan-300/35 bg-cyan-300/[0.08] text-cyan-100",
  E: "border-amber-300/35 bg-amber-300/[0.08] text-amber-100",
  R: "border-fuchsia-300/35 bg-fuchsia-300/[0.09] text-fuchsia-100",
} as const;

const supportPickGuide = [
  {
    name: "Alistar",
    tier: "Best default",
    why: "Headbutt-Pulverize creates fixed access without asking Fiora to spend Q before the target is controlled. Trample then supplies the second lock that keeps Hail-E connected.",
    how: "Stand on the same side of the wave as Fiora and ping the target. If Headbutt displaces the carry, Fiora saves Q for the landing point; hold the combo until she is one dash away and the enemy wave is not stacked.",
    avoid: "Do not WQ from outside Fiora's follow-up range or send the carry back toward safety. After level 6, do not make the ulted enemy tank the default target merely because it is closest.",
  },
  {
    name: "Braum",
    tier: "Safe brawler",
    why: "One Braum mark turns Fiora's Hail attacks and E reset into a fast stun, while Stand Behind Me and Unbreakable protect the part of contact after her burst.",
    how: "Tag the reachable target with Q or an auto, then remain close enough to jump onto Fiora. Fiora spends her fast attacks after the mark appears and can retain W for the enemy support's counter-control.",
    avoid: "Do not stand so far behind that Braum cannot mark the same target or protect the exit. Avoid extending after the passive stun if the carry escaped and Fiora has no Q target back.",
  },
  {
    name: "Yuumi",
    tier: "Special case",
    why: "Attached protection and movement become powerful after Fiora reaches the target, but Yuumi contributes little independent bush control, wave damage or level-1 fixation.",
    how: "Keep the wave on Fiora's half, preserve HP and use the slow or movement after an enemy control miss, jungle arrival or short Q punish creates access. Save one protection spell for the retreat.",
    avoid: "Do not contest a double-ranged push as though Yuumi were a second frontliner. Repeatedly absorbing poke while attached removes the HP threshold needed for the first real all-in.",
  },
];

const supportSecondaryPicks = [
  {
    name: "Rakan",
    tag: "Fast access",
    text: "Use the first dash to threaten or draw movement, then knock up only when Fiora can reach the landing square. Keep Battle Dance range for extraction; a maximum-range engage without a return body leaves Fiora alone after the burst.",
  },
  {
    name: "Sona",
    tag: "Sustain scale",
    text: "Sustain protects Fiora's all-in threshold and Power Chord slow can create access. Hold Crescendo for the target or counter-engage line; Sona walking forward first into hook range removes the protection the pairing was chosen for.",
  },
  {
    name: "Taric",
    tag: "Anti-dive",
    text: "Bastion lets Fiora carry the stun line into melee range, while Cosmic Radiance protects the second half of a committed fight. Start the channel before Fiora reaches lethal HP; delayed invulnerability does not repair an unsupported entry.",
  },
];

const supportFirstMinutes = [
  {
    time: "Wave 1",
    title: "Create one usable side",
    text: "Enter the near bush with Fiora and contest only the edge your spells can protect. Against hooks, keep a minion line and stand far enough forward that Fiora can Q diagonally beside you, not one dash ahead. If the enemy duo owns the bush first, recover it through the wave rather than trading half of Fiora's HP for vision.",
  },
  {
    time: "Level 2",
    title: "Move before the ninth minion",
    text: "The duo levels after wave one plus the three melee minions of wave two. Step into cast range before the last melee dies and ping the target. Fiora takes E only when your control, wave size and enemy cooldown create immediate delivery; if the enemy arrives first or retains layered CC, retreat before the level-up and let Fiora take W.",
  },
  {
    time: "Level 3",
    title: "Run the two-stage engage",
    text: "Use the first spell to force the carry's dash, knockback or shield, then keep the second control for the new position. Fiora preserves Q for that displacement and W for the enemy support's decisive lock. If both access tools are spent on the first position, end the trade instead of chasing through the wave.",
  },
  {
    time: "First crash",
    title: "Convert before recalling",
    text: "After a kill or forced recall, count the remaining allied minions and enemy respawn. Crash when the wave reaches tower before their return; hold or thin when fast pushing would create an enemy freeze. Recall on the Hydra component or boots threshold rather than spending the entire advantage on one uncertain plate.",
  },
];

const supportDoDont = [
  {
    label: "Do",
    items: [
      "Ping the target and the enemy spell you want forced. Fiora must know whether Q follows the first contact or is reserved for the escape destination.",
      "Keep one spell for the enemy answer: second control, shield, speed, Devour, lantern or body block. Access without the next two seconds of protection is incomplete.",
      "Before roaming, crash the wave or leave it returning toward Fiora. Ward the shortest lane-return path so she can distinguish a real roam from the enemy support looping behind her.",
    ],
  },
  {
    label: "Do not",
    items: [
      "Do not engage while Fiora is locked in a last-hit animation, outside Q range or separated by a large enemy wave. A correct spell on an unreachable target is still a losing engage.",
      "Do not repeatedly trade shields for poke until Fiora is below her all-in threshold. Concede one ranged minion when preserving HP keeps Flash plus support control lethal on the next miss.",
      "Do not follow a failed catch with a long chase. Once the carry uses its escape and your second spell cannot reach the destination, take wave control and build the repeat window.",
    ],
  },
];

type PageContentProps = {
  currentPage: PageName;
  laneRefs: React.MutableRefObject<
    Partial<Record<LaneSectionId, HTMLDivElement | null>>
  >;
  goLaneSection: (id: LaneSectionId) => void;
};

export default function PageContent({
  currentPage,
  laneRefs,
  goLaneSection,
}: PageContentProps) {
  return (
    <>
      <GuidePageSectionNav currentPage={currentPage} />

      {currentPage === "Home" ? (
        <>
          <div className="guide-responsive-grid guide-responsive-grid--four grid gap-4">
            {homeStatCards.map((card, index) => (
              <StatCard
                key={card.title}
                label={card.title}
                value={homeStatValues[index]}
                text={card.text}
                audioSrc={card.audio}
                className="min-h-[12.1rem] p-[1.12rem] md:min-h-[12.9rem] md:p-[1.4rem]"
                labelClassName="text-[13px] md:text-[15px]"
                valueClassName="mt-2.5 text-[1.12rem] md:text-[1.3rem]"
                textClassName="mt-2.5 text-[0.96rem] md:text-[1.02rem]"
              />
            ))}
          </div>

          <NeonCard className="p-5 md:p-6 lg:p-8">
            <SectionTitle
              icon={Flame}
              title="Welcome to the Fiora ADC lab"
              subtitle="Start with support sync, lock the lane plan, then stop guessing in draft."
            />
            <div className="guide-responsive-grid guide-responsive-grid--three mt-6 grid gap-4">
              {homeFeatureCards.map((card) => (
                <SpeakableCard
                  key={card.title}
                  text={`${card.title}. ${card.text}`}
                  audioSrc={card.audio}
                  className="border-white/10 bg-white/5 p-4 md:p-5"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-red-300 md:text-sm">
                    {card.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/75 md:text-base">
                    {card.text}
                  </p>
                </SpeakableCard>
              ))}
            </div>
          </NeonCard>
        </>
      ) : null}

      {currentPage === "Why Fiora ADC Works" ? (
        <>
          <SectionTitle
            icon={Target}
            title="Why Fiora ADC Works ?"
            subtitle="The exact exchange that replaces marksman range with support access, cooldown tracking, and melee conversion."
          />

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <SpeakableCard
              className="p-5 md:p-6"
              text="Core concept. Fiora ADC gives up ranged uptime and independent wave access. In return, a support-created contact lets her compress Lunge, Hail attacks, Bladework and Riposte into the short cooldown gap after a carry or support spends its main spacing tool. The pick works when the duo arrives with enough health, reaches the same target, and keeps one resource for the enemy answer. It fails when Fiora spends Lunge to begin unsupported, crosses a prepared zone, or extends after the carry restores distance."
            >
              <div className="mb-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-red-200">
                Core concept
              </div>
              <h3 className="text-2xl font-black text-white md:text-3xl">
                Turn one ranged cooldown into a complete melee rotation
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
                Fiora gives up ranged uptime, safe neutral farming, and independent wave access. In return, allied control can place her inside a carry's defensive cooldown gap, where Q, Hail attacks and E front-load damage before spacing is restored.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
                The exchange is legal only when both allies reach the same post-dash target, Fiora keeps W or Flash for the return control, and the minion wave does not make first contact losing. Miss one of those checks and the melee conversion becomes a ranged lane taxing her for free.
              </p>
            </SpeakableCard>

            <NeonCard className="overflow-hidden p-3">
                <img
                  src={whyWorksVisualImage}
                  alt="Fiora visual"
                  className="h-[260px] w-full rounded-2xl border border-red-500/25 object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={(event) => recoverImage(event, DEFAULT_CHAMPION_IMAGE)}
                  style={{ objectPosition: "center 26%" }}
                />
            </NeonCard>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {whyWorksPoints.map((point) => (
              <SpeakableCard
                key={point.title}
                className="p-5"
                text={`${point.title}. ${point.text}`}
                audioSrc={point.audio}
              >
                <p className="text-lg font-bold text-white">{point.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70 md:text-base">
                  {point.text}
                </p>
              </SpeakableCard>
            ))}
          </div>
        </>
      ) : null}

      {currentPage === "Runes" ? (
        <>
          <SectionTitle
            icon={Zap}
            title="Runes"
            subtitle="Hail by default. PTA when the fight has a second chapter."
          />

          <div id="runes-pages" className="scroll-mt-36 lg:scroll-mt-52 grid gap-4 xl:grid-cols-2">
            {runePages.map((runePage) => (
              <SpeakableCard
                key={runePage.key}
                className="p-5"
                contentClassName="space-y-4"
                text={`${runePage.title}. ${runePage.bullets.map((bullet) => `${bullet.label} ${bullet.text}`).join(" ")}`}
                audioSrc={runePage.audio}
              >
                <p className="text-sm uppercase tracking-[0.16em] text-red-300">
                  {runePage.title}
                </p>

                <div className="aspect-[16/10] overflow-hidden rounded-lg border border-white/10 bg-black/35">
                  <img
                    src={runePage.image}
                    alt={runePage.title}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                    onError={(event) =>
                      recoverAssetImage(
                        event,
                        runePage.fallback || DEFAULT_RUNE_PAGE_IMAGE
                      )
                    }
                  />
                </div>

                <div className="space-y-2 text-sm leading-relaxed text-white/75 md:text-base">
                  {runePage.bullets.map((bullet) => (
                    <p key={bullet.label}>
                      <span className="font-semibold text-white">
                        {bullet.label}
                      </span>{" "}
                      {bullet.text}
                    </p>
                  ))}
                </div>
              </SpeakableCard>
            ))}
          </div>

          <section id="runes-contact" className="scroll-mt-36 lg:scroll-mt-52 mt-8 border-y border-white/10 bg-black/75 px-5 py-7 md:px-7 md:py-9">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-300">
                  The two-second rule
                </p>
                <h3 className="mt-2 text-2xl font-black text-white md:text-3xl">
                  Decide by contact, not by habit.
                </h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-white/55 md:text-right">
                Ask who Fiora will actually hit first and how long that target
                stays reachable. The answer selects the keystone.
              </p>
            </div>

            <div className="mt-7 grid gap-7 lg:grid-cols-2 lg:gap-0">
              {runeMatchupRules.map((rule, index) => (
                <article
                  key={rule.key}
                  className={index === 0 ? "lg:pr-8" : "lg:border-l lg:border-white/10 lg:pl-8"}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        rule.key === "hob"
                          ? "h-2.5 w-2.5 rounded-full bg-red-300 shadow-[0_0_16px_rgba(252,165,165,0.75)]"
                          : "h-2.5 w-2.5 rounded-full bg-amber-200 shadow-[0_0_16px_rgba(253,230,138,0.65)]"
                      }
                    />
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-white/48">
                      {rule.key === "hob" ? "Hail of Blades" : "Press the Attack"} / {rule.eyebrow}
                    </p>
                  </div>
                  <h4 className="mt-3 text-xl font-black text-white">
                    {rule.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-white/68 md:text-base">
                    {rule.text}
                  </p>
                  <div className="mt-5 border-l-2 border-white/14 pl-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/38">
                      Enemy read
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-white/72">
                      {rule.examples}
                    </p>
                  </div>
                  <div className="mt-4 border-l-2 border-cyan-300/40 pl-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-cyan-200/75">
                      Support read
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-white/65">
                      {rule.support}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="runes-checks" className="scroll-mt-36 lg:scroll-mt-52 grid gap-4 border-b border-white/10 bg-black/55 px-5 py-7 md:grid-cols-3 md:px-7">
            {runeDecisionChecks.map((check, index) => {
              const CheckIcon = [Target, Clock3, HeartHandshake][index];

              return (
                <div key={check.label} className="flex gap-3 py-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-red-200">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.13em] text-white">
                      {index + 1}. {check.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-white/55">
                      {check.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          <p className="mt-5 border-l-2 border-white/10 pl-4 text-xs leading-relaxed text-white/48">
            Biscuits remain the stable lane default. Cash Back is reserved for
            calm lanes. Jack of All Trades still fits mixed-stat builds, but its
            adaptive reward is lower on patch 26.15, so the item route must
            actually reach its breakpoints.
          </p>
          <p className="mt-3 border-l-2 border-cyan-300/25 pl-4 text-xs leading-relaxed text-white/48">
            Evidence calibration: Hail appeared in 127 of 178 reviewed
            specialist games, while PTA did not appear in that selected sample.
            That supports Hail as the observed default, not a claim that PTA is
            inferior in every draft. PTA remains the guide's conditional page
            for extended contact and needs matchup-specific review rather than a
            fabricated win-rate comparison.
          </p>
        </>
      ) : null}

      {currentPage === "Build" ? (
        <>
          <SectionTitle
            icon={Shield}
            title="Build"
            subtitle="One author standard, one matchup pivot, and the exceptions that can replace damage."
          />

          <EvidenceLegend />

          <section id="build-core" className="scroll-mt-36 lg:scroll-mt-52 mt-6 overflow-hidden border-y border-white/10 bg-black/70">
            <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-6 md:px-7">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-300">
                  Patch 26.15 / author standard
                </p>
                <h3 className="mt-2 text-2xl font-black text-white md:text-3xl">
                  Hydra into Hubris is the route this guide teaches
                </h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-white/58">
                Hail and PTA change how Fiora uses contact. The guide keeps
                Hydra first, Greaves in the boot slot, and Hubris as the second
                legendary because that sequence joins wave control, recovery,
                and early Eminence scaling. It remains a declared system, not
                proof that no enemy draft can justify an exception.
              </p>
              <p className="max-w-2xl border-l-2 border-cyan-300/25 pl-4 text-xs leading-relaxed text-white/46">
                Reviewed sample: Ravenous Hydra appeared in 172 of 178 games,
                Hubris in 173, and Cyclosword in 91. The repeated core supports
                the item spine, while completion order still contains a
                specialist Tiamat into early-Hubris variant. This guide keeps
                Hydra completion first as its author standard and labels the
                faster stack route as a timing tradeoff. Only three reviewed
                games belong to patch 26.15, so current-patch frequency cannot
                carry matchup or win-rate claims by itself.
              </p>
            </div>

            <div className="grid md:grid-cols-2">
              {buildCoreStages.map((stage, index) => (
                <article
                  key={stage.title}
                  className={`border-b border-white/10 px-5 py-6 ${
                    index === buildCoreStages.length - 1
                      ? "md:col-span-2"
                      : index % 2 === 0
                        ? "md:border-r"
                        : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black tracking-[0.18em] text-red-300">
                        {stage.step}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/36">
                        {stage.eyebrow}
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      {stage.images.map((image, imageIndex) => (
                        <img
                          key={image}
                          src={image}
                          alt=""
                          className="h-11 w-11 rounded-md border border-black/80 object-cover shadow-[0_8px_24px_rgba(0,0,0,0.42)]"
                          loading="lazy"
                          style={{ zIndex: stage.images.length - imageIndex }}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="mt-5 text-lg font-black text-white">
                    {stage.title}
                  </h4>
                  <div className="mt-3">
                    <EvidenceBadges items={stage.evidence} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/62">
                    {stage.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="build-rationale" className="scroll-mt-36 lg:scroll-mt-52 mt-7 grid gap-0 border-y border-white/10 bg-[#090a0d]">
            {[
              {
                icon: Footprints,
                label: "Why this guide keeps Greaves",
                title: "Sustain that snowballs with the lane",
                evidence: ["official", "observed", "author"] as EvidenceKind[],
                text: "Gluttonous Greaves start at 4% omnivamp and gain 0.6% per champion takedown, up to ten stacks. Their strategic value is repeated presence: repair on the next wave, earlier movement to the next contact, and more recovery after a first removal. They are the guide standard because the build is organized around takedown snowball, not because defensive boots have no valid game state.",
              },
              {
                icon: TrendingUp,
                label: "Why the guide buys Hubris second",
                title: "Activate the damage project while fights are frequent",
                evidence: ["official", "observed", "author"] as EvidenceKind[],
                text: "Hubris brings 55 AD, 18 lethality, and 10 haste before Eminence. A qualifying takedown activates bonus AD for 90 seconds, and the stored kill count increases later activations. Completing it second gives lane fights, roams and objectives more chances to build and refresh that window; it does not grant permanently active AD simply because one stack was earned.",
              },
              {
                icon: Zap,
                label: "Why Cyclosword late",
                title: "Burst closer once entry is credible",
                evidence: ["official", "inference", "author"] as EvidenceKind[],
                text: "Fiora's ability entry helps charge an Energized attack. That hit opens with current-health damage, then temporary lethality strengthens the remaining combo. Cyclosword is the guide's preferred closer after a survival pivot, but the pivot only improves the probability of spending the burst; armor, shields, control or anti-heal can still make a specialist counter-item more valuable.",
              },
            ].map((rule) => {
              const RuleIcon = rule.icon;

              return (
                <article
                  key={rule.label}
                  className="border-b border-white/10 px-5 py-7 last:border-b-0 md:px-7"
                >
                  <RuleIcon className="h-5 w-5 text-red-200" />
                  <p className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-red-300">
                    {rule.label}
                  </p>
                  <h3 className="mt-2 text-xl font-black text-white">
                    {rule.title}
                  </h3>
                  <div className="mt-3">
                    <EvidenceBadges items={rule.evidence} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/64">
                    {rule.text}
                  </p>
                </article>
              );
            })}
          </section>

          <section id="build-start" className="scroll-mt-36 lg:scroll-mt-52 mt-10">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
                  Start selector
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">
                  Buy for the first three waves
                </h3>
              </div>
              <ShieldCheck className="hidden h-6 w-6 text-white/28 sm:block" />
            </div>

            <div className="grid md:grid-cols-2">
              {buildStartRules.map((rule) => (
                <article
                  key={rule.title}
                  className="border-b border-white/10 px-1 py-6 md:px-5 md:first:pl-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={rule.image}
                      alt=""
                      className="h-12 w-12 rounded-md border border-white/12"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-200/75">
                        {rule.label}
                      </p>
                      <h4 className="mt-1 font-black text-white">
                        {rule.title}
                      </h4>
                    </div>
                  </div>
                  <p className="mt-4 text-xs font-semibold leading-relaxed text-white/46">
                    {rule.enemies}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/68">
                    {rule.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="build-enemy" className="scroll-mt-36 lg:scroll-mt-52 mt-10 border-y border-white/10 bg-black/55 px-5 py-7 md:px-7 md:py-9">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-300">
                  Enemy lane matrix
                </p>
                <h3 className="mt-2 text-2xl font-black text-white md:text-3xl">
                  What changes after Hubris
                </h3>
              </div>
              <Target className="hidden h-6 w-6 text-white/28 sm:block" />
            </div>

            <div className="mt-7 divide-y divide-white/10">
              {buildEnemyReads.map((read, index) => (
                <article
                  key={read.label}
                  className="grid gap-4 py-6 first:pt-0 last:pb-0 2xl:grid-cols-[3rem_0.65fr_1fr_1.15fr] 2xl:gap-6"
                >
                  <p className="text-sm font-black text-red-300">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/38">
                      {read.label}
                    </p>
                    <h4 className="mt-2 text-lg font-black text-white">
                      {read.title}
                    </h4>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-red-200/75">
                      Enemy examples
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/58">
                      {read.enemies}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-relaxed text-white/78">
                      {read.route}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/52">
                      {read.rule}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="build-support" className="scroll-mt-36 lg:scroll-mt-52 mt-10">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
                  Allied support sync
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">
                  Same core, different permission to fight
                </h3>
              </div>
              <HeartHandshake className="hidden h-6 w-6 text-white/28 sm:block" />
            </div>

            <div className="divide-y divide-white/10">
              {buildAllyReads.map((read, index) => (
                <article
                  key={read.label}
                  className="grid gap-3 py-6 2xl:grid-cols-[2.3rem_0.75fr_1.4fr] 2xl:gap-6"
                >
                  <p className="text-sm font-black text-emerald-200">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h4 className="font-black text-white">{read.label}</h4>
                    <p className="mt-2 text-xs font-semibold leading-relaxed text-white/42">
                      {read.supports}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-white/68">
                    {read.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="build-finish" className="scroll-mt-36 lg:scroll-mt-52 mt-10 border-y border-white/10 bg-[#090a0d] px-5 py-7 md:px-7 md:py-9">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
                  Slots after Hubris
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">
                  The pivot is permission, not surrender
                </h3>
              </div>
              <p className="max-w-lg text-sm leading-relaxed text-white/48 md:text-right">
                Defensive items exist to preserve damage uptime. Once that
                check is solved, Cyclosword returns as the late damage closer.
              </p>
            </div>

            <div className="mt-7 grid gap-x-7 gap-y-0 md:grid-cols-2">
              {buildLateRules.map((rule) => (
                <article
                  key={rule.title}
                  className="flex gap-4 border-t border-white/10 py-5"
                >
                  <div className="flex shrink-0 -space-x-2">
                    <img
                      src={rule.image}
                      alt=""
                      className="h-11 w-11 rounded-md border border-black/80"
                      loading="lazy"
                    />
                    {"secondaryImage" in rule ? (
                      <img
                        src={rule.secondaryImage}
                        alt=""
                        className="h-11 w-11 rounded-md border border-black/80"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div>
                    <h4 className="font-black text-white">{rule.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-white/58">
                      {rule.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-4 flex gap-4 border-t border-red-300/25 pt-6">
              <Layers3 className="mt-0.5 h-5 w-5 shrink-0 text-red-200" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-red-200">
                  Author template / before exceptions
                </p>
                <p className="mt-2 text-sm font-bold leading-relaxed text-white/78 md:text-base">
                  Ravenous Hydra - Hubris - matchup pivot - Endless Hunger or
                  Shojin - Voltaic Cyclosword - Guardian Angel or
                  Bloodthirster, with Gluttonous Greaves in the bot-role boot
                  slot. Replace a damage slot when a named control, shield,
                  armor, or healing threshold is what prevents conversion.
                </p>
              </div>
            </div>
          </section>

          <section id="build-exceptions" className="scroll-mt-36 lg:scroll-mt-52 mt-10 border-y border-white/10 bg-black/55">
            <div className="border-b border-white/10 px-5 py-7 md:px-7">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
                Exception desk
              </p>
              <h3 className="mt-2 text-2xl font-black text-white md:text-3xl">
                Replace damage only for a named blocker
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
                The question is not whether an enemy owns armor, healing,
                shields, or crowd control. The question is whether that exact
                mechanic prevents Fiora's legal target from dying in the
                contact she can actually create.
              </p>
            </div>

            <div className="divide-y divide-white/10">
              {buildExceptionRules.map((rule) => (
                <article
                  key={rule.title}
                  className="grid gap-4 px-5 py-6 md:grid-cols-[3.25rem_0.7fr_1fr] md:px-7"
                >
                  <img
                    src={rule.image}
                    alt=""
                    className="h-12 w-12 rounded-md border border-white/12"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-black text-white">{rule.title}</h4>
                    <div className="mt-3">
                      <EvidenceBadges items={rule.evidence} />
                    </div>
                  </div>
                  <div className="grid gap-3 text-sm leading-relaxed">
                    <p className="text-white/66">
                      <span className="font-black text-red-200">Trigger: </span>
                      {rule.trigger}
                    </p>
                    <p className="text-white/52">
                      <span className="font-black text-cyan-200">Decision: </span>
                      {rule.decision}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {currentPage === "Skill Order" ? (
        <>
          <SectionTitle
            icon={Crosshair}
            title="Skill Order"
            subtitle="Opening branch, full level-18 sequence, and the summoner spell that solves the actual lane problem."
          />

          <EvidenceLegend />

          <section id="skills-sequence" className="scroll-mt-36 lg:scroll-mt-52 mt-6 overflow-hidden border-y border-white/10 bg-black/65">
            <div className="border-b border-white/10 px-5 py-6 md:px-7">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-300">
                Observed baseline / Q-W-E opening
              </p>
              <h3 className="mt-2 text-2xl font-black text-white md:text-3xl">
                Q max, then E, then W
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/56">
                The displayed sequence follows the dominant reviewed pattern.
                Level 2 remains a real branch: take E only when the ninth-minion
                spike already delivers contact; otherwise W protects the HP and
                position required for the next wave.
              </p>
            </div>

            <div className="grid grid-cols-6 gap-px bg-white/10 sm:grid-cols-9 xl:grid-cols-[repeat(18,minmax(0,1fr))]">
              {skillLevelSequence.map((skill, index) => (
                <div
                  key={`${skill}-${index}`}
                  className="flex min-h-[4.6rem] flex-col items-center justify-center bg-[#08090b] px-1 py-2"
                >
                  <span className="text-[9px] font-black text-white/32">
                    {index + 1}
                  </span>
                  <span
                    className={`mt-1 flex h-8 w-8 items-center justify-center border text-sm font-black ${skillTone[skill]}`}
                  >
                    {skill}
                  </span>
                </div>
              ))}
            </div>

            <p className="border-t border-white/10 px-5 py-4 text-xs leading-relaxed text-white/45 md:px-7">
              Corpus opening: Q started 177/178 reviewed non-remake games; W
              was taken second in 164, E in 13, and one game added a second Q.
              These counts describe specialist behavior across several patches.
              They do not prove that one order wins every current draft.
            </p>
          </section>

          <section id="skills-opening" className="scroll-mt-36 lg:scroll-mt-52 mt-8">
            <div className="mb-4 border-b border-white/10 pb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
                Levels 1-3
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">
                Choose the second spell from the delivered contact
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
            {skillOrderCards.map((card) => (
              <SpeakableCard
                key={card.title}
                className="p-5"
                text={`${card.title}. ${card.text}`}
                audioSrc={card.audio}
              >
                <p className="text-lg font-bold text-white">{card.title}</p>
                <div className="mt-3">
                  <EvidenceBadges items={card.evidence} />
                </div>
                <p className="mt-2 text-white/70">{card.text}</p>
              </SpeakableCard>
            ))}
            </div>
          </section>

          <section id="skills-progression" className="scroll-mt-36 lg:scroll-mt-52 mt-9 border-y border-white/10 bg-[#090a0d]">
            <div className="border-b border-white/10 px-5 py-6 md:px-7">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
                Levels 4-18
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">
                What each max order is buying
              </h3>
            </div>
            <div className="divide-y divide-white/10">
              {skillProgressionSections.map((section) => (
                <article
                  key={section.levels}
                  className="grid gap-4 px-5 py-6 md:grid-cols-[5rem_0.72fr_1.28fr] md:px-7"
                >
                  <p className="text-sm font-black text-red-300">
                    LV {section.levels}
                  </p>
                  <div>
                    <h4 className="font-black leading-snug text-white">
                      {section.title}
                    </h4>
                    <div className="mt-3">
                      <EvidenceBadges items={section.evidence} />
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-white/60">
                    {section.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="skills-summoners" className="scroll-mt-36 lg:scroll-mt-52 mt-10">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
                  Summoner spell desk
                </p>
                <h3 className="mt-2 text-2xl font-black text-white md:text-3xl">
                  Select the event the second spell must change
                </h3>
              </div>
              <p className="max-w-lg text-sm leading-relaxed text-white/46 md:text-right">
                Counts are descriptive fingerprints from 178 reviewed games.
                Player style and patch clustering prevent a clean win-rate
                comparison between spells.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3">
              {summonerSpellPlans.map((plan) => (
                <article
                  key={plan.title}
                  className="border-b border-white/10 bg-black/65 px-4 py-6 md:border-r md:px-5 xl:[&:nth-child(3n)]:border-r-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-2">
                      {plan.images.map((image) => (
                        <img
                          key={image}
                          src={image}
                          alt=""
                          className="h-11 w-11 rounded-md border border-white/12"
                          loading="lazy"
                        />
                      ))}
                    </div>
                    <span className="border border-white/12 bg-white/[0.04] px-2 py-1 text-[10px] font-black text-white/50">
                      {plan.count}
                    </span>
                  </div>
                  <h4 className="mt-5 text-lg font-black text-white">
                    {plan.title}
                  </h4>
                  <div className="mt-3">
                    <EvidenceBadges items={plan.evidence} />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/68">
                    {plan.purpose}
                  </p>
                  <p className="mt-3 border-l-2 border-cyan-300/25 pl-3 text-sm leading-relaxed text-white/48">
                    {plan.choose}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-7 grid border-y border-white/10 bg-black/75 md:grid-cols-3">
              {summonerDecisionRules.map((rule) => (
                <div
                  key={rule.label}
                  className="border-b border-white/10 px-5 py-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <p className="text-xs font-black uppercase tracking-[0.13em] text-red-200">
                    {rule.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    {rule.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {currentPage === "Matchups" ? (
        <>
          <SectionTitle
            icon={Sword}
            title="Matchup reference"
            subtitle="Quick archetype reads after the complete draft Gameplan above."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {matchups.map((matchup) => (
              <SpeakableCard
                key={matchup.name}
                className="overflow-hidden p-4 transition hover:-translate-y-1"
                text={`${matchup.name}. ${matchup.level}. Danger ${matchup.danger}. ${matchup.explanation}`}
                audioSrc={matchup.audio}
              >
                <img
                  src={matchup.image}
                  alt={matchup.name}
                  className="h-44 w-full rounded-2xl border border-red-500/25 object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={(event) => recoverImage(event, DEFAULT_CHAMPION_IMAGE)}
                  style={{ objectPosition: matchup.position }}
                />
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xl font-bold text-white">{matchup.name}</p>
                  <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200">
                    {matchup.danger}
                  </span>
                </div>
                <p className="mt-1 text-sm text-red-300">{matchup.level}</p>
                <p className="mt-3 text-white/70">{matchup.explanation}</p>
              </SpeakableCard>
            ))}
          </div>
        </>
      ) : null}

      {currentPage === "Lane Phase" ? (
        <>
          <SectionTitle
            icon={Target}
            title="Lane Phase"
            subtitle="HP, bush control, wave shape, and the one opening worth committing to."
          />

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Primary goal"
              value="Secure first kill"
              text="Preserve HP until support access, wave state, and summoners can convert the full all-in."
            />
            <StatCard
              label="First spikes"
              value="9th minion"
              text="Wave 1 plus the three melee minions of wave 2 gives the duo level-2 spike."
            />
            <StatCard
              label="Vision rule"
              value="Bush first"
              text="Use Sixth Sense, lane-bush denial, and tri-bush control to create the entry."
            />
          </div>

          <div className="space-y-4">
            {laneSections.map((section) => (
              <SpeakableCard
                key={section.id}
                className="p-5 md:p-6"
                text={`${section.title}. ${section.summary}. ${section.points.join(" ")}`}
                audioSrc={section.audio}
              >
                <div
                  id={`lane-${section.id}`}
                  ref={(element) => {
                    laneRefs.current[section.id] = element;
                  }}
                  className="scroll-mt-36 lg:scroll-mt-52"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-red-300">
                    Lane read
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    {section.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
                    {section.summary}
                  </p>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {section.points.map((point) => (
                      <div
                        key={point}
                        className="rounded-lg border border-red-500/20 bg-black/35 p-4 text-sm leading-relaxed text-white/75"
                      >
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </SpeakableCard>
            ))}
          </div>
        </>
      ) : null}

      {currentPage === "Fiora's Support" ? (
        <>
          <SectionTitle
            icon={HeartHandshake}
            title="Fiora's Support"
            subtitle="Access, second contact, protection, wave setup, and the exact moment Fiora can follow."
          />

          <div id="support-read" className="scroll-mt-36 lg:scroll-mt-52">
          <NeonCard className="p-5 md:p-6">
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-red-300">
                  Support quick read
                </p>
                <h3 className="mt-2 max-w-xl text-3xl font-black leading-tight text-white md:text-4xl">
                  Build the first contact and keep the second spell for the answer.
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/72 md:text-base">
                  Fiora needs the support to fix a post-dash target, remain inside follow-up range, and preserve control or protection for the enemy response. The wave decides whether the same spell starts a kill or strands her between two ranged champions.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => goLaneSection("early")}
                    className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                  >
                    Early lane
                  </button>
                  <button
                    onClick={() => goLaneSection("wave")}
                    className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                  >
                    Wave / bush
                  </button>
                  <button
                    onClick={() => goLaneSection("support")}
                    className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                  >
                    Support sync
                  </button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-3xl border border-red-400/25 bg-black/35 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-200">
                    Pick
                  </p>
                  <p className="mt-2 text-lg font-black text-white">Name the support's exact job</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/62">
                    Alistar fixes the target, Braum marks and protects, Yuumi sustains after access. They do not produce the same lane.
                  </p>
                </div>
                <div className="rounded-3xl border border-cyan-200/20 bg-cyan-300/[0.055] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100">
                    Goal
                  </p>
                  <p className="mt-2 text-lg font-black text-white">Reach the post-dash position</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/62">
                    The first spell often forces Flash or a movement tool. Save Fiora Q or the second control for where the carry lands.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/12 bg-white/[0.035] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/50">
                    Rule
                  </p>
                  <p className="mt-2 text-lg font-black text-white">Keep one answer unused</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/62">
                    After access, the duo still needs W, a shield, second CC, speed or an exit. Spending everything on approach is not a full engage.
                  </p>
                </div>
              </div>
            </div>
          </NeonCard>
          </div>

          <div id="support-models" className="scroll-mt-36 lg:scroll-mt-52 grid items-end gap-4 md:grid-cols-2 xl:grid-cols-3">
            {supportProfiles.map((support) => (
              <SpeakableCard
                key={support.name}
                className="p-4 md:p-5"
                text={`${support.name}. ${support.role}. ${support.text}`}
                audioSrc={support.audio}
              >
                <img
                  src={support.image}
                  alt={support.name}
                  className={`w-full ${support.size} rounded-3xl border border-red-500/25 object-cover`}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => recoverImage(event, DEFAULT_CHAMPION_IMAGE)}
                  style={{ objectPosition: support.position }}
                />
                <p className="mt-3 text-xl font-bold text-white">{support.name}</p>
                <p className="text-sm text-red-300">{support.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{support.text}</p>
              </SpeakableCard>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {supportPrinciples.map((principle) => (
              <SpeakableCard
                key={principle.title}
                className="p-5"
                text={`${principle.title}. ${principle.text}`}
                audioSrc={principle.audio}
              >
                <p className="mb-2 font-semibold text-red-300">{principle.title}</p>
                <p className="text-sm leading-relaxed text-white/75">{principle.text}</p>
              </SpeakableCard>
            ))}
          </div>

          <div id="support-picks" className="scroll-mt-36 lg:scroll-mt-52 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <NeonCard className="overflow-hidden p-5 md:p-6">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl border border-red-300/25 bg-red-500/12 p-3 text-red-100">
                  <Shield className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-300">
                    What should I play?
                  </p>
                  <h3 className="text-2xl font-black text-white">Support pick logic</h3>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {supportPickGuide.map((support) => (
                  <div
                    key={support.name}
                    className="rounded-3xl border border-white/10 bg-black/32 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xl font-black text-white">{support.name}</p>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-200">
                          {support.tier}
                        </p>
                      </div>
                      <span className="rounded-full border border-red-400/25 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-100">
                        Support approved
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                          Why
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-white/72">{support.why}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                          How
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-white/72">{support.how}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                          Avoid
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-white/72">{support.avoid}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.035] p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="mr-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
                    Also playable
                  </p>
                  {supportSecondaryPicks.map((support) => (
                    <div
                      key={support.name}
                      className="group min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/28 px-3 py-2 transition hover:border-red-300/35 hover:bg-red-500/10 sm:min-w-[9rem]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-black text-white">{support.name}</p>
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-red-200">
                          {support.tag}
                        </p>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-white/58">{support.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </NeonCard>

            <NeonCard className="p-5 md:p-6">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl border border-cyan-200/25 bg-cyan-300/10 p-3 text-cyan-100">
                  <Clock3 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-100">
                    First 3 minutes
                  </p>
                  <h3 className="text-2xl font-black text-white">Lane timeline</h3>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {supportFirstMinutes.map((step, index) => (
                  <div
                    key={step.title}
                    className="relative rounded-3xl border border-white/10 bg-white/[0.035] p-4 pl-14"
                  >
                    <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-2xl border border-red-300/30 bg-red-500/12 text-xs font-black text-red-100">
                      {index + 1}
                    </span>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-200">
                      {step.time}
                    </p>
                    <p className="mt-1 text-lg font-black text-white">{step.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/66">{step.text}</p>
                  </div>
                ))}
              </div>
            </NeonCard>
          </div>

          <div id="support-rules" className="scroll-mt-36 lg:scroll-mt-52 grid gap-4 md:grid-cols-2">
            {supportDoDont.map((block) => (
              <NeonCard key={block.label} className="p-5 md:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-300">
                  {block.label}
                </p>
                <div className="mt-4 grid gap-3">
                  {block.items.map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-2xl border border-white/10 bg-black/28 p-3"
                    >
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                      <p className="text-sm leading-relaxed text-white/74">{item}</p>
                    </div>
                  ))}
                </div>
              </NeonCard>
            ))}
          </div>

          <div id="support-scanner" className="scroll-mt-36 lg:scroll-mt-52">
            <Suspense fallback={deferredFeatureFallback}>
              <LazySupportCompatibilityScanner />
            </Suspense>
          </div>

          <section id="support-clips" className="scroll-mt-36 lg:scroll-mt-52 space-y-6">
            <SectionTitle
              icon={PlayCircle}
              title="Support Clips"
              subtitle="Watch the angle, the trigger, and what happens right after contact."
            />
            <div className="grid gap-4 md:grid-cols-2">
            {supportClips.map((clip) => (
              <NeonCard key={clip.url} className="overflow-hidden p-4 md:p-5">
                <div className="overflow-hidden rounded-2xl border border-red-500/20 bg-black">
                  <iframe
                    src={clip.embed}
                    title={clip.title}
                    className="h-60 w-full md:h-72"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <div className="mt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-red-200">
                      {clip.focus}
                    </span>
                    <p className="font-semibold text-white">{clip.title}</p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {clip.description}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    {clip.takeaway}
                  </p>
                  <a
                    href={clip.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-200"
                  >
                    Open on YouTube
                  </a>
                </div>
              </NeonCard>
            ))}
            </div>
          </section>
        </>
      ) : null}

      {currentPage === "Mid/Late Game" ? (
        <Suspense fallback={deferredFeatureFallback}>
          <LazyMidLateCommandRoom />
        </Suspense>
      ) : null}

      {currentPage === "Mechanical Tips" ? (
        <>
          <SectionTitle
            icon={Zap}
            title="Mechanical Tips"
            subtitle="Short reminders for the parts people actually mess up."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {mechanics.map((item) => (
              <SpeakableCard
                key={item.title}
                className="p-5"
                text={`${item.title}. ${item.content}`}
                audioSrc={item.audio}
              >
                <p className="font-bold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70 md:text-base">{item.content}</p>
              </SpeakableCard>
            ))}
          </div>
        </>
      ) : null}

      {currentPage === "Vital Rush" ? (
        <Suspense fallback={deferredFeatureFallback}>
          <LazyVitalRushGame />
        </Suspense>
      ) : null}

      {currentPage === "Videos / Clips" ? (
        <>
          <SectionTitle
            icon={PlayCircle}
            title="Videos / Clips"
            subtitle="Use clips to study the setup, not just the ego moment."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {videoCards.map((videoCard) => (
              <SpeakableCard
                key={videoCard.title}
                className="overflow-hidden p-4 md:p-5"
                text={`${videoCard.title}. ${videoCard.description}. ${videoCard.note}`}
                audioSrc={videoCard.audio}
              >
                <div className="relative overflow-hidden rounded-2xl border border-red-500/25">
                  <img
                    src={videoCard.image}
                    alt={videoCard.title}
                    className="h-56 w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(event) => recoverImage(event, DEFAULT_CHAMPION_IMAGE)}
                    style={{ objectPosition: videoCard.position }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4">
                    <span className="inline-flex rounded-full border border-red-500/25 bg-black/50 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-red-200">
                      {videoCard.label}
                    </span>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {videoCard.title}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {videoCard.description}
                </p>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm leading-relaxed text-white/55">
                  {videoCard.note}
                </div>
              </SpeakableCard>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}
