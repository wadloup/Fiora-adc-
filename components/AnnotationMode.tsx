import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  MousePointer2,
  PencilLine,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";

const STORAGE_KEY = "fiora-annotation-notes";

type AnnotationNote = {
  id: string;
  createdAt: string;
  page: string;
  target: string;
  pageX: number;
  pageY: number;
  text: string;
};

type DraftNote = Omit<AnnotationNote, "id" | "createdAt" | "text">;

function isAnnotationAvailable() {
  if (typeof window === "undefined") {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  const host = window.location.hostname;

  return (
    params.get("annotate") === "1" ||
    host === "localhost" ||
    host === "127.0.0.1"
  );
}

function readNotes() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? (parsed as AnnotationNote[]) : [];
  } catch {
    return [];
  }
}

function getTargetLabel(element: Element) {
  const tagName = element.tagName.toLowerCase();
  const aria = element.getAttribute("aria-label");
  const text = element.textContent?.replace(/\s+/g, " ").trim().slice(0, 54);
  const id = element.id ? `#${element.id}` : "";
  const classes = element.className && typeof element.className === "string"
    ? element.className
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => `.${name}`)
        .join("")
    : "";

  return [tagName + id + classes, aria || text].filter(Boolean).join(" - ");
}

function formatNotes(notes: AnnotationNote[]) {
  return notes
    .map((note, index) => {
      return [
        `${index + 1}. ${note.page}`,
        `Target: ${note.target}`,
        `Position: x ${Math.round(note.pageX)}, y ${Math.round(note.pageY)}`,
        `Change: ${note.text}`,
      ].join("\n");
    })
    .join("\n\n");
}

export default function AnnotationMode() {
  const available = useMemo(() => isAnnotationAvailable(), []);
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);
  const [notes, setNotes] = useState<AnnotationNote[]>(() => readNotes());
  const [draft, setDraft] = useState<DraftNote | null>(null);
  const [draftText, setDraftText] = useState("");
  const [copied, setCopied] = useState(false);
  const [scrollTick, setScrollTick] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!available) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [available, notes]);

  useEffect(() => {
    if (!available || !armed) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest("[data-annotation-root]")) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      setDraft({
        page: `${window.location.pathname}${window.location.hash}`,
        target: getTargetLabel(target),
        pageX: event.pageX,
        pageY: event.pageY,
      });
      setDraftText("");
      setOpen(true);
      setArmed(false);
      window.setTimeout(() => textareaRef.current?.focus(), 40);
    };

    document.addEventListener("click", handleClick, true);

    return () => document.removeEventListener("click", handleClick, true);
  }, [available, armed]);

  useEffect(() => {
    if (!available) {
      return;
    }

    let frame = 0;
    const handleScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setScrollTick((value) => value + 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [available]);

  if (!available) {
    return null;
  }

  const visibleNotes = notes.filter((note) => {
    const y = note.pageY - window.scrollY;
    const x = note.pageX - window.scrollX;
    return x > -24 && y > -24 && x < window.innerWidth + 24 && y < window.innerHeight + 24;
  });

  const saveDraft = () => {
    const text = draftText.trim();

    if (!draft || text.length < 2) {
      return;
    }

    setNotes((current) => [
      {
        ...draft,
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        createdAt: new Date().toISOString(),
        text,
      },
      ...current,
    ]);
    setDraft(null);
    setDraftText("");
  };

  const copyNotes = async () => {
    const output = formatNotes(notes);

    if (!output) {
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div data-annotation-root className="pointer-events-none fixed inset-0 z-[90]">
      <div className="pointer-events-none fixed inset-0">
        {visibleNotes.map((note, index) => (
          <span
            key={`${note.id}-${scrollTick}`}
            className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-red-200/70 bg-red-500/85 text-[11px] font-black text-white shadow-[0_0_22px_rgba(255,0,60,0.55)]"
            style={{
              left: note.pageX - window.scrollX,
              top: note.pageY - window.scrollY,
            }}
          >
            {notes.length - index}
          </span>
        ))}
      </div>

      <div className="pointer-events-auto fixed right-4 top-1/2 z-[91] flex -translate-y-1/2 flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => {
            setOpen((value) => !value);
            setArmed(false);
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(0,0,0,0.35)] backdrop-blur-xl transition",
            open
              ? "border-red-300/50 bg-red-500/25"
              : "border-white/15 bg-black/72 hover:border-red-300/35 hover:bg-red-950/50"
          )}
          aria-label="Toggle annotation mode"
        >
          <PencilLine className="h-4 w-4" />
          <span className="hidden sm:inline">Annotation</span>
        </button>

        <AnimatePresence>
          {open ? (
            <motion.aside
              initial={{ opacity: 0, x: 24, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-red-500/30 bg-[rgba(8,8,10,0.95)] p-4 text-white shadow-[0_0_34px_rgba(255,0,60,0.22)] backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-red-300">
                    Annotation mode
                  </p>
                  <h2 className="mt-1 text-lg font-black">Change notes</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setArmed(false);
                  }}
                  className="rounded-xl border border-white/15 bg-white/5 p-2 text-white/70 transition hover:text-white"
                  aria-label="Close annotation panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setArmed(true);
                  setDraft(null);
                }}
                className={cn(
                  "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition",
                  armed
                    ? "border-red-200/70 bg-red-500/25 text-red-50"
                    : "border-red-400/35 bg-red-500/12 text-red-100 hover:bg-red-500/18"
                )}
              >
                <MousePointer2 className="h-4 w-4" />
                {armed ? "Click an element now" : "Annotate an element"}
              </button>

              {draft ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/48">
                    Selected
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-white/78">
                    {draft.target}
                  </p>
                  <textarea
                    ref={textareaRef}
                    value={draftText}
                    onChange={(event) => setDraftText(event.target.value)}
                    rows={3}
                    placeholder="What should change here?"
                    className="mt-3 w-full resize-none rounded-2xl border border-white/15 bg-black/42 px-3 py-3 text-sm text-white outline-none placeholder:text-white/38 focus:border-red-300/40"
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={saveDraft}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-300/45 bg-red-500/18 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-red-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraft(null)}
                      className="rounded-2xl border border-white/12 bg-white/5 px-3 py-2 text-xs text-white/65"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                  {notes.length} notes
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copyNotes}
                    disabled={!notes.length}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-2.5 py-2 text-xs text-white/68 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotes([])}
                    disabled={!notes.length}
                    className="rounded-xl border border-white/12 bg-white/5 p-2 text-white/58 disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Clear annotations"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                {notes.length ? (
                  notes.map((note, index) => (
                    <div
                      key={note.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.035] p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-200">
                          Note {notes.length - index}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setNotes((current) =>
                              current.filter((entry) => entry.id !== note.id)
                            )
                          }
                          className="text-white/38 transition hover:text-white"
                          aria-label="Delete note"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-white/46">
                        {note.target}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/82">
                        {note.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.025] p-4 text-center text-sm text-white/42">
                    Click "Annotate an element", then click the page.
                  </div>
                )}
              </div>
            </motion.aside>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
