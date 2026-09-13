// Simple zustand-free global store for kiosk session state
import * as React from "react";

export type Language = "en" | "es" | "zh" | "ar" | "hi";
export type CueVariant = "animated" | "static" | "none";

export interface KioskState {
  cueVariant: CueVariant | null;
  language: Language;
  screeningFlags: { fever: boolean; symptoms: boolean; exposure: boolean };
  selectedSymptoms: string[];
  paymentChoice: "now" | "later" | "insurance" | null;
  receiptChoice: "email" | "sms" | "print" | null;
  feedback: "up" | "down" | null;
}

const initialState: KioskState = {
  cueVariant: null,
  language: "en",
  screeningFlags: { fever: false, symptoms: false, exposure: false },
  selectedSymptoms: [],
  paymentChoice: null,
  receiptChoice: null,
  feedback: null,
};

let state: KioskState = { ...initialState };
const listeners = new Set<() => void>();

export const kioskStore = {
  get: () => state,
  set: (patch: Partial<KioskState>) => {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  reset: () => {
    state = { ...initialState };
    listeners.forEach((l) => l());
  },
  subscribe: (fn: () => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useKiosk() {
  const [, force] = React.useState(0);
  React.useEffect(() => {
    const unsub = kioskStore.subscribe(() => force((n) => n + 1));
    return () => {
      unsub();
    };
  }, []);
  return state;
}

export const STEPS = [
  { path: "/", label: "Welcome" },
  { path: "/language", label: "Language" },
  { path: "/sanitize", label: "Sanitize" },
  { path: "/identify", label: "Identify" },
  { path: "/verify", label: "Verify" },
  { path: "/insurance", label: "Insurance" },
  { path: "/screening", label: "Screening" },
  { path: "/symptoms", label: "Symptoms" },
  { path: "/payment", label: "Payment" },
  { path: "/receipt", label: "Receipt" },
  { path: "/complete", label: "Complete" },
  { path: "/feedback", label: "Feedback" },
] as const;

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: { welcome: "Welcome", waveToStart: "Wave to begin", continue: "Continue" },
  es: { welcome: "Bienvenido", waveToStart: "Saluda para comenzar", continue: "Continuar" },
  zh: { welcome: "欢迎", waveToStart: "挥手开始", continue: "继续" },
  ar: { welcome: "أهلاً وسهلاً", waveToStart: "لوّح للبدء", continue: "متابعة" },
  hi: { welcome: "स्वागत है", waveToStart: "शुरू करने के लिए हाथ हिलाएँ", continue: "जारी रखें" },
};
