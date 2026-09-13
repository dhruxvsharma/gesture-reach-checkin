import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";
import { kioskStore } from "@/lib/kiosk-store";
import * as React from "react";
import { motion } from "framer-motion";
import { downloadResearchData, logResearchEvent, resetResearchSession } from "@/lib/research-telemetry";

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
});

function FeedbackPage() {
  const navigate = useNavigate();
  const [done, setDone] = React.useState<"up" | "down" | null>(null);
  const resetTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  const choose = (v: "up" | "down") => {
    kioskStore.set({ feedback: v });
    logResearchEvent("feedback_submitted", {
      target: v === "up" ? "Loved it" : "Could be better",
      input: "system",
    });
    setDone(v);
    resetTimerRef.current = window.setTimeout(() => {
      resetResearchSession();
      kioskStore.reset();
      navigate({ to: "/" });
    }, 15000);
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="kiosk-page text-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <h1 className="font-sans mb-3 text-5xl font-bold tracking-tight text-foreground">Thank you</h1>
        <p className="text-lg text-muted-foreground">Have a wonderful visit, Sarah.</p>
        <div className="mt-8 rounded-2xl border border-border bg-white/75 p-5 shadow-sm">
          <div className="text-sm font-semibold text-foreground">Research session saved locally</div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Download the raw event log for this participant before starting the next session.
          </p>
          <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
            <DwellButton
              variant="primary"
              onConfirm={() => downloadResearchData("csv")}
              className="px-5 py-3 text-sm font-semibold"
            >
              Download CSV
            </DwellButton>
            <DwellButton
              variant="ghost"
              onConfirm={() => downloadResearchData("json")}
              className="px-5 py-3 text-sm font-semibold"
            >
              Download JSON
            </DwellButton>
          </div>
          <div className="mt-3 text-[11px] text-muted-foreground">Returning to welcome in 15 seconds</div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="kiosk-page">
      <div className="kiosk-page-header">
        <div className="kiosk-step">Step 11 of 11</div>
        <h1 className="kiosk-title">How was check-in?</h1>
        <p className="kiosk-subtitle">Quick feedback helps us improve</p>
      </div>
      <div className="kiosk-choice-grid mt-9 max-w-3xl grid-cols-1 sm:grid-cols-2">
        <DwellButton onConfirm={() => choose("down")} className="flex min-h-[220px] flex-col items-center py-12">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" transform="rotate(180 12 12)" />
            </svg>
          </div>
          <div className="text-xl font-medium text-foreground">Could be better</div>
        </DwellButton>
        <DwellButton onConfirm={() => choose("up")} className="flex min-h-[220px] flex-col items-center py-12">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-accent">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
          </div>
          <div className="text-xl font-medium text-foreground">Loved it</div>
        </DwellButton>
      </div>
    </div>
  );
}
