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

  // Auto-advance after sustained hand detection (the "wave")
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
          setTimeout(() => navigate({ to: "/language" }), 300);
        }
      }
    }, 50);
    return () => clearInterval(id);
  }, [navigate]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <div className="mb-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          SmartCare
        </div>
        <h1 className="mb-6 text-7xl font-light tracking-tight">
          Welcome to <span className="text-gradient-primary font-medium">touchless</span> check-in
        </h1>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
          No buttons. No touching. Just your hand.
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative my-8"
      >
        <div
          className="flex h-64 w-64 items-center justify-center rounded-full"
          style={{
            background: hand.isDetected
              ? "radial-gradient(circle, oklch(0.78 0.18 145 / 30%), transparent 70%)"
              : "radial-gradient(circle, oklch(1 0 0 / 5%), transparent 70%)",
            transition: "background 0.4s",
          }}
        >
          <div
            className="flex h-40 w-40 items-center justify-center rounded-full glass-strong"
            style={{
              animation: !hand.isDetected ? "float 3s ease-in-out infinite" : undefined,
              boxShadow: hand.isDetected ? "var(--shadow-glow)" : undefined,
            }}
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </div>
        </div>
        {/* Wave progress ring */}
        {waveProgress > 0 && (
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="120"
              fill="none"
              stroke="oklch(0.78 0.18 145)"
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - waveProgress)}`}
              style={{ transition: "stroke-dashoffset 80ms linear", filter: "drop-shadow(0 0 12px oklch(0.78 0.18 145 / 80%))" }}
            />
          </svg>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center"
      >
        <p className="mb-6 text-2xl font-light tracking-wide">
          {hand.isDetected ? "Hold steady to begin…" : "Wave your hand to begin"}
        </p>
        <DwellButton onConfirm={() => navigate({ to: "/language" })} className="px-10 py-5 text-base">
          Or hold here to start
        </DwellButton>
      </motion.div>
    </div>
  );
}
