import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";
import * as React from "react";

export const Route = createFileRoute("/sanitize")({
  component: SanitizePage,
});

function SanitizePage() {
  const navigate = useNavigate();
  const [secs, setSecs] = React.useState(8);
  React.useEffect(() => {
    const id = setInterval(() => {
      setSecs((s) => {
        if (s <= 1) {
          clearInterval(id);
          navigate({ to: "/identify" });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [navigate]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-12 text-center">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Step 2 of 11</div>
      <h1 className="font-serif mb-3 text-5xl font-light tracking-tight text-foreground">Please sanitize your hands</h1>
      <p className="mb-10 max-w-xl text-lg text-muted-foreground">
        Use the dispenser to your right before continuing.
      </p>

      <div className="mb-8 flex h-44 w-44 items-center justify-center rounded-3xl border border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
        <svg width="88" height="88" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M9 11.5V6a2 2 0 1 1 4 0v5.5M13 11V4a2 2 0 1 1 4 0v8M17 12V7a2 2 0 1 1 4 0v9a8 8 0 0 1-8 8h-2c-3 0-5-1-7-3l-3-3a2 2 0 0 1 3-3l2 2V6a2 2 0 1 1 4 0v6" />
        </svg>
      </div>

      <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Continuing in</div>
      <div className="mb-10 font-serif text-7xl font-light tabular-nums text-primary">{secs}</div>

      <DwellButton variant="ghost" onConfirm={() => navigate({ to: "/identify" })} className="px-8 py-4">
        Skip — already sanitized
      </DwellButton>
    </div>
  );
}
