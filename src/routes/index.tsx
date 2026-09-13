import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useHandTracking } from "@/hooks/use-hand-tracking";
import { DwellButton } from "@/components/kiosk/DwellButton";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { kioskStore, useKiosk, type CueVariant } from "@/lib/kiosk-store";
import { getCueVariant, getRequestedCueVariant, setCueVariant, useHydrated } from "@/lib/research-telemetry";
import * as React from "react";

export const Route = createFileRoute("/")({
  component: WelcomePage,
});

const STUDY_CONDITIONS: Array<{
  id: CueVariant;
  title: string;
  description: string;
  sample: string;
}> = [
  {
    id: "animated",
    title: "Animated visual cue",
    description: "Looping gesture illustrations guide each action.",
    sample: "↻",
  },
  {
    id: "static",
    title: "Static visual cue",
    description: "Fixed emoji illustrations show the gesture to perform.",
    sample: "👋  🤏",
  },
  {
    id: "none",
    title: "No visual cue",
    description: "The interface uses text instructions only.",
    sample: "Aa",
  },
];

function ConditionSelectPage() {
  const choose = (cueVariant: CueVariant) => {
    setCueVariant(cueVariant);
    kioskStore.set({ cueVariant });
  };

  return (
    <div className="kiosk-page">
      <div className="kiosk-page-header">
        <div className="kiosk-step">Research study setup</div>
        <h1 className="kiosk-title">Choose the interface version</h1>
        <p className="kiosk-subtitle max-w-2xl">
          Select the version this participant will use. Their session will be tagged automatically for analysis.
        </p>
      </div>

      <div className="kiosk-choice-grid mt-9 max-w-5xl grid-cols-1 md:grid-cols-3">
        {STUDY_CONDITIONS.map((condition) => (
          <DwellButton
            key={condition.id}
            onConfirm={() => choose(condition.id)}
            className="flex min-h-[250px] flex-col items-start p-7 text-left sm:p-8"
          >
            <div className="mb-6 flex min-h-16 items-center text-4xl font-semibold tracking-tight text-primary">
              {condition.sample}
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{condition.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{condition.description}</p>
          </DwellButton>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">Choose one version to begin the check-in.</p>
    </div>
  );
}

function WelcomePage() {
  const hydrated = useHydrated();
  const { cueVariant } = useKiosk();
  const requestedCueVariant = getRequestedCueVariant();
  if (!hydrated) return <div className="kiosk-page" aria-hidden="true" />;
  if (!cueVariant && !requestedCueVariant) return <ConditionSelectPage />;
  return <WelcomeExperience />;
}

function WelcomeExperience() {
  const navigate = useNavigate();
  const hand = useHandTracking();
  const { cueVariant: selectedCueVariant } = useKiosk();
  const cueVariant = selectedCueVariant ?? getCueVariant();
  const [waveProgress, setWaveProgress] = React.useState(0);
  const detectedSinceRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (hand.isDetected) {
      if (detectedSinceRef.current === null) detectedSinceRef.current = Date.now();
    } else {
      detectedSinceRef.current = null;
      setWaveProgress(0);
    }
  }, [hand.isDetected]);

  React.useEffect(() => {
    const id = setInterval(() => {
      if (detectedSinceRef.current) {
        const elapsed = Date.now() - detectedSinceRef.current;
        const p = Math.min(1, elapsed / 1800);
        setWaveProgress(p);
        if (p >= 1) {
          clearInterval(id);
          setTimeout(() => navigate({ to: "/language" }), 250);
        }
      }
    }, 50);
    return () => clearInterval(id);
  }, [navigate]);

  return (
    <div className="kiosk-page">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="kiosk-page-header mb-8"
      >
        <h1 className="mb-5 flex flex-col items-center justify-center gap-2">
          <span className="font-sans text-[clamp(3.5rem,7vw,5rem)] font-bold leading-tight tracking-tight text-foreground">
            Welcome
          </span>
          <span className="font-sans text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-tight tracking-tight text-muted-foreground">
            let's get you checked in
          </span>
        </h1>
        <p className="kiosk-subtitle mx-auto max-w-xl">
          Experience a seamless, contactless check-in. Navigate using simple hand gestures for a safe and effortless arrival.
        </p>
      </motion.div>

      {cueVariant !== "none" && (
        <div className="mb-6 flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
          {cueVariant === "animated" ? (
            <DotLottieReact
              src="https://lottie.host/f304b19c-a156-42e3-b652-7b4734c1fb88/9JMojXzauv.lottie"
              loop
              autoplay
              className="h-[120%] w-[120%] origin-bottom translate-y-4"
            />
          ) : (
            <span className="text-7xl leading-none" aria-hidden="true">👋</span>
          )}
        </div>
      )}

      <p className="mb-2 text-xl font-medium text-foreground">
        {hand.isDetected ? "Hold steady to begin…" : "Wave your hand to begin"}
      </p>

      {cueVariant !== "none" && (
        <div className="mb-6 h-2 w-72 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${waveProgress * 100}%`, transitionDuration: "80ms" }}
          />
        </div>
      )}

      <DwellButton onConfirm={() => navigate({ to: "/language" })} className="px-10 py-5 text-base font-medium">
        Or hold here to start
      </DwellButton>
    </div>
  );
}
