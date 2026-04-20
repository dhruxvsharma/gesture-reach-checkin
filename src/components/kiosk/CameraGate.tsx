import { useHandTracking } from "@/hooks/use-hand-tracking";
import { motion } from "framer-motion";

export function CameraGate() {
  const { permissionState, requestCamera } = useHandTracking();

  if (permissionState === "granted") return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/95 backdrop-blur-xl"
    >
      <div className="glass-strong max-w-lg rounded-3xl p-12 text-center shadow-card">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </div>
        <h2 className="mb-3 text-3xl font-semibold tracking-tight">Touchless check-in</h2>
        <p className="mb-8 text-muted-foreground">
          We use your camera to track hand gestures. No video is stored or sent anywhere — everything runs on this device.
        </p>
        <button
          onClick={requestCamera}
          disabled={permissionState === "requesting"}
          style={{ background: "var(--gradient-primary)" }}
          className="rounded-xl px-8 py-4 text-lg font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105 disabled:opacity-60"
        >
          {permissionState === "requesting" ? "Starting camera…" : "Enable camera"}
        </button>
        {permissionState === "denied" && (
          <p className="mt-6 text-sm text-destructive">
            Camera access denied. You can still use the kiosk with mouse hover for testing.
          </p>
        )}
        {permissionState === "denied" && (
          <button
            onClick={() => {
              // Force-grant fallback: still let cursor work via mouse
              window.location.reload();
            }}
            className="mt-2 text-sm text-muted-foreground underline"
          >
            Continue with mouse
          </button>
        )}
      </div>
    </motion.div>
  );
}
