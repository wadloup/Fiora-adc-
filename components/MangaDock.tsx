import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Maximize2, X } from "lucide-react";
import { useState } from "react";

const MANGA_PAGES = [
  { src: "/manga/planche-1.png", alt: "Manga page 1" },
  { src: "/manga/planche-2.png", alt: "Manga page 2" },
];

export default function MangaDock() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="fixed right-4 top-[24.7rem] z-[58] hidden w-[280px] overflow-hidden rounded-3xl border border-red-500/30 bg-[rgba(8,8,10,0.94)] p-3 text-left text-white shadow-[0_0_28px_rgba(255,0,60,0.18)] transition hover:border-red-400/45 hover:bg-[rgba(20,8,12,0.96)] lg:block sm:right-5 md:right-6"
        aria-label="Open manga pages"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-red-300">
              Manga board
            </p>
            <p className="mt-1 truncate text-sm font-black uppercase tracking-[0.08em] text-white">
              Preview page 1
            </p>
          </div>
          <span className="rounded-2xl border border-red-400/25 bg-red-500/12 p-2 text-red-200">
            <BookOpen className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/35">
          <img
            src="/manga/planche-1-preview.jpg"
            alt="Manga page 1 preview"
            className="h-36 w-full object-cover object-top opacity-90 transition duration-200 hover:opacity-100"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
            2 pages
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-200">
            Open
            <Maximize2 className="h-3.5 w-3.5" />
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[95] bg-black/82 px-4 py-5 backdrop-blur-md md:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="fixed right-5 top-5 z-[96] rounded-2xl border border-white/15 bg-black/65 p-3 text-white/88 transition hover:border-red-400/40 hover:text-red-100"
              aria-label="Close manga pages"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-full max-w-7xl flex-col gap-4">
              <div className="shrink-0 rounded-3xl border border-red-500/24 bg-[rgba(12,5,8,0.7)] px-5 py-4 shadow-[0_0_26px_rgba(255,0,60,0.16)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-300">
                  Manga board
                </p>
                <h2 className="mt-1 text-2xl font-black uppercase tracking-[0.04em] text-white">
                  Two-page preview
                </h2>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto rounded-3xl border border-white/10 bg-black/36 p-3 md:p-4">
                <div className="grid gap-4 xl:grid-cols-2">
                  {MANGA_PAGES.map((page, index) => (
                    <div
                      key={page.src}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-black/45 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
                    >
                      <div className="border-b border-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-200">
                        Page {index + 1}
                      </div>
                      <img
                        src={page.src}
                        alt={page.alt}
                        className="mx-auto max-h-[82vh] w-full object-contain"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
