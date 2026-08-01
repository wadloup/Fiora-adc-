import { useEffect, useRef, useState } from "react";
import { ListTree } from "lucide-react";
import type { PageName } from "../data/siteData";
import { cn } from "../utils/cn";

type SectionLink = {
  id: string;
  label: string;
};

const PAGE_SECTIONS: Partial<Record<PageName, readonly SectionLink[]>> = {
  Runes: [
    { id: "runes-pages", label: "Rune pages" },
    { id: "runes-contact", label: "Contact rule" },
    { id: "runes-checks", label: "Draft checks" },
  ],
  Build: [
    { id: "build-core", label: "Core route" },
    { id: "build-rationale", label: "Item logic" },
    { id: "build-start", label: "Lane start" },
    { id: "build-enemy", label: "Enemy pivot" },
    { id: "build-support", label: "Support sync" },
    { id: "build-finish", label: "Late slots" },
    { id: "build-exceptions", label: "Exceptions" },
  ],
  "Skill Order": [
    { id: "skills-sequence", label: "Full sequence" },
    { id: "skills-opening", label: "Levels 1-3" },
    { id: "skills-progression", label: "Max order" },
    { id: "skills-summoners", label: "Summoners" },
  ],
  "Lane Phase": [
    { id: "lane-early", label: "Level 1" },
    { id: "lane-wave", label: "Wave 1-4" },
    { id: "lane-support", label: "First kill" },
    { id: "lane-matchups", label: "Vital discipline" },
  ],
  "Fiora's Support": [
    { id: "support-read", label: "Quick read" },
    { id: "support-models", label: "Support models" },
    { id: "support-picks", label: "Pick & timeline" },
    { id: "support-rules", label: "Do / do not" },
    { id: "support-scanner", label: "Scanner" },
    { id: "support-clips", label: "Clips" },
  ],
};

export default function GuidePageSectionNav({
  currentPage,
}: {
  currentPage: PageName;
}) {
  const sections = PAGE_SECTIONS[currentPage];
  const [activeId, setActiveId] = useState(sections?.[0]?.id ?? "");
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sections?.length) {
      setActiveId("");
      return undefined;
    }

    setActiveId(sections[0].id);
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));
    let frameId = 0;

    const updateActiveSection = () => {
      const navBottom =
        navRef.current?.closest(".guide-section-nav")?.getBoundingClientRect()
          .bottom ?? 0;
      const readingLine = navBottom + 24;
      const atPageEnd =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 8;

      let current = elements[0];
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= readingLine) {
          current = element;
        } else {
          break;
        }
      }

      setActiveId(
        atPageEnd ? elements[elements.length - 1]?.id ?? current.id : current.id
      );
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [currentPage, sections]);

  useEffect(() => {
    const nav = navRef.current;
    const activeButton = nav?.querySelector<HTMLButtonElement>(
      `[data-section-id="${activeId}"]`
    );

    if (!nav || !activeButton) {
      return;
    }

    const centeredLeft =
      activeButton.offsetLeft - (nav.clientWidth - activeButton.offsetWidth) / 2;
    nav.scrollTo({ left: Math.max(0, centeredLeft), behavior: "smooth" });
  }, [activeId]);

  if (!sections?.length) {
    return null;
  }

  const activeLabel =
    sections.find((section) => section.id === activeId)?.label ??
    sections[0].label;

  const openSection = (section: SectionLink) => {
    const target = document.getElementById(section.id);
    if (!target) {
      return;
    }

    setActiveId(section.id);
    target
      .closest(".guide-page-content")
      ?.classList.add("guide-page-content--anchors-ready");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  return (
    <div className="guide-section-nav sticky top-[4.4rem] z-30 -mx-1 mb-6 pl-1 pr-[4.75rem] sm:pr-1 lg:top-[9rem]">
      <div className="flex items-center gap-2 overflow-hidden rounded-lg border border-white/14 bg-[rgba(7,7,9,0.94)] p-1.5 shadow-[0_12px_34px_rgba(0,0,0,0.38)] backdrop-blur-xl">
        <div className="hidden shrink-0 items-center gap-2 border-r border-white/10 px-2.5 py-1 sm:flex">
          <ListTree className="h-4 w-4 text-red-200" />
          <div>
            <p className="text-[9px] font-black uppercase tracking-normal text-white/38">
              On this page
            </p>
            <p className="max-w-28 truncate text-xs font-black text-white">
              {activeLabel}
            </p>
          </div>
        </div>

        <nav
          ref={navRef}
          className="hide-scrollbar flex min-w-0 flex-1 gap-1 overflow-x-auto"
          aria-label={`${currentPage} sections`}
        >
          {sections.map((section, index) => {
            const active = section.id === activeId;

            return (
              <button
                key={section.id}
                type="button"
                data-section-id={section.id}
                onClick={() => openSection(section)}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "group inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md border px-2.5 text-xs font-semibold tracking-normal transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/60",
                  active
                    ? "border-red-300/50 bg-red-500/[0.16] text-white shadow-[0_0_14px_rgba(255,0,60,0.14)]"
                    : "border-transparent bg-transparent text-white/52 hover:border-white/14 hover:bg-white/[0.055] hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "text-[9px] font-black",
                    active
                      ? "text-red-200"
                      : "text-white/28 group-hover:text-white/55"
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
