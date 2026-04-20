import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";

export const Route = createFileRoute("/insurance")({
  component: InsurancePage,
});

function InsurancePage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <h1 className="mb-3 text-5xl font-light tracking-tight">Insurance on file</h1>
      <p className="mb-10 text-lg text-muted-foreground">Is this still correct?</p>

      <div className="glass-strong mb-10 w-full max-w-2xl rounded-3xl p-10 shadow-card">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Provider</div>
            <div className="text-2xl font-medium">Blue Cross Blue Shield</div>
          </div>
          <div
            className="rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-wider"
            style={{ background: "oklch(0.78 0.18 145 / 20%)", color: "oklch(0.85 0.18 145)" }}
          >
            Active
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 border-t border-border pt-6">
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Member ID</div>
            <div className="font-mono text-lg">XJL 482 9183 02</div>
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Group</div>
            <div className="font-mono text-lg">7842-A</div>
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Plan</div>
            <div className="text-lg">PPO Gold</div>
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Effective</div>
            <div className="text-lg">Jan 1, 2026</div>
          </div>
        </div>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-2 gap-5">
        <DwellButton variant="ghost" onConfirm={() => navigate({ to: "/screening" })} className="py-6 text-lg">
          Update insurance
        </DwellButton>
        <DwellButton variant="success" onConfirm={() => navigate({ to: "/screening" })} className="py-6 text-lg font-medium">
          Confirm
        </DwellButton>
      </div>
    </div>
  );
}
