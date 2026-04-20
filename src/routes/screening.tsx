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

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <div className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Health screening · Question {step + 1} of {QUESTIONS.length}
      </div>
      <div className="mb-10 flex gap-2">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 w-16 rounded-full transition-all"
            style={{ background: i <= step ? "var(--gradient-primary)" : "oklch(1 0 0 / 12%)" }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.h1
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-16 max-w-3xl text-center text-4xl font-light leading-tight tracking-tight"
        >
          {q.text}
        </motion.h1>
      </AnimatePresence>

      <div className="grid w-full max-w-2xl grid-cols-2 gap-6">
        <DwellButton onConfirm={() => answer(false)} className="flex flex-col items-center justify-center py-12">
          <div className="mb-3 text-5xl">✓</div>
          <div className="text-2xl font-medium">No</div>
        </DwellButton>
        <DwellButton onConfirm={() => answer(true)} className="flex flex-col items-center justify-center py-12">
          <div className="mb-3 text-5xl">!</div>
          <div className="text-2xl font-medium">Yes</div>
        </DwellButton>
      </div>
    </div>
  );
}
