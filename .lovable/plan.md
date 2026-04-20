
# Contactless Patient Check-In Kiosk — Touchless Build

A real hand-tracking kiosk experience for hospital patient check-in. Webcam-driven, dwell-to-select interactions, refined dark glassmorphic aesthetic, and the full patient journey.

## Tech approach
- **Hand tracking**: MediaPipe Hands (via `@mediapipe/tasks-vision`) running in the browser. Tracks index fingertip → maps to a virtual cursor on screen.
- **Selection model**: Hover any interactive element for ~1.4s → circular dwell-progress ring fills around it → confirm. No clicks anywhere.
- **Confirmation feedback**: Dwell ring fills with the green accent → on completion the element pulses outward (scale + glow), screen briefly tints green, soft transition to next screen.
- **Voice fallback**: Lightweight optional voice prompts ("Yes" / "No" / "Next") for confirmation steps — not required.
- **Camera permission gate**: First load asks for camera; falls back to mouse-hover dwell for demo/testing if denied.

## Visual direction (refined Figma)
- Dark base `#1E1E1E`, layered glass cards with subtle gradient borders.
- Green accent (`#22C55E` family) for active/confirm states.
- Bigger type, generous spacing — sized for a real 1080p+ kiosk display (uses full viewport, not a phone frame).
- Smooth scene transitions (fade + slight scale).
- Persistent top status bar: SmartCare logo · current step · live "hand detected" indicator.
- Persistent bottom hint: "Hover to select · Hold for 1.5s to confirm" + tiny live thumbnail of detected hand position.

## Full patient journey (routes)

1. **Welcome / Wave to begin** (`/`) — Animated gesture prompt, big "Wave to start" with live hand detection lighting up when seen.
2. **Language select** (`/language`) — English / Español / 中文 / العربية / हिन्दी, hover-to-select tiles.
3. **Sanitization reminder** (`/sanitize`) — Brief "Please sanitize hands" with a 5s auto-advance + dwell-to-skip.
4. **Patient identification** (`/identify`) — Voice ID / QR Code / Insurance Card. Choose identification method.
5. **Verify appointment** (`/verify`) — Show patient + appointment card. Confirm / Not me.
6. **Insurance verification** (`/insurance`) — Show insurance on file, confirm or update.
7. **Health screening** (`/screening`) — 3-question flow (fever, symptoms, exposure), each Yes/No with dwell-select.
8. **Symptom checker** (`/symptoms`) — If anything flagged in screening, multi-select symptom grid.
9. **Copay / Payment** (`/payment`) — Show amount due, Pay now / Pay later / Bill insurance options.
10. **Receipt delivery** (`/receipt`) — Email / SMS / Print, hover to select.
11. **Check-in complete** (`/complete`) — Queue number, wait time, building/floor directions, "Thank you".
12. **Feedback** (`/feedback`) — Quick thumbs up/down on the experience, dwell-confirm, then auto-reset to `/`.

Idle timeout (90s of no hand detected) on any screen → returns to `/`.

## Reusable interaction primitives
- `<DwellButton>` — wraps any option; accepts hover state from the gesture cursor or mouse, shows the SVG progress ring, fires `onConfirm` after dwell duration, plays the pulse animation.
- `<GestureCursor>` — fixed-position floating dot that follows the tracked fingertip, with a soft trailing glow.
- `<KioskShell>` — top status bar + bottom hint + idle-timeout reset, used by every route.
- `useHandTracking()` hook — owns the MediaPipe loop, exposes `{ x, y, isDetected, gesture }`.
- `useDwell(targetId)` hook — tracks how long the cursor has been over a target, returns 0–1 progress.

## Out of scope (for this pass)
- Real backend / database — all patient data is mocked.
- Actual payment processing — UI only.
- Printer/email/SMS integration — confirmation screens only.

After approval I'll wire up MediaPipe, build the shared kiosk shell + dwell primitives, then implement all 12 routes with the refined visual system.
