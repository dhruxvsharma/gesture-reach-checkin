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
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Step 8 of 11</div>
      <div className="mb-3 text-sm uppercase tracking-widest text-muted-foreground">Today's copay</div>
      <h1 className="font-serif mb-2 text-7xl font-light tracking-tight text-foreground">
        $<span className="text-primary font-medium">35</span><span className="text-3xl text-muted-foreground">.00</span>
      </h1>
      <p className="mb-12 text-lg text-muted-foreground">How would you like to handle payment?</p>

      <div className="grid w-full max-w-5xl grid-cols-3 gap-5">
        {OPTIONS.map((o) => (
          <DwellButton key={o.id} onConfirm={() => choose(o.id)} className="flex flex-col items-start p-8 text-left min-h-[200px]">
            <h3 className="font-serif mb-3 text-2xl font-medium text-foreground">{o.title}</h3>
            <p className="text-sm text-muted-foreground">{o.desc}</p>
          </DwellButton>
        ))}
      </div>
    </div>
  );
}
