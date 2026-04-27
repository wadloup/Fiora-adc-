import { type ReactNode, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Home, RotateCcw, Sparkles, X } from "lucide-react";
import { cn } from "../utils/cn";

type IQOption = {
  text: string;
  score: number;
  caption: string;
  math?: "solutionA" | "solutionB";
};

type IQQuestion = {
  title: string;
  prompt: string;
  caption: string;
  mathBlock?: "heatEquation";
  options: IQOption[];
};

type StoredIQResult = {
  answers: number[];
  iq: number;
};

type IQTestProps = {
  open: boolean;
  onClose: () => void;
  onGoHome: () => void;
  musicSlot?: ReactNode;
};

const STORAGE_KEY = "fiora-adc-iq-test-v1";

const questions: IQQuestion[] = [
  {
    title: "LoL",
    prompt: "You see Fiora ADC locked in champ select. What do you do?",
    caption: "Draft sanity scan",
    options: [
      {
        text: "Pick Alistar supp and become useful",
        score: 29,
        caption: "Rare support behavior. The lab is concerned.",
      },
      {
        text: "Report Fiora, then play the game normally like a bureaucratic coward",
        score: 6,
        caption: "Paperwork brain detected.",
      },
      {
        text: "Stick a finger up your ass and call it draft adaptation",
        score: -31,
        caption: "Draft adaptation left the building.",
      },
    ],
  },
  {
    title: "Social Intelligence",
    prompt: 'A door says "PULL". You push it. What now?',
    caption: "Reading comprehension duel",
    options: [
      {
        text: "Blame the door",
        score: -18,
        caption: "The door is innocent and disappointed.",
      },
      {
        text: "Ask if the door is bugged",
        score: -10,
        caption: "Patch notes cannot save you here.",
      },
      {
        text: "Pretend it is broken so nobody realizes you are an idiot",
        score: 4,
        caption: "Cowardly, but socially optimized.",
      },
    ],
  },
  {
    title: "Pure Intelligence",
    prompt: "Solve for ψ(x,t):",
    caption: "Five seconds of fake academia",
    mathBlock: "heatEquation",
    options: [
      {
        text: "Solution A",
        score: 52,
        caption: "Suspiciously serious. Borderline employable.",
        math: "solutionA",
      },
      {
        text: "Solution B",
        score: 17,
        caption: "Looks educated enough to be dangerous.",
        math: "solutionB",
      },
      {
        text: "I don't know, asshole. You think I have time for this? Reported again.",
        score: -19,
        caption: "Academic surrender speedrun.",
      },
    ],
  },
  {
    title: "Human Side",
    prompt: "A 10/10 girl breaks into your house and smells like cinnamon. What do you do?",
    caption: "Morality ping test",
    options: [
      {
        text: "Chase her out with a broom and become a misogynistic headline",
        score: -14,
        caption: "Headline risk: extreme.",
      },
      {
        text: "Get naked to scare her away, but somehow it fails",
        score: -27,
        caption: "The emergency plan made the emergency worse.",
      },
      {
        text: "Realize it is not your house, then deny that detail completely",
        score: 8,
        caption: "Reality lost the argument.",
      },
    ],
  },
  {
    title: "Simple Logic",
    prompt: "You lose the game even though you gave your absolute best. What now?",
    caption: "Post-game cope detector",
    options: [
      {
        text: "Flame your 2/13 mid laner",
        score: 9,
        caption: "Not noble. Not wrong either.",
      },
      {
        text: "Enter deep reflection and wonder if you could have done more",
        score: 34,
        caption: "Growth mindset. Disgusting, but effective.",
      },
      {
        text: "Insult Fiora's entire family tree even though it was not her fault",
        score: -24,
        caption: "Accountability has been uninstalled.",
      },
    ],
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function signatureHash(answers: number[]) {
  return answers.reduce((total, answer, index) => total + (answer + 1) * (index + 3) * 17, 0);
}

function calculateIQ(answers: number[]) {
  const base = 74;
  const optionScore = answers.reduce(
    (total, answer, index) => total + questions[index].options[answer].score,
    0
  );
  const jitter = (signatureHash(answers) % 29) - 14;
  let comboBonus = 0;

  if (answers.join("") === "00211") {
    comboBonus += 18;
  }

  if (answers.join("") === "22212") {
    comboBonus -= 21;
  }

  if (answers[2] === 0 && answers[4] === 1) {
    comboBonus += 9;
  }

  return clamp(base + optionScore + jitter + comboBonus, 12, 189);
}

function pickVerdict(options: string[], iq: number, answers: number[]) {
  return options[(signatureHash(answers) + iq) % options.length];
}

function getVerdict(iq: number, answers: number[]) {
  if (answers[0] === 2) {
    return pickVerdict(
      [
        "Your draft process is medically fascinating and legally useless.",
        "Your brain saw the correct answer and flashed away from it.",
      ],
      iq,
      answers
    );
  }

  if (answers[2] === 0 && iq > 130) {
    return pickVerdict(
      [
        "Disgustingly functional. You might actually deserve oxygen in champ select.",
        "Violently competent. You probably ping cooldowns before people invent excuses.",
      ],
      iq,
      answers
    );
  }

  if (iq < 45) {
    return pickVerdict(
      [
        "Your brain is not AFK. It disconnected from the server.",
        "Your decision-making has the structural integrity of a level 1 tower dive.",
        "Not human. More like a corrupted bot trained on surrender votes and bad pings.",
      ],
      iq,
      answers
    );
  }

  if (iq < 75) {
    return pickVerdict(
      [
        "You are not stupid. You are just aggressively unfinished.",
        "You are the reason surrender votes have a cooldown.",
      ],
      iq,
      answers
    );
  }

  if (iq < 105) {
    return "Average human. Dangerous when confident, but technically playable.";
  }

  if (iq < 135) {
    return pickVerdict(
      [
        "You might actually track cooldowns. Suspicious behavior.",
        "High IQ, hostile aura. You read the lane and still choose violence.",
      ],
      iq,
      answers
    );
  }

  return pickVerdict(
    [
      "Too smart for bot lane, too damaged for peace.",
      "Sharp enough to play the map, toxic enough to make it entertaining.",
    ],
    iq,
    answers
  );
}

function loadStoredResult(): StoredIQResult | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredIQResult;
    if (
      Array.isArray(parsed.answers) &&
      parsed.answers.length === questions.length &&
      typeof parsed.iq === "number"
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

function Fraction({ top, bottom }: { top: string; bottom: string }) {
  return (
    <span className="mx-1 inline-grid translate-y-[0.18em] grid-rows-2 items-center text-center text-[0.82em] leading-none">
      <span className="border-b border-current px-1 pb-0.5">{top}</span>
      <span className="px-1 pt-0.5">{bottom}</span>
    </span>
  );
}

function ExpTerm({ children }: { children: string }) {
  return (
    <span>
      e<sup className="text-[0.72em]">{children}</sup>
    </span>
  );
}

function MathPanel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 rounded-3xl border border-white/14 bg-[radial-gradient(circle_at_100%_0%,rgba(0,210,255,0.09),transparent_30%),rgba(0,0,0,0.42)] p-4 text-white shadow-[inset_0_0_24px_rgba(255,255,255,0.035)] md:p-5">
      <div className="space-y-4 font-serif text-[1.05rem] leading-8 text-red-50/92 md:text-[1.18rem]">
        {children}
      </div>
    </div>
  );
}

function HeatEquationPanel() {
  return (
    <MathPanel>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <Fraction top="∂ψ" bottom="∂t" />
        <span>=</span>
        <span>4</span>
        <Fraction top="∂²ψ" bottom="∂x²" />
        <span>− 3ψ</span>
        <span>+ 6</span>
        <ExpTerm>-19t</ExpTerm>
        <span>sin(2πx)</span>
        <span>− 10</span>
        <ExpTerm>-103t</ExpTerm>
        <span>sin(5πx)</span>
      </div>

      <div className="grid gap-3 text-[0.95rem] text-white/78 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <p className="mb-2 font-sans text-[10px] font-black uppercase tracking-[0.22em] text-red-200">
            Initial state
          </p>
          <p>ψ(x,0) = 5sin(2πx) − 2sin(5πx)</p>
          <p>ψ(0,t) = 0, ψ(1,t) = 0</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <p className="mb-2 font-sans text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100">
            Extra condition
          </p>
          <p>ψ(x,0) = sin(πx)</p>
          <p>ψ(0,t) = 0, ψ(1,t) = 0</p>
        </div>
      </div>
    </MathPanel>
  );
}

function SolutionMath({ variant }: { variant: "solutionA" | "solutionB" }) {
  const first = variant === "solutionA" ? "16π² + 3" : "8π² + 3";
  const second = variant === "solutionA" ? "100π² + 3" : "50π² + 3";
  const firstDenominator = variant === "solutionA" ? "16π² − 16" : "8π² − 16";
  const secondDenominator = variant === "solutionA" ? "100π² − 100" : "50π² − 100";

  return (
    <div className="space-y-3 font-serif text-[1rem] leading-8 text-white md:text-[1.14rem]">
      <div className="font-semibold">ψ(x,t) =</div>
      <div className="pl-2">
        <span>5</span>
        <ExpTerm>{`−(${first})t`}</ExpTerm>
        <span> sin(2πx)</span>
      </div>
      <div className="pl-2">
        <span>− 2</span>
        <ExpTerm>{`−(${second})t`}</ExpTerm>
        <span> sin(5πx)</span>
      </div>
      <div className="pl-2">
        <span>+</span>
        <Fraction top="6" bottom={firstDenominator} />
        <ExpTerm>-19t</ExpTerm>
        <span> sin(2πx)</span>
      </div>
      <div className="pl-2">
        <span>−</span>
        <Fraction top="10" bottom={secondDenominator} />
        <ExpTerm>-103t</ExpTerm>
        <span> sin(5πx)</span>
      </div>
    </div>
  );
}

function OptionContent({ option }: { option: IQOption }) {
  if (option.math) {
    return <SolutionMath variant={option.math} />;
  }

  return (
    <span className="whitespace-pre-wrap text-base font-black leading-6 text-white md:text-lg">
      {option.text}
    </span>
  );
}

export default function IQTest({ open, onClose, onGoHome, musicSlot }: IQTestProps) {
  const [answers, setAnswers] = useState<Array<number | null>>(
    Array.from({ length: questions.length }, () => null)
  );
  const [step, setStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!open || hydrated) {
      return;
    }

    const stored = loadStoredResult();
    if (stored) {
      setAnswers(stored.answers);
      setStep(questions.length);
    }
    setHydrated(true);
  }, [hydrated, open]);

  useEffect(() => {
    if (!open) {
      setHydrated(false);
    }
  }, [open]);

  const completedAnswers = useMemo(
    () => (answers.every((answer) => answer !== null) ? (answers as number[]) : null),
    [answers]
  );
  const iq = completedAnswers ? calculateIQ(completedAnswers) : null;
  const showingResult = step >= questions.length && completedAnswers && iq !== null;
  const currentQuestion = questions[Math.min(step, questions.length - 1)];
  const currentAnswer = answers[step];
  const progress = showingResult ? 100 : ((step + 1) / questions.length) * 100;

  useEffect(() => {
    if (!completedAnswers || iq === null) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers: completedAnswers, iq })
      );
    } catch {
      // Private browser contexts may block localStorage; the quiz still works.
    }
  }, [completedAnswers, iq]);

  const selectAnswer = (answerIndex: number) => {
    setAnswers((current) => {
      const next = [...current];
      next[step] = answerIndex;
      return next;
    });
  };

  const goNext = () => {
    if (currentAnswer === null) {
      return;
    }

    if (step >= questions.length - 1) {
      setStep(questions.length);
      return;
    }

    setStep((value) => value + 1);
  };

  const retry = () => {
    setAnswers(Array.from({ length: questions.length }, () => null));
    setStep(0);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[160] overflow-y-auto bg-black/88 px-3 py-5 text-white backdrop-blur-xl md:px-6"
          role="dialog"
          aria-modal="true"
          aria-label="Test your IQ"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,32,82,0.28),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(0,220,255,0.16),transparent_26%),linear-gradient(135deg,rgba(50,0,12,0.68),rgba(0,0,0,0.95)_52%,rgba(10,12,16,0.9))]" />
          <div className="intro-cinematic-grid pointer-events-none fixed inset-0 opacity-45" />
          <motion.div
            className="pointer-events-none fixed left-0 top-24 h-px w-[80vw] bg-gradient-to-r from-transparent via-red-200 to-transparent shadow-[0_0_24px_rgba(255,70,110,0.82)]"
            animate={{ x: ["-90%", "120%"], opacity: [0, 1, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-5xl items-center">
            <motion.div
              className="relative w-full overflow-hidden rounded-[2rem] border border-red-400/25 bg-black/62 shadow-[0_34px_120px_rgba(0,0,0,0.72),0_0_44px_rgba(255,0,72,0.14)] backdrop-blur-2xl"
              initial={{ y: 24, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-200/80 to-transparent" />
              <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-red-500/12 blur-3xl" />

              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 z-20 rounded-2xl border border-white/12 bg-black/55 p-3 text-white/70 transition hover:border-red-300/50 hover:text-white"
                aria-label="Close IQ test"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
                <aside className="relative overflow-hidden border-b border-white/10 p-5 md:p-7 lg:border-b-0 lg:border-r">
                  <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,50,90,0.14),transparent_44%),radial-gradient(circle_at_18%_85%,rgba(255,255,255,0.08),transparent_30%)]" />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <span className="rounded-2xl border border-red-300/25 bg-red-500/14 p-3 text-red-100 shadow-[0_0_24px_rgba(255,40,80,0.18)]">
                        <Brain className="h-6 w-6" />
                      </span>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-200">
                          Test your IQ
                        </p>
                        <h2 className="mt-1 text-3xl font-black uppercase leading-none tracking-[-0.04em] md:text-4xl">
                          5 questions
                        </h2>
                      </div>
                    </div>

                    <p className="mt-5 max-w-sm text-sm leading-6 text-white/68">
                      Determine your IQ with terrifying precision.
                    </p>

                    {musicSlot ? (
                      <div className="mt-5">
                        {musicSlot}
                      </div>
                    ) : null}

                    <div className="mt-7 overflow-hidden rounded-full border border-white/10 bg-white/[0.05] p-1">
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-red-500 via-red-200 to-cyan-200 shadow-[0_0_18px_rgba(255,80,110,0.55)]"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      />
                    </div>

                    <div className="mt-5 grid grid-cols-5 gap-2">
                      {questions.map((question, index) => (
                        <button
                          key={question.title}
                          type="button"
                          onClick={() => setStep(index)}
                          className={cn(
                            "h-11 rounded-2xl border text-xs font-black transition",
                            index === step && !showingResult
                              ? "border-red-200 bg-red-500/20 text-white shadow-[0_0_18px_rgba(255,50,80,0.2)]"
                              : answers[index] !== null
                                ? "border-cyan-200/35 bg-cyan-300/10 text-cyan-100"
                                : "border-white/10 bg-white/[0.04] text-white/40"
                          )}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    {showingResult ? (
                      <motion.div
                        className="mt-7 rounded-3xl border border-red-300/20 bg-black/35 p-4"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
                          Certified readout
                        </p>
                        <p className="mt-2 text-5xl font-black tracking-[-0.08em] text-white">
                          {iq}
                        </p>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-red-200">
                          IQ points, allegedly
                        </p>
                      </motion.div>
                    ) : null}
                  </div>
                </aside>

                <section className="relative p-5 md:p-7">
                  <AnimatePresence mode="wait">
                    {showingResult ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                        transition={{ duration: 0.28 }}
                        className="flex min-h-[620px] flex-col justify-center"
                      >
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-200">
                          Final diagnosis
                        </p>
                        <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/42">
                              Your IQ is
                            </p>
                            <motion.p
                              className="mt-1 bg-gradient-to-b from-white via-red-100 to-red-400 bg-clip-text text-[clamp(5rem,16vw,10rem)] font-black leading-none tracking-[-0.09em] text-transparent"
                              initial={{ scale: 0.82, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 210, damping: 18 }}
                            >
                              {iq}
                            </motion.p>
                          </div>
                          <motion.div
                            className="rounded-3xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-cyan-100"
                            animate={{
                              boxShadow: [
                                "0 0 0 rgba(0,220,255,0)",
                                "0 0 28px rgba(0,220,255,0.18)",
                                "0 0 0 rgba(0,220,255,0)",
                              ],
                            }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                          >
                            Precision: disgusting
                          </motion.div>
                        </div>

                        <p className="mt-6 max-w-2xl text-2xl font-black leading-tight tracking-[-0.03em] text-white md:text-3xl">
                          {getVerdict(iq, completedAnswers)}
                        </p>

                        <div className="mt-7 grid gap-3 md:grid-cols-2">
                          {completedAnswers.map((answer, index) => (
                            <motion.div
                              key={questions[index].title}
                              initial={{ opacity: 0, y: 14 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.06 }}
                              className="rounded-3xl border border-white/10 bg-black/28 p-4"
                            >
                              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-200">
                                {questions[index].title}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-white/72">
                                {questions[index].options[answer].caption}
                              </p>
                            </motion.div>
                          ))}
                        </div>

                        <div className="mt-8 flex flex-col gap-3">
                          <button
                            type="button"
                            onClick={onGoHome}
                            className="inline-flex min-h-[3.65rem] items-center justify-center gap-3 rounded-2xl border border-red-200/55 bg-gradient-to-r from-red-500/24 via-red-400/18 to-cyan-300/12 px-6 py-4 text-base font-black uppercase tracking-[0.18em] text-white shadow-[0_0_34px_rgba(255,40,85,0.2)] transition hover:scale-[1.01] hover:border-red-100 hover:bg-red-500/28"
                          >
                            <Home className="h-5 w-5" />
                            Go to Home Page
                          </button>
                        </div>

                        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            onClick={retry}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/35 bg-red-500/12 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-red-100 transition hover:bg-red-500/18"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Retry the test
                          </button>
                          <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-white/14 bg-white/[0.05] px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white/80 transition hover:bg-white/[0.08]"
                          >
                            Keep my diagnosis
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: -18, filter: "blur(8px)" }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-200">
                              Question {step + 1} / {questions.length}
                            </p>
                            <h3 className="mt-2 text-3xl font-black uppercase leading-none tracking-[-0.04em] text-white md:text-5xl">
                              {currentQuestion.title}
                            </h3>
                          </div>
                          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100">
                            <Sparkles className="h-3.5 w-3.5" />
                            {currentQuestion.caption}
                          </span>
                        </div>

                        <p className="mt-6 max-w-3xl text-2xl font-black leading-tight tracking-[-0.03em] text-white md:text-3xl">
                          {currentQuestion.prompt}
                        </p>

                        {currentQuestion.mathBlock === "heatEquation" ? (
                          <HeatEquationPanel />
                        ) : null}

                        <div className="mt-6 grid gap-3">
                          {currentQuestion.options.map((option, optionIndex) => {
                            const selected = currentAnswer === optionIndex;

                            return (
                              <motion.button
                                key={option.text}
                                type="button"
                                onClick={() => selectAnswer(optionIndex)}
                                whileHover={{ y: -2, scale: 1.004 }}
                                whileTap={{ scale: 0.99 }}
                                className={cn(
                                  "group relative overflow-hidden rounded-3xl border p-4 text-left transition md:p-5",
                                  selected
                                    ? "border-red-200/65 bg-red-500/[0.16] shadow-[0_0_32px_rgba(255,40,85,0.18)]"
                                    : "border-white/10 bg-white/[0.04] hover:border-red-200/32 hover:bg-red-500/[0.075]"
                                )}
                              >
                                <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-300 via-red-500 to-cyan-200 opacity-0 transition group-hover:opacity-80" />
                                <span className="flex items-start gap-4">
                                  <span
                                    className={cn(
                                      "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border text-xs font-black",
                                      selected
                                        ? "border-red-100 bg-red-400 text-black"
                                        : "border-white/15 bg-black/30 text-white/55"
                                    )}
                                  >
                                    {optionIndex + 1}
                                  </span>
                                  <span className="min-w-0">
                                    <OptionContent option={option} />
                                  </span>
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <button
                            type="button"
                            onClick={() => setStep((value) => Math.max(0, value - 1))}
                            disabled={step === 0}
                            className="rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white/65 transition enabled:hover:bg-white/[0.075] disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            onClick={goNext}
                            disabled={currentAnswer === null}
                            className="rounded-2xl border border-red-300/45 bg-red-500/16 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-red-100 transition enabled:hover:bg-red-500/22 disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            {step === questions.length - 1 ? "Reveal my IQ" : "Next question"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
