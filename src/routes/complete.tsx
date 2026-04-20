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
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="mb-8 flex h-32 w-32 items-center justify-center rounded-full shadow-glow"
        style={{ background: "var(--gradient-primary)" }}
      >
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary-foreground">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <h1 className="mb-4 text-6xl font-light tracking-tight">You're checked in</h1>
      <p className="mb-12 text-lg text-muted-foreground">Please have a seat in the waiting area</p>

      <div className="mb-10 grid w-full max-w-3xl grid-cols-3 gap-5">
        <div className="glass-strong rounded-2xl p-6 text-center">
          <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Queue</div>
          <div className="text-gradient-primary text-5xl font-light">A·24</div>
        </div>
        <div className="glass-strong rounded-2xl p-6 text-center">
          <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Wait time</div>
          <div className="text-5xl font-light">~12<span className="text-2xl text-muted-foreground"> min</span></div>
        </div>
        <div className="glass-strong rounded-2xl p-6 text-center">
          <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Location</div>
          <div className="text-3xl font-light">Bldg B</div>
          <div className="text-sm text-muted-foreground">Floor 3 · Room 312</div>
        </div>
      </div>

      <DwellButton variant="success" onConfirm={() => navigate({ to: "/feedback" })} className="px-12 py-5 text-lg font-medium">
        Done
      </DwellButton>
    </div>
  );
}
