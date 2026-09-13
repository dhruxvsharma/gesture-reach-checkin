import { useHandTracking } from "@/hooks/use-hand-tracking";
import { motion } from "framer-motion";
import * as React from "react";
import { logResearchEvent } from "@/lib/research-telemetry";

export function CameraGate() {
  const { permissionState, requestCamera } = useHandTracking();

  React.useEffect(() => {
    if (permissionState === "granted") logResearchEvent("camera_permission_granted", { input: "system" });
    if (permissionState === "denied") logResearchEvent("camera_permission_denied", { input: "system" });
  }, [permissionState]);

  React.useEffect(() => {
    if (permissionState === "granted") {
      document.body.classList.add("kiosk-camera-active");
    } else {
      document.body.classList.remove("kiosk-camera-active");
    }
  }, [permissionState]);

  if (permissionState === "granted") return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      <div className="surface-card max-w-lg rounded-3xl p-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </div>
        <h2 className="mb-3 text-3xl font-medium tracking-tight">Touchless check-in</h2>
        <p className="mb-8 text-muted-foreground">
          We use your camera to track hand gestures. No video is stored or sent anywhere — everything runs on this device.
        </p>
        <button
          onClick={() => {
            logResearchEvent("camera_permission_requested", { input: "system" });
            void requestCamera();
          }}
          disabled={permissionState === "requesting"}
          className="cursor-pointer rounded-xl bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)] transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {permissionState === "requesting" ? "Starting camera…" : "Enable camera"}
        </button>
        {permissionState === "denied" && (
          <>
            <p className="mt-6 text-sm text-destructive">
              Camera access denied. You can still use the kiosk with mouse hover for testing.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 cursor-pointer text-sm text-muted-foreground underline"
            >
              Continue with mouse
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
