import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";

export const Route = createFileRoute("/identify")({
  component: IdentifyPage,
});

const METHODS = [
  {
    id: "voice",
    title: "Voice ID",
    desc: "Say your full name and date of birth",
    icon: (
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
    ),
  },
  {
    id: "qr",
    title: "QR Code",
    desc: "Scan the code from your appointment email",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3M21 14v7M14 21h3" />
      </>
    ),
  },
  {
    id: "card",
    title: "Insurance Card",
    desc: "Hold up your card to the camera",
    icon: (
      <>
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <path d="M2 10h20M6 16h4" />
      </>
    ),
  },
];

function IdentifyPage() {
  const navigate = useNavigate();
  return (
    <div className="kiosk-page">
      <div className="kiosk-page-header">
        <div className="kiosk-step">Step 3 of 11</div>
        <h1 className="kiosk-title">How would you like to check in?</h1>
        <p className="kiosk-subtitle">Choose any method that works for you</p>
      </div>
      <div className="kiosk-choice-grid mt-9 max-w-6xl grid-cols-1 md:grid-cols-3">
        {METHODS.map((m) => (
          <DwellButton key={m.id} onConfirm={() => navigate({ to: "/verify" })} className="flex min-h-[220px] flex-col items-start p-7 text-left sm:p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                {m.icon}
              </svg>
            </div>
            <h3 className="font-sans mb-2 text-xl font-semibold text-foreground">{m.title}</h3>
            <p className="text-sm text-muted-foreground">{m.desc}</p>
          </DwellButton>
        ))}
      </div>
    </div>
  );
}
