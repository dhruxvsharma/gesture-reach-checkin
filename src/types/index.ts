/**
 * Core TypeScript type definitions for Contactless Gesture Interface (SmartCare)
 */

export type Language = "en" | "es" | "zh" | "ar" | "hi";

export type CueVariant = "animated" | "static" | "none" | "unknown";

export type PaymentChoice = "now" | "later" | "insurance";

export type ReceiptChoice = "email" | "sms" | "print";

export type FeedbackChoice = "up" | "down";

export interface ScreeningFlags {
  fever: boolean;
  symptoms: boolean;
  exposure: boolean;
}

export interface KioskState {
  cueVariant: Exclude<CueVariant, "unknown"> | null;
  language: Language;
  screeningFlags: ScreeningFlags;
  selectedSymptoms: string[];
  paymentChoice: PaymentChoice | null;
  receiptChoice: ReceiptChoice | null;
  feedback: FeedbackChoice | null;
}

export type ResearchEventType =
  | "session_started"
  | "condition_selected"
  | "screen_enter"
  | "screen_exit"
  | "hover_start"
  | "hover_end"
  | "pinch_attempt"
  | "selection_success"
  | "camera_permission_requested"
  | "camera_permission_granted"
  | "camera_permission_denied"
  | "feedback_submitted"
  | "idle_reset";

export interface ResearchEvent {
  eventId: string;
  type: ResearchEventType;
  timestamp: string;
  elapsedMs: number;
  path: string;
  target?: string;
  input?: "pinch" | "click" | "system";
  details?: Record<string, string | number | boolean | null>;
}

export interface ResearchSession {
  schemaVersion: "1.0";
  sessionId: string;
  participantId: string;
  condition: CueVariant;
  startedAt: string;
  viewport: { width: number; height: number; devicePixelRatio: number };
  events: ResearchEvent[];
}

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface HandCursorState {
  x: number;
  y: number;
  isPinching: boolean;
  isTracking: boolean;
  confidence: number;
}
