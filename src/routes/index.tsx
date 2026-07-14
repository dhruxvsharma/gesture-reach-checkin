import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useHandTracking } from "@/hooks/use-hand-tracking";
import { DwellButton } from "@/components/kiosk/DwellButton";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
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
        className="mb-8 max-w-4xl text-center"
      >
        <h1 className="mb-5 flex flex-col items-center justify-center gap-2">
          <span className="font-sans text-[80px] font-bold leading-tight tracking-tight text-foreground">
            Welcome
          </span>
          <span className="font-sans text-[40px] font-medium leading-tight tracking-tight text-muted-foreground">
            let's get you checked in
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground leading-relaxed">
          Experience a seamless, contactless check-in. Navigate using simple hand gestures for a safe and effortless arrival.
        </p>
      </motion.div>

      <div className="mb-6 flex h-40 w-40 shrink-0 items-end justify-center rounded-3xl border border-border bg-white shadow-sm overflow-hidden">
        <DotLottieReact
          src="https://lottie.host/f304b19c-a156-42e3-b652-7b4734c1fb88/9JMojXzauv.lottie"
          loop
          autoplay
          className="h-[120%] w-[120%] origin-bottom translate-y-4"
        />
      </div>

      <p className="mb-2 text-2xl font-medium text-foreground">
        {hand.isDetected ? "Hold steady to begin…" : "Wave your hand to begin"}
      </p>

      <div className="mb-6 h-2 w-72 overflow-hidden rounded-full bg-muted">
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
