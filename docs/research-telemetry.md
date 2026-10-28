# Gesture study telemetry

The kiosk records one anonymous in-memory session at a time. No camera frames,
hand landmarks, names, dates of birth, or other raw biometric data are exported.

## Study conditions

The kiosk opens on a study setup page where the operator can choose a condition.
For scripted runs or direct links, pass the condition in the preview URL:

- `?cue=animated` — looping animated gesture coach (the default)
- `?cue=static` — the same coach with motion disabled
- `?cue=none` — no coach or bottom gesture hint

You can optionally add a study participant label with `&participant=P014`.
Use a study code rather than a real name or medical identifier.

## Export

After the participant submits feedback on the final screen, download either:

- **CSV** for event-level analysis in a spreadsheet/statistics package.
- **JSON** for the complete event log plus per-screen summary metrics.

The JSON summary includes screen duration, time to first interaction, hesitation
to first selection, hover starts, pinch attempts, unsuccessful pinches, and
successful selections.

## Event vocabulary

`screen_enter` / `screen_exit`, `hover_start` / `hover_end`, `pinch_attempt`,
`selection_success`, camera permission events, `feedback_submitted`, and
`idle_reset` are recorded with an ISO timestamp, elapsed session time, route,
target label (when applicable), input source, and small numeric details.

Useful primary outcomes for the paper are completion time, hesitation to first
selection, unsuccessful pinch rate, successful selections per screen, and
abandonment/idle-reset rate. Keep condition, participant code, viewport, and
camera status as covariates when comparing animated, static, and no-cue groups.
