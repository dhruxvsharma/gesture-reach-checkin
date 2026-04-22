import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";
import { kioskStore } from "@/lib/kiosk-store";

export const Route = createFileRoute("/receipt")({
  component: ReceiptPage,
});

const OPTIONS = [
  {
    id: "email",
    title: "Email",
    detail: "s.m@****.com",
    icon: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" /></>,
  },
  {
    id: "sms",
    title: "Text message",
    detail: "(***) ***-2841",
    icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  },
  {
    id: "print",
    title: "Print",
    detail: "Pick up at the desk",
    icon: <><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></>,
  },
] as const;

function ReceiptPage() {
  const navigate = useNavigate();
  const choose = (c: "email" | "sms" | "print") => {
    kioskStore.set({ receiptChoice: c });
    navigate({ to: "/complete" });
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Step 9 of 11</div>
      <h1 className="font-serif mb-3 text-5xl font-light tracking-tight text-foreground">How should we send your receipt?</h1>
      <p className="mb-12 text-lg text-muted-foreground">Choose your preferred delivery method</p>
      <div className="grid w-full max-w-5xl grid-cols-3 gap-5">
        {OPTIONS.map((o) => (
          <DwellButton key={o.id} onConfirm={() => choose(o.id)} className="flex flex-col items-start p-8 text-left min-h-[220px]">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                {o.icon}
              </svg>
            </div>
            <h3 className="font-serif mb-1 text-2xl font-medium text-foreground">{o.title}</h3>
            <p className="text-sm text-muted-foreground">{o.detail}</p>
          </DwellButton>
        ))}
      </div>
    </div>
  );
}
