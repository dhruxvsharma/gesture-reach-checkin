import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";

export const Route = createFileRoute("/complete")({
  component: CompletePage,
});

function CompletePage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Step 10 of 11 · You're checked in</div>
      <h1 className="font-sans mb-3 text-5xl font-bold tracking-tight text-foreground">Your queue number</h1>

      <div className="mb-3 font-sans text-[160px] font-light leading-none tracking-tight text-primary tabular-nums">
        A·24
      </div>
      <p className="mb-8 text-lg text-muted-foreground">Please have a seat in the waiting area</p>

      <div className="mb-8 grid w-full max-w-3xl grid-cols-2 gap-5">
        <div className="surface-card rounded-2xl p-6 text-center">
          <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Estimated wait</div>
          <div className="font-sans text-4xl font-light text-foreground">~12<span className="text-xl text-muted-foreground"> min</span></div>
        </div>
        <div className="surface-card rounded-2xl p-6 text-center">
          <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Location</div>
          <div className="font-sans text-2xl font-light text-foreground">Building B</div>
          <div className="text-sm text-muted-foreground">Floor 3 · Room 312</div>
        </div>
      </div>

      <DwellButton variant="primary" onConfirm={() => navigate({ to: "/feedback" })} className="px-12 py-5 text-lg font-medium">
        Done
      </DwellButton>
    </div>
  );
}
