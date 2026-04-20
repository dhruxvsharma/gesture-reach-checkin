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
        <div className="mb-6 text-7xl">{done === "up" ? "🙏" : "💚"}</div>
        <h1 className="mb-4 text-5xl font-light tracking-tight">Thank you</h1>
        <p className="text-lg text-muted-foreground">Have a wonderful visit, Sarah.</p>
      </motion.div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <h1 className="mb-3 text-5xl font-light tracking-tight">How was check-in?</h1>
      <p className="mb-16 text-lg text-muted-foreground">Quick feedback helps us improve</p>
      <div className="grid w-full max-w-2xl grid-cols-2 gap-6">
        <DwellButton onConfirm={() => choose("down")} className="flex flex-col items-center py-16">
          <div className="mb-4 text-7xl">👎</div>
          <div className="text-xl font-medium">Could be better</div>
        </DwellButton>
        <DwellButton onConfirm={() => choose("up")} className="flex flex-col items-center py-16">
          <div className="mb-4 text-7xl">👍</div>
          <div className="text-xl font-medium">Loved it</div>
        </DwellButton>
      </div>
    </div>
  );
}
