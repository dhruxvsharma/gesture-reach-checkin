import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DwellButton } from "@/components/kiosk/DwellButton";
import { kioskStore, type Language } from "@/lib/kiosk-store";

export const Route = createFileRoute("/language")({
  component: LanguagePage,
});

const LANGUAGES: { code: Language; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "es", label: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "zh", label: "Chinese", native: "中文", flag: "🇨🇳" },
  { code: "ar", label: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
];

function LanguagePage() {
  const navigate = useNavigate();
  const select = (code: Language) => {
    kioskStore.set({ language: code });
    navigate({ to: "/sanitize" });
  };
  return (
    <div className="kiosk-page">
      <div className="kiosk-page-header">
        <div className="kiosk-step">Step 1 of 11</div>
        <h1 className="kiosk-title">Choose your language</h1>
        <p className="kiosk-subtitle">Select your language · भाषा चुनें · 选择语言 · Selecciona tu idioma · اختر لغتك</p>
      </div>
      <div className="kiosk-choice-grid mt-9 max-w-5xl grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {LANGUAGES.map((l) => (
          <DwellButton
            key={l.code}
            onConfirm={() => select(l.code)}
            className="flex min-h-40 flex-col items-center justify-center p-5 sm:aspect-[3/4]"
          >
            <div className="font-sans mb-3 w-full text-center text-4xl font-medium text-foreground">{l.native}</div>
            <div className="flex w-full items-center justify-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
              <span className="font-medium">{l.label}</span>
              <span className="font-light opacity-40">|</span>
              <span className="font-medium">{l.flag}</span>
            </div>
          </DwellButton>
        ))}
      </div>
    </div>
  );
}
