import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";

export const Route = createFileRoute("/insurance")({
  component: InsurancePage,
});

function InsurancePage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Step 5 of 11</div>
      <h1 className="font-serif mb-3 text-5xl font-light tracking-tight text-foreground">Insurance on file</h1>
      <p className="mb-10 text-lg text-muted-foreground">Is this still correct?</p>

      <div className="surface-card mb-10 w-full max-w-2xl rounded-3xl p-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Provider</div>
            <div className="font-serif text-2xl font-medium text-foreground">Blue Cross Blue Shield</div>
          </div>
          <div className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Active
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 border-t border-border pt-6">
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Member ID</div>
            <div className="font-mono text-lg text-foreground">XJL 482 9183 02</div>
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Group</div>
            <div className="font-mono text-lg text-foreground">7842-A</div>
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Plan</div>
            <div className="text-lg text-foreground">PPO Gold</div>
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Effective</div>
            <div className="text-lg text-foreground">Jan 1, 2026</div>
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-2xl items-center justify-between gap-4">
        <DwellButton variant="ghost" onConfirm={() => navigate({ to: "/screening" })} className="px-6 py-4 text-base">
          Update insurance
        </DwellButton>
        <DwellButton variant="primary" onConfirm={() => navigate({ to: "/screening" })} className="flex-1 py-5 text-lg font-medium">
          Confirm
        </DwellButton>
      </div>
    </div>
  );
}
