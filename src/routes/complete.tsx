import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";
import { motion } from "framer-motion";

export const Route = createFileRoute("/complete")({
  component: CompletePage,
});

function CompletePage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">You're checked in</div>
      <h1 className="font-serif mb-3 text-5xl font-light tracking-tight text-foreground">Your queue number</h1>

      <div className="mb-3 font-serif text-[160px] font-light leading-none tracking-tight text-primary tabular-nums">
        A·24
      </div>
      <p className="mb-10 text-lg text-muted-foreground">Please have a seat in the waiting area</p>

      <div className="mb-10 grid w-full max-w-3xl grid-cols-2 gap-5">
        <div className="surface-card rounded-2xl p-6 text-center">
          <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Estimated wait</div>
          <div className="font-serif text-4xl font-light text-foreground">~12<span className="text-xl text-muted-foreground"> min</span></div>
        </div>
        <div className="surface-card rounded-2xl p-6 text-center">
          <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Location</div>
          <div className="font-serif text-2xl font-light text-foreground">Building B</div>
          <div className="text-sm text-muted-foreground">Floor 3 · Room 312</div>
        </div>
      </div>

      <DwellButton variant="primary" onConfirm={() => navigate({ to: "/feedback" })} className="px-12 py-5 text-lg font-medium">
        Done
      </DwellButton>
    </div>
  );
}
