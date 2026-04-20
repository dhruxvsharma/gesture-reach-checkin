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
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <h1 className="mb-3 text-5xl font-light tracking-tight">How would you like to check in?</h1>
      <p className="mb-12 text-lg text-muted-foreground">Choose any method below</p>
      <div className="grid w-full max-w-6xl grid-cols-3 gap-6">
        {METHODS.map((m) => (
          <DwellButton key={m.id} onConfirm={() => navigate({ to: "/verify" })} className="flex flex-col items-start p-10 text-left">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-primary">
                {m.icon}
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-medium">{m.title}</h3>
            <p className="text-sm text-muted-foreground">{m.desc}</p>
          </DwellButton>
        ))}
      </div>
    </div>
  );
}
