# SmartCare Touchless Patient Check-In

A modern, contactless, gesture-driven kiosk interface designed for hospital reception and patient self-check-in. Built for hygienic, zero-touch operation using computer vision hand tracking, intuitive dwell selection, and rich visual affordances.

---

## Features

- **Touchless Hand Interaction**: Real-time webcam hand tracking powered by `@mediapipe/tasks-vision` (detecting palm position, pointer coordinates, and pinch gesture detection).
- **Dwell & Pinch Activation**: Magnetic target snapping, customizable dwell timers, and pinch-to-select support.
- **Kiosk Check-In Flow**:
  1. **Condition Chooser**: Experimental study condition selection (Animated cues, Static cues, Baseline).
  2. **Welcome Screen**: Clean reception welcome with touchless activation.
  3. **Language Selection**: Multilingual support (English, Spanish, Chinese, Arabic, Hindi).
  4. **Sanitize Prompt**: Hygeine reminder and compliance check.
  5. **Patient Identification**: Birthday, MRN, or card verification.
  6. **Symptom Screening**: Contactless questionnaire for COVID/flu symptoms.
  7. **Insurance & Payment**: Copay review and receipt preference (SMS, email, print).
  8. **Feedback & Departure**: Session wrap-up and quick rating.
- **Research Telemetry & Analytics**: Tracks dwell time, hover duration, pinch accuracy, and completion times across different visual cue modalities for HCI study analysis.
- **Accessible & Responsive**: High-contrast, large-target kiosk layout with sound/visual feedback.

---

## Directory Structure

```text
gesture-reach-checkin/
├── docs/                     # Documentation and research specifications
│   ├── migration.md          # Migration and stack upgrade log
│   └── research-telemetry.md # Telemetry event schema and research protocol
├── public/                   # Static public assets (icons, models)
├── scripts/                  # Utility and codemod scripts
│   ├── make-h1-bold.mjs
│   └── remove-serif.mjs
├── src/
│   ├── assets/               # Bundled assets (images, svg)
│   ├── components/           # React components
│   │   ├── kiosk/            # Domain components (CameraGate, DwellButton, GestureCoach, KioskShell)
│   │   └── ui/               # Core atomic UI primitives (Radix UI / Tailwind)
│   ├── config/               # Application & gesture configuration constants
│   ├── hooks/                # Custom React hooks (useHandTracking, useCursor, useMobile)
│   ├── lib/                  # Stores, telemetry logger, and utilities
│   ├── routes/               # TanStack Router file-based pages
│   ├── types/                # Shared TypeScript types
│   ├── router.tsx            # Router configuration and hydration setup
│   ├── routeTree.gen.ts      # Generated route tree
│   └── styles.css            # Global CSS styles
├── tests/                    # Unit and integration test suites
├── .editorconfig             # Editor whitespace & encoding standards
├── .env.example              # Template environment variables
├── .gitignore                # Git ignored patterns
├── .nvmrc                    # Node.js LTS version pin
├── .prettierrc               # Prettier code formatting rules
├── eslint.config.js          # ESLint configuration
├── package.json              # Project dependencies and npm scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite bundler configuration
└── wrangler.jsonc            # Cloudflare deployment config
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or `v22.x+` (see `.nvmrc`)
- **Webcam**: Standard USB or built-in webcam for hand tracking
- **Modern Browser**: Chrome, Edge, Safari, or Firefox with WebGL and Camera permission support

### Installation

```bash
# Clone the repository
git clone https://github.com/dhruxvsharma/gesture-reach-checkin.git
cd gesture-reach-checkin

# Install dependencies
npm install
```

### Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

### Running Locally

```bash
# Start Vite development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Allow camera access when prompted by the kiosk permission banner.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local dev server at `http://localhost:3000` |
| `npm run build` | Builds production bundle |
| `npm run preview` | Previews production build locally |
| `npm run lint` | Runs ESLint analysis across TypeScript code |
| `npm run format` | Runs Prettier across all source files |
| `npm test` | Runs test suite |

---

## Gestures & User Controls

- **Hover / Dwell**: Move your hand to move the on-screen cursor over any card or button. An expanding ring fills over 1.2 seconds to confirm the selection.
- **Pinch**: Rapidly pinch thumb and index finger together to immediately activate the item without waiting for the dwell timer.
- **Fallback Mouse/Touch**: The kiosk automatically responds to standard mouse clicks and touch events if camera is unavailable or tracking is paused.

---

## Deployment

The application is configured for deployment with Cloudflare Workers / Pages via Wrangler:

```bash
npx wrangler deploy
```

---

## License

This project is licensed under the [MIT License](LICENSE).
