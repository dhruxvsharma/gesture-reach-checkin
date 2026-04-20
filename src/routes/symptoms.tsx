import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";
import { kioskStore } from "@/lib/kiosk-store";
import * as React from "react";

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
    <div className="flex h-full w-full flex-col items-center justify-center px-12 py-24">
      <h1 className="mb-3 text-5xl font-light tracking-tight">Which symptoms apply?</h1>
      <p className="mb-10 text-lg text-muted-foreground">Hover over all that you're experiencing</p>

      <div className="mb-10 grid w-full max-w-5xl grid-cols-4 gap-4">
        {SYMPTOMS.map((s) => {
          const isSel = selected.includes(s);
          return (
            <DwellButton
              key={s}
              onConfirm={() => toggle(s)}
              dwellMs={900}
              variant={isSel ? "success" : "default"}
              className="py-6 text-base font-medium"
            >
              {isSel && "✓ "}{s}
            </DwellButton>
          );
        })}
      </div>

      <DwellButton variant="success" onConfirm={finish} className="px-12 py-5 text-lg font-medium">
        Continue ({selected.length} selected)
      </DwellButton>
    </div>
  );
}
