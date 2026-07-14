import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";
import { kioskStore } from "@/lib/kiosk-store";
import * as React from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
});

function FeedbackPage() {
  const navigate = useNavigate();
  const [done, setDone] = React.useState<"up" | "down" | null>(null);

  const choose = (v: "up" | "down") => {
    kioskStore.set({ feedback: v });
    setDone(v);
    setTimeout(() => {
      kioskStore.reset();
      navigate({ to: "/" });
    }, 2200);
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-full w-full flex-col items-center justify-center px-12 text-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <h1 className="font-sans mb-3 text-5xl font-bold tracking-tight text-foreground">Thank you</h1>
        <p className="text-lg text-muted-foreground">Have a wonderful visit, Sarah.</p>
      </motion.div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Step 11 of 11</div>
      <h1 className="font-sans mb-3 text-5xl font-bold tracking-tight text-foreground">How was check-in?</h1>
      <p className="mb-14 text-lg text-muted-foreground">Quick feedback helps us improve</p>
      <div className="grid w-full max-w-3xl grid-cols-2 gap-6">
        <DwellButton onConfirm={() => choose("down")} className="flex flex-col items-center py-14 min-h-[260px]">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" transform="rotate(180 12 12)" />
            </svg>
          </div>
          <div className="text-xl font-medium text-foreground">Could be better</div>
        </DwellButton>
        <DwellButton onConfirm={() => choose("up")} className="flex flex-col items-center py-14 min-h-[260px]">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-accent">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
          </div>
          <div className="text-xl font-medium text-foreground">Loved it</div>
        </DwellButton>
      </div>
    </div>
  );
}
