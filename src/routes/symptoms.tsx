import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";
import { kioskStore } from "@/lib/kiosk-store";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/symptoms")({
  component: SymptomsPage,
});

const SYMPTOMS = [
  "Fever", "Cough", "Sore throat", "Shortness of breath",
  "Loss of taste", "Loss of smell", "Fatigue", "Body aches",
  "Headache", "Nausea", "Diarrhea", "Congestion",
];

function SymptomsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState<string[]>([]);

  const toggle = (s: string) => {
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const finish = () => {
    kioskStore.set({ selectedSymptoms: selected });
    navigate({ to: "/payment" });
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Step 7 of 11</div>
      <h1 className="font-sans mb-3 text-5xl font-bold tracking-tight text-foreground">Which symptoms apply?</h1>
      <p className="mb-10 text-lg text-muted-foreground">Hover over all that you're experiencing</p>

      <div className="mb-10 grid w-full max-w-5xl grid-cols-4 gap-4">
        {SYMPTOMS.map((s) => {
          const isSel = selected.includes(s);
          return (
            <DwellButton
              key={s}
              onConfirm={() => toggle(s)}
              dwellMs={800}
              className={cn(
                "py-6 text-base font-medium",
                isSel && "border-primary bg-accent text-primary",
              )}
            >
              {isSel && (
                <span className="mr-1 inline-block">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="inline -mt-0.5">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              {s}
            </DwellButton>
          );
        })}
      </div>

      <DwellButton variant="primary" onConfirm={finish} className="px-12 py-5 text-lg font-medium">
        Continue ({selected.length} selected)
      </DwellButton>
    </div>
  );
}
