import type React from "react";
import {
  ChevronRight,
  Crosshair,
  Flame,
  HeartHandshake,
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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {homeStatCards.map((card, index) => (
              <StatCard
                key={card.title}
                label={card.title}
                value={homeStatValues[index]}
                text={card.text}
              />
            ))}
          </div>

          <NeonCard className="p-6 md:p-8">
            <SectionTitle
              icon={Flame}
              title="Welcome to the Fiora ADC lab"
              subtitle="This version keeps the strongest personality cues but organizes them like a real final site: cleaner hierarchy, clearer pages, and faster access to what matters in draft."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {homeFeatureCards.map((card) => (
                <SpeakableCard
                  key={card.title}
                  text={`${card.title}. ${card.text}`}
                  className="border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm text-red-300">{card.title}</p>
                  <p className="mt-2 text-white/75">{card.text}</p>
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
            subtitle="Same concept, cleaner presentation: fewer walls of text, more cards that are readable during draft or quick review."
          />

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <SpeakableCard
              className="p-6"
              text="Core concept. You win by forcing bad spacing and panic decisions. Fiora ADC is not standard marksman flow. The pick works when you control timing, punish wrong movement, and convert enemy missteps into short, committed all-ins. It is a technical choice, not a universal blind answer. But in the right structure, it creates discomfort that many bot lanes are not prepared to answer correctly."
            >
              <div className="mb-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-red-200">
                Core concept
              </div>
              <h3 className="text-2xl font-black text-white md:text-3xl">
                You win by forcing bad spacing and panic decisions
              </h3>
              <p className="mt-4 text-white/75">
                Fiora ADC is not standard marksman flow. The pick works when you control timing, punish wrong movement, and convert enemy missteps into short, committed all-ins.
              </p>
              <p className="mt-4 text-white/75">
                It is a technical choice, not a universal blind answer. But in the right structure, it creates discomfort that many bot lanes are not prepared to answer correctly.
              </p>
            </SpeakableCard>

            <NeonCard className="overflow-hidden p-3">
              <img
                src={whyWorksVisualImage}
                alt="Fiora visual"
                className="h-[260px] w-full rounded-2xl border border-red-500/25 object-cover"
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
              >
                <p className="text-lg font-bold text-white">{point.title}</p>
                <p className="mt-2 text-white/70">{point.text}</p>
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
            subtitle="Two clean rune pages with the exact visual you wanted."
          />

          <div className="grid gap-4 xl:grid-cols-2">
            {runePages.map((runePage) => (
              <SpeakableCard
                key={runePage.key}
                className="p-5"
                contentClassName="space-y-4"
                text={`${runePage.title}. ${runePage.bullets.map((bullet) => `${bullet.label} ${bullet.text}`).join(" ")}`}
              >
                <p className="text-sm uppercase tracking-[0.16em] text-red-300">
                  {runePage.title}
                </p>

                <img
                  src={runePage.image}
                  alt={runePage.title}
                  className="w-full rounded-3xl border border-red-500/20 object-contain"
                  onError={(event) =>
                    recoverAssetImage(
                      event,
                      runePage.fallback || DEFAULT_RUNE_PAGE_IMAGE
                    )
                  }
                />

                <div className="space-y-2 text-white/75">
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
            subtitle="Complete routes with icons and explicit conditions, but still quick to scan."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ItemPath
              title="Core route"
              items={[itemIcons.tiamat, itemIcons.hydra]}
              text="Rush Tiamat then Ravenous Hydra for lane comfort, sustain, wave control, and faster map tempo."
            />
            <ItemPath
              title="Snowball route"
              items={[itemIcons.hydra, itemIcons.cyclosword]}
              text="Take this when you can reach target reliably and kill before getting burst down."
            />
            <ItemPath
              title="Stable route"
              items={[itemIcons.hydra, itemIcons.triforce]}
              text="A steadier profile when enemy damage makes pure glass-cannon play too risky."
            />
            <ItemPath
              title="Safe burst route"
              items={[itemIcons.hydra, itemIcons.eclipse]}
              text="Shield plus burst when you need safer entries and a less greedy second item."
            />
            <ItemPath
              title="Defensive adaptation"
              items={[itemIcons.dd, itemIcons.maw, itemIcons.iceborn]}
              text="DD for heavy AD, Maw for AP threat, Iceborn as a niche durability option."
            />
            <ItemPath
              title="Late finish"
              items={[itemIcons.shojin, itemIcons.ga, itemIcons.bt]}
              text="Shojin for pressure, GA for safety, BT for final damage and sustain finish."
            />
          </div>
        </>
      ) : null}

      {currentPage === "Skill Order" ? (
        <>
          <SectionTitle
            icon={Crosshair}
            title="Skill Order"
            subtitle="Current practical baseline with a clearer final-site presentation."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {skillOrderCards.map((card) => (
              <SpeakableCard
                key={card.title}
                className="p-5"
                text={`${card.title}. ${card.text}`}
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
            subtitle="Readable matchup cards with practical notes and stronger visual framing."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {matchups.map((matchup) => (
              <SpeakableCard
                key={matchup.name}
                className="overflow-hidden p-4 transition hover:-translate-y-1"
                text={`${matchup.name}. ${matchup.level}. Danger ${matchup.danger}. ${matchup.explanation}`}
              >
                <img
                  src={matchup.image}
                  alt={matchup.name}
                  className="h-44 w-full rounded-2xl border border-red-500/25 object-cover"
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
            subtitle="The best compromise: fast jump buttons plus full sections visible on scroll, without forcing tab-switching to read the guide."
          />

          <div className="flex flex-wrap gap-2">
            {laneSections.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  laneRefs.current[section.id]?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200"
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
            />
            <StatCard
              label="First spikes"
              value="Level 2 and 3"
              text="Q/E pressure first, Riposte confidence second."
            />
            <StatCard
              label="Vision rule"
              value="Ward first"
              text="Control the lane space before converting into aggression."
            />
          </div>

          <div className="space-y-4">
            {laneSections.map((section) => (
              <SpeakableCard
                key={section.id}
                className="p-6"
                text={`${section.title}. ${section.summary}. ${section.points.join(" ")}`}
              >
                <div
                  ref={(element) => {
                    laneRefs.current[section.id] = element;
                  }}
                  className="scroll-mt-28"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-red-300">
                    Quick read
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    {section.title}
                  </h3>
                  <p className="mt-3 text-white/70">{section.summary}</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {section.points.map((point) => (
                      <div
                        key={point}
                        className="rounded-2xl border border-red-500/20 bg-black/35 p-4 text-white/75"
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
            subtitle="Global support logic, profile details, and direct connection to lane-phase reading."
          />

          <NeonCard className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-red-300">
              Mandatory read
            </p>
            <h3 className="mt-2 text-2xl font-black text-white">
              Supports must read Lane Phase too
            </h3>
            <p className="mt-3 max-w-3xl text-white/75">
              This page explains support priorities, but lane execution details still live in Lane Phase. Read both to avoid desynced engages and fake all-ins.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => goLaneSection("early")}
                className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200"
              >
                Read Lane Phase: Early
              </button>
              <button
                onClick={() => goLaneSection("wave")}
                className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200"
              >
                Read Lane Phase: Wave
              </button>
              <button
                onClick={() => goLaneSection("support")}
                className="rounded-2xl border border-red-500/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200"
              >
                Read Lane Phase: Support
              </button>
            </div>
          </NeonCard>

          <div className="grid items-end gap-4 md:grid-cols-2 xl:grid-cols-3">
            {supportProfiles.map((support) => (
              <SpeakableCard
                key={support.name}
                className="p-4"
                text={`${support.name}. ${support.role}. ${support.text}`}
              >
                <img
                  src={support.image}
                  alt={support.name}
                  className={`w-full ${support.size} rounded-3xl border border-red-500/25 object-cover`}
                  onError={(event) => recoverImage(event, DEFAULT_CHAMPION_IMAGE)}
                  style={{ objectPosition: support.position }}
                />
                <p className="mt-3 text-xl font-bold text-white">{support.name}</p>
                <p className="text-sm text-red-300">{support.role}</p>
                <p className="mt-3 text-white/75">{support.text}</p>
              </SpeakableCard>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {supportPrinciples.map((principle) => (
              <SpeakableCard
                key={principle.title}
                className="p-5"
                text={`${principle.title}. ${principle.text}`}
              >
                <p className="mb-2 font-semibold text-red-300">{principle.title}</p>
                <p className="text-white/75">{principle.text}</p>
              </SpeakableCard>
            ))}
          </div>

          <SectionTitle
            icon={PlayCircle}
            title="Support Clips"
            subtitle="Integrated examples for support behavior around Fiora ADC."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {supportClips.map((clip) => (
              <NeonCard key={clip.url} className="overflow-hidden p-4">
                <div className="overflow-hidden rounded-2xl border border-red-500/20 bg-black">
                  <iframe
                    src={clip.embed}
                    title={clip.title}
                    className="h-72 w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <div className="mt-3">
                  <p className="font-semibold text-white">{clip.title}</p>
                  <p className="mt-1 text-sm text-white/65">{clip.description}</p>
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
            subtitle="Macro priorities in cards, without another giant paragraph block."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {midLateCards.map((card) => (
              <SpeakableCard
                key={card.title}
                className="p-5"
                text={`${card.title}. ${card.text}`}
              >
                <p className="font-bold text-white">{card.title}</p>
                <p className="mt-2 text-white/70">{card.text}</p>
              </SpeakableCard>
            ))}
          </div>
          <NeonCard className="p-6">
            <div className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-red-300">
              Add later <ChevronRight className="h-4 w-4" /> Side pressure / vision setup / fight entry rules
            </div>
          </NeonCard>
        </>
      ) : null}

      {currentPage === "Mechanical Tips" ? (
        <>
          <SectionTitle
            icon={Zap}
            title="Mechanical Tips"
            subtitle="Short tactical notes instead of bloated explanation blocks."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {mechanics.map((item) => (
              <SpeakableCard
                key={item.title}
                className="p-5"
                text={`${item.title}. ${item.content}`}
              >
                <p className="font-bold text-white">{item.title}</p>
                <p className="mt-2 text-white/70">{item.content}</p>
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
            subtitle="Visual section ready for future highlight and teaching clip expansion."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {videoCards.map((videoCard) => (
              <SpeakableCard
                key={videoCard.title}
                className="overflow-hidden p-4"
                text={`${videoCard.title}. Reserved for your next clip and explanation block.`}
              >
                <img
                  src={videoCard.image}
                  alt={videoCard.title}
                  className="h-56 w-full rounded-2xl border border-red-500/25 object-cover"
                  onError={(event) => recoverImage(event, DEFAULT_CHAMPION_IMAGE)}
                  style={{ objectPosition: videoCard.position }}
                />
                <p className="mt-3 font-semibold text-white">{videoCard.title}</p>
                <p className="mt-1 text-sm text-white/65">
                  Reserved for your next clip and explanation block.
                </p>
              </SpeakableCard>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}
