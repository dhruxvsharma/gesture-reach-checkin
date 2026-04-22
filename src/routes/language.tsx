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
    <div className="flex h-full w-full flex-col items-center justify-center px-12">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Step 1 of 11</div>
      <h1 className="font-serif mb-3 text-5xl font-light tracking-tight text-foreground">Choose your language</h1>
      <p className="mb-12 text-lg text-muted-foreground">Selecciona tu idioma · 选择语言 · اختر لغتك · भाषा चुनें</p>
      <div className="grid w-full max-w-5xl grid-cols-5 gap-5">
        {LANGUAGES.map((l) => (
          <DwellButton
            key={l.code}
            onConfirm={() => select(l.code)}
            className="relative flex aspect-[3/4] flex-col items-center justify-center p-6"
          >
            <div className="absolute right-3 top-3 text-2xl">{l.flag}</div>
            <div className="font-serif mb-3 text-4xl font-medium text-foreground">{l.native}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{l.label}</div>
          </DwellButton>
        ))}
      </div>
    </div>
  );
}
