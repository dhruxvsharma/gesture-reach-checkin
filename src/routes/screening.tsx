import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";
import { kioskStore } from "@/lib/kiosk-store";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/screening")({
  component: ScreeningPage,
});

const QUESTIONS = [
  { key: "fever", text: "Have you had a fever above 100.4°F (38°C) in the last 48 hours?" },
  { key: "symptoms", text: "Are you experiencing cough, shortness of breath, or loss of taste/smell?" },
  { key: "exposure", text: "Have you been in close contact with someone who tested positive in the last 14 days?" },
] as const;

function ScreeningPage() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({ fever: false, symptoms: false, exposure: false });

  const answer = (val: boolean) => {
    const key = QUESTIONS[step].key;
    const next = { ...answers, [key]: val };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      kioskStore.set({ screeningFlags: next });
      const anyFlag = next.fever || next.symptoms || next.exposure;
      navigate({ to: anyFlag ? "/symptoms" : "/payment" });
    }
  };

  const q = QUESTIONS[step];
  const progressPct = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="kiosk-page">
      <div className="kiosk-page-header">
        <div className="kiosk-step">Step 6 of 11 · Health screening</div>
        <div className="mt-1 text-sm font-medium text-foreground">Question {step + 1} of {QUESTIONS.length}</div>
      </div>
      <div className="mt-5 mb-9 h-1.5 w-64 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.h1
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="font-sans mb-10 max-w-3xl text-center text-4xl font-light leading-tight tracking-tight text-foreground text-balance"
        >
          {q.text}
        </motion.h1>
      </AnimatePresence>

      <div key={step} className="kiosk-choice-grid max-w-3xl grid-cols-1 sm:grid-cols-2">
        <DwellButton onConfirm={() => answer(false)} className="flex min-h-[180px] flex-col items-center justify-center py-10">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-2xl font-medium text-foreground">No</div>
        </DwellButton>
        <DwellButton onConfirm={() => answer(true)} className="flex min-h-[180px] flex-col items-center justify-center py-10">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="text-2xl font-medium text-foreground">Yes</div>
        </DwellButton>
      </div>
    </div>
  );
}
