import * as React from "react";
import {
  HandLandmarker,
  FilesetResolver,
  type HandLandmarkerResult,
} from "@mediapipe/tasks-vision";
import { logResearchEvent } from "@/lib/research-telemetry";

export interface HandState {
  x: number; // 0..1 normalized in viewport
  y: number; // 0..1 normalized in viewport
  isDetected: boolean;
  isPinching: boolean;
  permissionState: "idle" | "requesting" | "granted" | "denied";
  videoEl: HTMLVideoElement | null;
}

interface Ctx extends HandState {
  requestCamera: () => Promise<void>;
}

const HandCtx = React.createContext<Ctx | null>(null);

export function HandTrackingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<HandState>({
    x: 0.5,
    y: 0.5,
    isDetected: false,
    isPinching: false,
    permissionState: "idle",
    videoEl: null,
  });

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const landmarkerRef = React.useRef<HandLandmarker | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const smoothRef = React.useRef({ x: 0.5, y: 0.5 });
  const lastSeenRef = React.useRef(0);
  const pinchActiveRef = React.useRef(false);

  const requestCamera = React.useCallback(async () => {
    setState((s) => ({ ...s, permissionState: "requesting" }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      let video = videoRef.current;
      if (!video) {
        video = document.createElement("video");
        video.autoplay = true;
        video.playsInline = true;
        video.muted = true;
        video.style.position = "fixed";
        video.style.opacity = "0";
        video.style.pointerEvents = "none";
        video.style.width = "1px";
        video.style.height = "1px";
        document.body.appendChild(video);
        videoRef.current = video;
      }
      video.srcObject = stream;
      await video.play();

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
      );
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });
      landmarkerRef.current = landmarker;

      setState((s) => ({ ...s, permissionState: "granted", videoEl: video! }));
      loop();
    } catch (err) {
      console.error("[hand-tracking] camera denied or model failed", err);
      setState((s) => ({ ...s, permissionState: "denied" }));
    }
  }, []);

  const loop = React.useCallback(() => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !landmarker) return;

    const tick = () => {
      if (video.readyState >= 2) {
        const now = performance.now();
        let result: HandLandmarkerResult | null = null;
        try {
          result = landmarker.detectForVideo(video, now);
        } catch {
          /* ignore */
        }
        if (result && result.landmarks && result.landmarks.length > 0) {
          const lm = result.landmarks[0];
          // Index fingertip = landmark 8
          const tip = lm[8];
          const thumbTip = lm[4];
          // Mirror X (selfie view)
          const rawX = 1 - tip.x;
          const rawY = tip.y;
          // Smooth
          smoothRef.current.x = smoothRef.current.x * 0.65 + rawX * 0.35;
          smoothRef.current.y = smoothRef.current.y * 0.65 + rawY * 0.35;

          // Pinch detection: distance between thumb and index tip
          const dx = thumbTip.x - tip.x;
          const dy = thumbTip.y - tip.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const isPinching = dist < 0.05;

          if (isPinching && !pinchActiveRef.current) {
            const target = document
              .elementFromPoint(smoothRef.current.x * window.innerWidth, smoothRef.current.y * window.innerHeight)
              ?.closest("button");
            logResearchEvent("pinch_attempt", {
              target: target?.textContent?.replace(/\s+/g, " ").trim() || undefined,
              input: "pinch",
              details: {
                normalizedX: Number(smoothRef.current.x.toFixed(3)),
                normalizedY: Number(smoothRef.current.y.toFixed(3)),
              },
            });
          }
          pinchActiveRef.current = isPinching;

          lastSeenRef.current = now;
          setState((s) => ({
            ...s,
            x: smoothRef.current.x,
            y: smoothRef.current.y,
            isDetected: true,
            isPinching,
          }));
        } else if (now - lastSeenRef.current > 400) {
          pinchActiveRef.current = false;
          setState((s) => (s.isDetected ? { ...s, isDetected: false, isPinching: false } : s));
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  React.useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const v = videoRef.current;
      if (v && v.srcObject) {
        (v.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
      landmarkerRef.current?.close();
      pinchActiveRef.current = false;
    };
  }, []);

  return (
    <HandCtx.Provider value={{ ...state, requestCamera }}>{children}</HandCtx.Provider>
  );
}

export function useHandTracking() {
  const ctx = React.useContext(HandCtx);
  if (!ctx) throw new Error("useHandTracking must be inside HandTrackingProvider");
  return ctx;
}
