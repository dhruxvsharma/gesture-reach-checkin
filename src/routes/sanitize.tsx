import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
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
      <h1 className="font-sans mb-3 text-5xl font-bold tracking-tight text-foreground">Please sanitize your hands</h1>
      <p className="mb-10 max-w-xl text-lg text-muted-foreground">
        Use the dispenser to your right before continuing.
      </p>

      <div className="mb-8 flex h-44 w-44 items-center justify-center rounded-3xl border border-border bg-white shadow-sm overflow-hidden p-6">
        <DotLottieReact
          src="https://lottie.host/518a29de-7293-4e64-9bb5-b24240e52cef/nOlXayspbH.lottie"
          loop
          autoplay
        />
      </div>

      <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Continuing in</div>
      <div className="mb-10 font-sans text-7xl font-light tabular-nums text-primary">{secs}</div>

      <DwellButton variant="ghost" onConfirm={() => navigate({ to: "/identify" })} className="px-8 py-4">
        Skip — already sanitized
      </DwellButton>
    </div>
  );
}
