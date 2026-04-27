import type React from "react";
import {
  ChevronRight,
  Crosshair,
  Flame,
  HeartHandshake,
  Clock3,
  PlayCircle,
  Shield,
  Sword,
  Target,
  Zap,
} from "lucide-react";
import SectionTitle from "./ui/SectionTitle";
import NeonCard from "./ui/NeonCard";
import SpeakableCard from "./ui/SpeakableCard";
import StatCard from "./ui/StatCard";
import ItemPath from "./ui/ItemPath";
import SupportCompatibilityScanner from "./SupportCompatibilityScanner";
import {
  homeFeatureCards,
  homeStatCards,
  homeStatValues,
  itemIcons,
  laneSections,
  matchups,
  mechanics,
  midLateCards,
  runePages,
  skillOrderCards,
  supportClips,
  supportPrinciples,
  supportProfiles,
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

const supportPickGuide = [
  {
    name: "Alistar",
    tier: "Best default",
    why: "Point-click access turns Fiora ADC from theory into a real lane.",
    how: "Hold WQ until Fiora can follow with Q. Do not spend engage just to look busy.",
    avoid: "Engaging through a huge wave while Fiora is still walking from Narnia.",
  },
  {
    name: "Braum",
    tier: "Safe brawler",
    why: "He lets Fiora enter, survive contact, and keep punching after the first trade.",
    how: "Stand where Fiora wants to fight. Passive stacks make short trades scary fast.",
    avoid: "Playing ten screens behind her like you queued spectator mode.",
  },
  {
    name: "Yuumi",
    tier: "Special case",
    why: "Sustain and chase help Fiora survive until repeated entries become disgusting.",
    how: "Keep Fiora healthy, speed the re-entry, and respect the early lane.",
    avoid: "AFK attaching while the lane bleeds out before level 3.",
  },
];

const supportSecondaryPicks = [
  {
    name: "Rakan",
    tag: "Fast access",
    text: "Clean engage and exit. Go only when Fiora can Q in.",
  },
  {
    name: "Sona",
    tag: "Sustain scale",
    text: "Good if the lane stays calm. Bad if you cosplay frontline.",
  },
  {
    name: "Taric",
    tag: "Anti-dive",
    text: "Turns enemy all-ins into a very expensive mistake.",
  },
];

const supportFirstMinutes = [
  {
    time: "Wave 1",
    title: "Protect HP first",
    text: "Do not donate Fiora's health for a fake level 1 ego trade. Brush control matters, but HP matters more.",
  },
  {
    time: "Level 2",
    title: "Respect the spike",
    text: "If enemy lane hits level 2 first, back up. If you hit it first, posture, ping, and force them to panic.",
  },
  {
    time: "Level 3",
    title: "First real threat",
    text: "Fiora now has the short-burst tools. Your job is to give access, not to start a fight she cannot reach.",
  },
  {
    time: "First crash",
    title: "Crash or kill",
    text: "After contact, choose immediately: kill, crash wave, or reset. Floating around is how the lane becomes comedy.",
  },
];

const supportDoDont = [
  {
    label: "Do",
    items: [
      "Ping your engage before you press it.",
      "Hold CC until the target is actually reachable.",
      "Fight from brush or wave advantage.",
    ],
  },
  {
    label: "Do not",
    items: [
      "Burn every spell while Fiora is last-hitting.",
      "Force into double range poke with no HP.",
      "Roam before the wave state lets Fiora breathe.",
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
      {currentPage === "Home" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            <div className="mt-6 grid gap-4 md:grid-cols-3">
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
            subtitle="No theory essay. Just the reasons this lane gets ugly once Fiora gets to play her game."
          />

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <SpeakableCard
              className="p-5 md:p-6"
              text="Core concept. You win by forcing bad spacing and panic decisions. Fiora ADC does not work by pretending to be a marksman. The lane only makes sense when trades stay short, violent, and precise: one bad step, one wasted spell, one support opening, then full commit. It is still a technical pick, not something you blind for fun. But with the right draft read and support timing, it creates a kind of pressure standard bot lanes rarely practice against."
            >
              <div className="mb-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-red-200">
                Core concept
              </div>
              <h3 className="text-2xl font-black text-white md:text-3xl">
                You win by forcing bad spacing and panic decisions
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
                Fiora ADC does not work by pretending to be a marksman. The lane only makes sense when trades stay short, violent, and precise: one bad step, one wasted spell, one support opening, then full commit.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
                It is still a technical pick, not something you blind for fun. But with the right draft read and support timing, it creates a kind of pressure standard bot lanes rarely practice against.
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
            subtitle="Pick how lane starts before minions even meet."
          />

          <div className="grid gap-4 xl:grid-cols-2">
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

                <img
                  src={runePage.image}
                  alt={runePage.title}
                  className="w-full rounded-3xl border border-red-500/20 object-contain"
                  loading="lazy"
                  decoding="async"
                  onError={(event) =>
                    recoverAssetImage(
                      event,
                      runePage.fallback || DEFAULT_RUNE_PAGE_IMAGE
                    )
                  }
                />

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
        </>
      ) : null}

      {currentPage === "Build" ? (
        <>
          <SectionTitle
            icon={Shield}
            title="Build"
            subtitle="Your main route, your pivots, and when to stop being greedy."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ItemPath
              title="Core route"
              items={[itemIcons.tiamat, itemIcons.hydra]}
              text="Tiamat into Ravenous Hydra gives sustain, shove, and the freedom to take ugly trades without staying ugly for long."
              audioSrc="/voices/blocks/build-core-route.wav"
            />
            <ItemPath
              title="Snowball route"
              items={[itemIcons.hydra, itemIcons.cyclosword]}
              text="Take this when you can actually touch the target and finish before the lane resets."
              audioSrc="/voices/blocks/build-snowball-route.wav"
            />
            <ItemPath
              title="Stable route"
              items={[itemIcons.hydra, itemIcons.triforce]}
              text="For games where pure greed gets you deleted before the second rotation."
              audioSrc="/voices/blocks/build-stable-route.wav"
            />
            <ItemPath
              title="Safe burst route"
              items={[itemIcons.hydra, itemIcons.eclipse]}
              text="Burst with a little insurance when you still need safer entries."
              audioSrc="/voices/blocks/build-safe-burst-route.wav"
            />
            <ItemPath
              title="Defensive adaptation"
              items={[itemIcons.dd, itemIcons.maw, itemIcons.iceborn]}
              text="DD into AD, Maw into AP, Iceborn when the game demands something uglier and sturdier."
              audioSrc="/voices/blocks/build-defensive-adaptation.wav"
            />
            <ItemPath
              title="Late finish"
              items={[itemIcons.shojin, itemIcons.ga, itemIcons.bt]}
              text="Shojin if you want pressure, GA if one death loses the game, BT if you just want to keep cutting."
              audioSrc="/voices/blocks/build-late-finish.wav"
            />
          </div>
        </>
      ) : null}

      {currentPage === "Skill Order" ? (
        <>
          <SectionTitle
            icon={Crosshair}
            title="Skill Order"
            subtitle="Simple order, real purpose behind every early point."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {skillOrderCards.map((card) => (
              <SpeakableCard
                key={card.title}
                className="p-5"
                text={`${card.title}. ${card.text}`}
                audioSrc={card.audio}
              >
                <p className="text-lg font-bold text-white">{card.title}</p>
                <p className="mt-2 text-white/70">{card.text}</p>
              </SpeakableCard>
            ))}
          </div>
        </>
      ) : null}

      {currentPage === "Matchups" ? (
        <>
          <SectionTitle
            icon={Sword}
            title="Matchups"
            subtitle="The lanes that feel good, the lanes that feel awful, and why."
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
            subtitle="HP, brush control, wave shape, and the one opening worth committing to."
          />

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 hide-scrollbar md:mx-0 md:flex-wrap md:px-0">
            {laneSections.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  laneRefs.current[section.id]?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="shrink-0 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200"
              >
                {section.title}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Primary goal"
              value="Preserve HP"
              text="Do not waste health before the real engage window exists."
              audioSrc="/voices/blocks/lane-primary-goal.wav"
            />
            <StatCard
              label="First spikes"
              value="Level 2 and 3"
              text="Q/E pressure first, Riposte confidence second."
              audioSrc="/voices/blocks/lane-first-spikes.wav"
            />
            <StatCard
              label="Vision rule"
              value="Ward first"
              text="Control the lane space before converting into aggression."
              audioSrc="/voices/blocks/lane-vision-rule.wav"
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
                  ref={(element) => {
                    laneRefs.current[section.id] = element;
                  }}
                  className="scroll-mt-28"
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
                        className="rounded-2xl border border-red-500/20 bg-black/35 p-4 text-sm leading-relaxed text-white/75"
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
            subtitle="How support turns this pick from joke to threat."
          />

          <NeonCard className="p-5 md:p-6">
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-red-300">
                  Support quick read
                </p>
                <h3 className="mt-2 max-w-xl text-3xl font-black leading-tight text-white md:text-4xl">
                  Pick access. Give timing. Stop inventing random engages.
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/72 md:text-base">
                  Fiora ADC does not need a motivational speech. She needs a support who creates a reachable target, protects the first step, and knows when the wave says no.
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
                    Wave / brush
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
                  <p className="mt-2 text-lg font-black text-white">Hard access or protection</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/62">
                    Core: Alistar, Braum, Yuumi. Situational: Rakan, Sona, Taric.
                  </p>
                </div>
                <div className="rounded-3xl border border-cyan-200/20 bg-cyan-300/[0.055] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100">
                    Goal
                  </p>
                  <p className="mt-2 text-lg font-black text-white">Make the first touch real</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/62">
                    Fiora wants short, violent trades. You make them reachable.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/12 bg-white/[0.035] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/50">
                    Rule
                  </p>
                  <p className="mt-2 text-lg font-black text-white">No follow-up, no engage</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/62">
                    If Fiora cannot touch the target, your engage is just fan fiction.
                  </p>
                </div>
              </div>
            </div>
          </NeonCard>

          <div className="grid items-end gap-4 md:grid-cols-2 xl:grid-cols-3">
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

          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
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

          <div className="grid gap-4 md:grid-cols-2">
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

          <SupportCompatibilityScanner />

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
        </>
      ) : null}

      {currentPage === "Mid/Late Game" ? (
        <>
          <SectionTitle
            icon={Flame}
            title="Mid / Late Game"
            subtitle="Pick a job, take space, and cash out the lead."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {midLateCards.map((card) => (
              <SpeakableCard
                key={card.title}
                className="p-5"
                text={`${card.title}. ${card.text}`}
                audioSrc={card.audio}
              >
                <p className="font-bold text-white">{card.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70 md:text-base">{card.text}</p>
              </SpeakableCard>
            ))}
          </div>
          <NeonCard className="p-6">
            <div className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-red-300">
              Coming next <ChevronRight className="h-4 w-4" /> Side pressure / vision setup / fight entry rules
            </div>
          </NeonCard>
        </>
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
