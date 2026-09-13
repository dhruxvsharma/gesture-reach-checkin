import { useLocation } from "@tanstack/react-router";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useKiosk } from "@/lib/kiosk-store";
import { getRequestedCueVariant, useCueVariant, useHydrated } from "@/lib/research-telemetry";

type GestureMode = "wave" | "pinch" | "multiple" | "status";

interface CoachContent {
  mode: GestureMode;
  eyebrow: string;
  title: string;
  detail: string;
}

const COACH_BY_PATH: Record<string, CoachContent> = {
  "/": {
    mode: "wave",
    eyebrow: "How to begin",
    title: "Wave your hand",
    detail: "Hold your hand where the camera can see it.",
  },
  "/sanitize": {
    mode: "status",
    eyebrow: "Step in progress",
    title: "Sanitize your hands",
    detail: "We’ll continue automatically when the timer ends.",
  },
  "/symptoms": {
    mode: "multiple",
    eyebrow: "Choose more than one",
    title: "Point and pinch each choice",
    detail: "Pinch again to remove a choice, then pinch Continue.",
  },
};

const DEFAULT_COACH: CoachContent = {
  mode: "pinch",
  eyebrow: "Touchless controls",
  title: "Point, then pinch to choose",
  detail: "Move your index finger over an option and bring your thumb and finger together.",
};

function GestureIllustration({ mode, animated }: { mode: GestureMode; animated: boolean }) {
  if (!animated) {
    return (
      <div className="text-6xl leading-none" aria-hidden="true">
        {mode === "wave" ? "👋" : mode === "status" ? "🧴" : "🤏"}
      </div>
    );
  }

  if (mode === "wave") {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true" className={`h-24 w-24 shrink-0 ${animated ? "" : "gesture-coach-static"}`}>
        <g
          className="gesture-coach-wave-lines"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        >
          <path d="M85 22c8 5 12 12 12 20" />
          <path d="M96 14c12 8 18 20 18 33" />
        </g>
        <g
          className="gesture-coach-wave-hand"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        >
          <path d="M47 97V45a5 5 0 0 1 10 0v22-38a5 5 0 0 1 10 0v35-42a5 5 0 0 1 10 0v42-31a5 5 0 0 1 10 0v38l5-12a5 5 0 0 1 9 4l-7 22c-4 13-14 20-28 20H60c-7 0-13-3-18-8l-12-13a5 5 0 0 1 7-7l10 9" />
        </g>
      </svg>
    );
  }

  if (mode === "status") {
    return (
      <div className={`gesture-coach-status ${animated ? "" : "gesture-coach-static"}`} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    );
  }

  return (
    <DotLottieReact
      src="/gesture-pinch.lottie"
      loop={animated}
      autoplay={animated}
      className={`gesture-coach-lottie h-28 w-28 ${animated ? "" : "gesture-coach-static"}`}
    />
  );
}

export function GestureCoach() {
  const location = useLocation();
  const kiosk = useKiosk();
  const hydrated = useHydrated();
  const cueVariant = useCueVariant(kiosk.cueVariant);
  const isSetup = location.pathname === "/" && !kiosk.cueVariant && !getRequestedCueVariant();
  if (!hydrated || cueVariant === "none" || isSetup) return null;
  const content = Object.hasOwn(COACH_BY_PATH, location.pathname)
    ? COACH_BY_PATH[location.pathname]
    : DEFAULT_COACH;
  return (
    <aside
      aria-live="polite"
      className="gesture-coach pointer-events-none fixed bottom-6 left-6 z-40 flex w-[360px] max-w-[calc(100vw-2rem)] items-center gap-4 rounded-2xl border border-border bg-white/95 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_rgba(15,23,42,0.10)] backdrop-blur"
    >
      <div className="flex h-28 w-28 shrink-0 items-center justify-center text-primary">
        <GestureIllustration mode={content.mode} animated={cueVariant === "animated"} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
          {content.eyebrow}
        </div>
        <div className="mt-0.5 text-sm font-semibold text-foreground">{content.title}</div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{content.detail}</p>
      </div>
    </aside>
  );
}
