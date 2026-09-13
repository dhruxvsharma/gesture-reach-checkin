import * as React from "react";

export type CueVariant = "animated" | "static" | "none" | "unknown";

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

interface ResearchSession {
  schemaVersion: "1.0";
  sessionId: string;
  participantId: string;
  condition: CueVariant;
  startedAt: string;
  viewport: { width: number; height: number; devicePixelRatio: number };
  events: ResearchEvent[];
}

type ResearchEventValues = Omit<
  ResearchEvent,
  "eventId" | "type" | "timestamp" | "elapsedMs" | "path"
> & { path?: string };

let session: ResearchSession | null = null;
let screenPath: string | null = null;
let screenEnteredAt = 0;
let selectedCueVariant: CueVariant | null = null;

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getRequestedCueVariant(): Exclude<CueVariant, "unknown"> | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("cue")?.toLowerCase();
  return value === "animated" || value === "static" || value === "none" ? value : null;
}

export function getCueVariant(): CueVariant {
  return selectedCueVariant ?? getRequestedCueVariant() ?? "animated";
}

export function setCueVariant(variant: Exclude<CueVariant, "unknown">) {
  selectedCueVariant = variant;
  if (session) {
    session.condition = variant;
    appendEvent("condition_selected", { input: "system", details: { condition: variant } });
  }
}

export function useCueVariant(selectedVariant?: CueVariant | null) {
  const [variant, setVariant] = React.useState<CueVariant>("animated");
  React.useEffect(() => {
    setVariant(selectedVariant ?? getCueVariant());
  }, [selectedVariant]);
  return variant;
}

export function useHydrated() {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  return hydrated;
}

function getParticipantId() {
  if (typeof window === "undefined") return "anonymous";
  return new URLSearchParams(window.location.search).get("participant")?.trim() || "anonymous";
}

function getSession() {
  if (session || typeof window === "undefined") return session;
  const startedAt = new Date().toISOString();
  session = {
    schemaVersion: "1.0",
    sessionId: makeId("session"),
    participantId: getParticipantId(),
    condition: getCueVariant(),
    startedAt,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
    },
    events: [],
  };
  appendEvent("session_started", { input: "system" });
  return session;
}

function appendEvent(
  type: ResearchEventType,
  values: ResearchEventValues = {},
) {
  const current = session;
  if (!current || typeof window === "undefined") return;
  const now = Date.now();
  const { path: eventPath, ...eventValues } = values;
  current.events.push({
    eventId: makeId("event"),
    type,
    timestamp: new Date(now).toISOString(),
    elapsedMs: now - new Date(current.startedAt).getTime(),
    path: eventPath ?? window.location.pathname,
    ...eventValues,
  });
}

export function logResearchEvent(
  type: ResearchEventType,
  values: ResearchEventValues = {},
) {
  getSession();
  appendEvent(type, values);
}

export function trackScreen(path: string) {
  const current = getSession();
  if (!current || screenPath === path) return;
  if (screenPath) {
    logResearchEvent("screen_exit", {
      input: "system",
      path: screenPath,
      details: { durationMs: Date.now() - screenEnteredAt },
    });
  }
  screenPath = path;
  screenEnteredAt = Date.now();
  logResearchEvent("screen_enter", { input: "system" });
}

function buildScreenSummary(events: ResearchEvent[]) {
  const paths = [...new Set(events.filter((event) => event.type === "screen_enter").map((event) => event.path))];
  return paths.map((path) => {
    const screenEvents = events.filter((event) => event.path === path);
    const entered = screenEvents.find((event) => event.type === "screen_enter");
    const firstInteraction = screenEvents.find((event) =>
      event.type === "hover_start" || event.type === "pinch_attempt" || event.type === "selection_success",
    );
    const firstSelection = screenEvents.find((event) => event.type === "selection_success");
    const exit = screenEvents.find((event) => event.type === "screen_exit");
    const screenDuration = Number(exit?.details?.durationMs ?? 0);
    return {
      path,
      durationMs: screenDuration,
      timeToFirstInteractionMs:
        entered && firstInteraction ? firstInteraction.elapsedMs - entered.elapsedMs : null,
      hesitationToFirstSelectionMs:
        entered && firstSelection ? firstSelection.elapsedMs - entered.elapsedMs : null,
      hoverStarts: screenEvents.filter((event) => event.type === "hover_start").length,
      pinchAttempts: screenEvents.filter((event) => event.type === "pinch_attempt").length,
      unsuccessfulPinches: screenEvents.filter(
        (event) => event.type === "pinch_attempt" && !event.target,
      ).length,
      successfulSelections: screenEvents.filter((event) => event.type === "selection_success").length,
    };
  });
}

export function getResearchSnapshot() {
  const current = getSession();
  if (!current) return null;
  if (screenPath) {
    const lastExit = [...current.events].reverse().find(
      (event: ResearchEvent) => event.type === "screen_exit" && event.path === screenPath,
    );
    if (!lastExit) {
      const durationMs = Date.now() - screenEnteredAt;
      return {
        ...current,
        completedAt: new Date().toISOString(),
        summary: { screens: buildScreenSummary(current.events), finalScreenDurationMs: durationMs },
      };
    }
  }
  return {
    ...current,
    completedAt: new Date().toISOString(),
    summary: { screens: buildScreenSummary(current.events), finalScreenDurationMs: 0 },
  };
}

function downloadFile(filename: string, content: string, mimeType: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value: unknown) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function downloadResearchData(format: "json" | "csv") {
  const snapshot = getResearchSnapshot();
  if (!snapshot) return;
  const stamp = snapshot.sessionId.replace(/[^a-z0-9_-]/gi, "_");
  if (format === "json") {
    downloadFile(`gesture-study-${stamp}.json`, JSON.stringify(snapshot, null, 2), "application/json");
    return;
  }
  const rows = [
    ["sessionId", "participantId", "condition", "eventId", "eventType", "timestamp", "elapsedMs", "path", "target", "input", "details"],
    ...snapshot.events.map((event) => [
      snapshot.sessionId,
      snapshot.participantId,
      snapshot.condition,
      event.eventId,
      event.type,
      event.timestamp,
      event.elapsedMs,
      event.path,
      event.target ?? "",
      event.input ?? "",
      event.details ?? "",
    ]),
  ];
  downloadFile(
    `gesture-study-${stamp}.csv`,
    rows.map((row) => row.map(csvCell).join(",")).join("\n"),
    "text/csv;charset=utf-8",
  );
}

export function resetResearchSession() {
  session = null;
  screenPath = null;
  screenEnteredAt = 0;
  selectedCueVariant = null;
}
