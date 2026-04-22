import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useHandTracking } from "@/hooks/use-hand-tracking";
import { DwellButton } from "@/components/kiosk/DwellButton";
import * as React from "react";

export const Route = createFileRoute("/")({
  component: WelcomePage,
});

function WelcomePage() {
  const navigate = useNavigate();
  const hand = useHandTracking();
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
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 max-w-3xl text-center"
      >
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          SmartCare Clinic
        </div>
        <h1 className="font-serif mb-5 text-[64px] leading-[1.1] font-light tracking-tight text-foreground text-balance">
          Welcome. Let's get you checked in.
        </h1>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
          A touchless experience — no buttons, no waiting at the desk.
        </p>
      </motion.div>

      <div className="mb-8 flex h-44 w-44 items-center justify-center rounded-3xl border border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
        <svg width="88" height="88" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </svg>
      </div>

      <p className="mb-4 text-2xl font-medium text-foreground">
        {hand.isDetected ? "Hold steady to begin…" : "Wave your hand to begin"}
      </p>

      <div className="mb-10 h-2 w-72 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${waveProgress * 100}%`, transitionDuration: "80ms" }}
        />
      </div>

      <DwellButton onConfirm={() => navigate({ to: "/language" })} className="px-10 py-5 text-base font-medium">
        Or hold here to start
      </DwellButton>
    </div>
  );
}
