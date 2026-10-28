/**
 * Global application constants and configuration
 */

import type { Language, CueVariant } from "../types";

export const APP_CONFIG = {
  name: "SmartCare Touchless Kiosk",
  description: "Contactless gesture-based hospital check-in interface",
  version: "1.0.0",
} as const;

export const GESTURE_CONFIG = {
  /** Pinch distance threshold for trigger */
  pinchThreshold: 0.05,
  /** Dwell progress timer in ms */
  defaultDwellTimeMs: 1200,
  /** Tracking confidence minimum */
  minDetectionConfidence: 0.65,
  minTrackingConfidence: 0.65,
  /** Idle timeout to reset kiosk (ms) */
  idleTimeoutMs: 60000,
} as const;

export const SUPPORTED_LANGUAGES: Array<{ code: Language; label: string; nativeLabel: string }> = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "zh", label: "Chinese", nativeLabel: "中文" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
];

export const CUE_VARIANTS: Array<{ id: Exclude<CueVariant, "unknown">; title: string; description: string }> = [
  {
    id: "animated",
    title: "Animated Micro-Interactions",
    description: "Dynamic pulsing rings, magnetic pull, and progress ripples.",
  },
  {
    id: "static",
    title: "Static Visual Cues",
    description: "Standard visual borders and highlight frames without continuous motion.",
  },
  {
    id: "none",
    title: "Control (Baseline)",
    description: "Standard cursor tracking with minimal affordance hints.",
  },
];
