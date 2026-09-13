import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";
import { kioskStore } from "@/lib/kiosk-store";

export const Route = createFileRoute("/payment")({
  component: PaymentPage,
});

const OPTIONS = [
  { id: "now", title: "Pay now", desc: "Tap-free with your phone wallet at the next screen" },
  { id: "insurance", title: "Bill insurance", desc: "We'll send the claim — you'll be billed for any balance" },
  { id: "later", title: "Pay later", desc: "Receive an invoice by email within 7 days" },
] as const;

function PaymentPage() {
  const navigate = useNavigate();
  const choose = (c: "now" | "later" | "insurance") => {
    kioskStore.set({ paymentChoice: c });
    navigate({ to: "/receipt" });
  };

  return (
    <div className="kiosk-page">
      <div className="kiosk-page-header">
        <div className="kiosk-step">Step 8 of 11</div>
        <div className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Today’s copay</div>
      <h1 className="mt-2 font-sans text-7xl font-bold tracking-tight text-foreground">
        $<span className="text-primary font-medium">35</span><span className="text-3xl text-muted-foreground">.00</span>
      </h1>
        <p className="kiosk-subtitle">How would you like to handle payment?</p>
      </div>

      <div className="kiosk-choice-grid mt-9 max-w-5xl grid-cols-1 md:grid-cols-3">
        {OPTIONS.map((o) => (
          <DwellButton key={o.id} onConfirm={() => choose(o.id)} className="flex min-h-[180px] flex-col items-start p-7 text-left sm:p-8">
            <h3 className="font-sans mb-3 text-xl font-semibold text-foreground">{o.title}</h3>
            <p className="text-sm text-muted-foreground">{o.desc}</p>
          </DwellButton>
        ))}
      </div>
    </div>
  );
}
