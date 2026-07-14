import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";

export const Route = createFileRoute("/verify")({
  component: VerifyPage,
});

function VerifyPage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Step 4 of 11</div>
      <h1 className="font-sans mb-3 text-5xl font-bold tracking-tight text-foreground">Is this you?</h1>
      <p className="mb-10 text-lg text-muted-foreground">Confirm your appointment details</p>

      <div className="surface-card mb-10 w-full max-w-2xl rounded-3xl p-10">
        <div className="mb-6 flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-primary">
            SM
          </div>
          <div>
            <div className="font-sans text-3xl font-medium text-foreground">Sarah Mitchell</div>
            <div className="text-sm text-muted-foreground">DOB · March 14, 1987 · Patient #84291</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 border-t border-border pt-6">
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Appointment</div>
            <div className="text-lg font-medium text-foreground">10:30 AM today</div>
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Provider</div>
            <div className="text-lg font-medium text-foreground">Dr. James Patel</div>
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Department</div>
            <div className="text-lg font-medium text-foreground">Internal Medicine</div>
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Visit type</div>
            <div className="text-lg font-medium text-foreground">Annual physical</div>
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-2xl items-center justify-between gap-4">
        <DwellButton variant="ghost" onConfirm={() => navigate({ to: "/identify" })} className="px-6 py-4 text-base">
          Not me
        </DwellButton>
        <DwellButton variant="primary" onConfirm={() => navigate({ to: "/insurance" })} className="flex-1 py-5 text-lg font-medium">
          Yes, that's me
        </DwellButton>
      </div>
    </div>
  );
}
