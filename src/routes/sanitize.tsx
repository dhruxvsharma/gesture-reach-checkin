import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useKiosk } from "@/lib/kiosk-store";
import { getCueVariant } from "@/lib/research-telemetry";
import * as React from "react";

export const Route = createFileRoute("/sanitize")({
  component: SanitizePage,
});

function SanitizePage() {
  const navigate = useNavigate();
  const { cueVariant: selectedCueVariant } = useKiosk();
  const cueVariant = selectedCueVariant ?? getCueVariant();
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
    <div className="kiosk-page text-center">
      <div className="kiosk-page-header">
        <div className="kiosk-step">Step 2 of 11</div>
        <h1 className="kiosk-title">Please sanitize your hands</h1>
        <p className="kiosk-subtitle max-w-xl">Use the dispenser to your right before continuing.</p>
      </div>

      {cueVariant !== "none" && (
        <div className="mt-9 mb-8 flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl border border-border bg-white p-5 shadow-sm">
          {cueVariant === "animated" ? (
            <DotLottieReact
              src="https://lottie.host/518a29de-7293-4e64-9bb5-b24240e52cef/nOlXayspbH.lottie"
              loop
              autoplay
            />
          ) : (
            <span className="text-7xl leading-none" aria-hidden="true">🧴</span>
          )}
        </div>
      )}

      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Continuing in</div>
      <div className="mb-8 font-sans text-6xl font-light tabular-nums text-primary">{secs}</div>

      <DwellButton variant="ghost" onConfirm={() => navigate({ to: "/identify" })} className="px-8 py-4">
        Skip — already sanitized
      </DwellButton>
    </div>
  );
}
