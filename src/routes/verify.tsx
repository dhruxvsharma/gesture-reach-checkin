import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";

export const Route = createFileRoute("/verify")({
  component: VerifyPage,
});

function VerifyPage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <h1 className="mb-3 text-5xl font-light tracking-tight">Is this you?</h1>
      <p className="mb-10 text-lg text-muted-foreground">Confirm your appointment details</p>

      <div className="glass-strong mb-10 w-full max-w-2xl rounded-3xl p-10 shadow-card">
        <div className="mb-6 flex items-center gap-5">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-medium text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            SM
          </div>
          <div>
            <div className="text-3xl font-medium">Sarah Mitchell</div>
            <div className="text-sm text-muted-foreground">DOB · March 14, 1987 · Patient #84291</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 border-t border-border pt-6">
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Appointment</div>
            <div className="text-lg font-medium">10:30 AM today</div>
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Provider</div>
            <div className="text-lg font-medium">Dr. James Patel</div>
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Department</div>
            <div className="text-lg font-medium">Internal Medicine</div>
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Visit type</div>
            <div className="text-lg font-medium">Annual physical</div>
          </div>
        </div>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-2 gap-5">
        <DwellButton variant="ghost" onConfirm={() => navigate({ to: "/identify" })} className="py-6 text-lg">
          Not me
        </DwellButton>
        <DwellButton variant="success" onConfirm={() => navigate({ to: "/insurance" })} className="py-6 text-lg font-medium">
          Yes, that's me
        </DwellButton>
      </div>
    </div>
  );
}
