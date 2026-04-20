import * as React from "react";
import { useLocation, useNavigate, Outlet } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { HandTrackingProvider, useHandTracking } from "@/hooks/use-hand-tracking";
import { CursorProvider } from "@/hooks/use-cursor";
import { GestureCursor } from "./GestureCursor";
import { CameraGate } from "./CameraGate";
import { STEPS, kioskStore } from "@/lib/kiosk-store";

const IDLE_MS = 90_000;

function StatusBar() {
  const location = useLocation();
  const hand = useHandTracking();
  const stepIdx = STEPS.findIndex((s) => s.path === location.pathname);
  const current = stepIdx >= 0 ? stepIdx : 0;

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-10 py-6">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: "var(--gradient-primary)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-foreground">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">SmartCare</div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Kiosk · Touchless check-in
          </div>
        </div>
      </div>

      {stepIdx > 0 && (
        <div className="glass flex items-center gap-2 rounded-full px-5 py-2">
          {STEPS.slice(1).map((s, i) => (
            <div
              key={s.path}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i + 1 === current ? 32 : 12,
                background:
                  i + 1 <= current
                    ? "var(--gradient-primary)"
                    : "oklch(1 0 0 / 15%)",
              }}
            />
          ))}
        </div>
      )}

      <div className="glass flex items-center gap-2 rounded-full px-4 py-2">
        <div
          className="h-2 w-2 rounded-full transition-colors"
          style={{
            background: hand.isDetected
              ? "oklch(0.78 0.18 145)"
              : "oklch(0.6 0.02 270)",
            boxShadow: hand.isDetected ? "0 0 8px oklch(0.78 0.18 145)" : undefined,
          }}
        />
        <span className="text-xs text-muted-foreground">
          {hand.permissionState !== "granted"
            ? "Camera off"
            : hand.isDetected
              ? "Hand detected"
              : "Show your hand"}
        </span>
      </div>
    </div>
  );
}

function HintBar() {
  const hand = useHandTracking();
  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center px-10 py-6">
      <div className="glass flex items-center gap-3 rounded-full px-6 py-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <span className="text-xs text-muted-foreground">
          {hand.isDetected
            ? "Point with your index finger · Hold over an option for 1.5s to confirm"
            : "Hover or use your hand · Hold over an option to confirm"}
        </span>
      </div>
    </div>
  );
}

function CameraThumb() {
  const hand = useHandTracking();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!hand.videoEl) return;
    let raf = 0;
    const draw = () => {
      const c = canvasRef.current;
      const v = hand.videoEl;
      if (c && v && v.readyState >= 2) {
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(v, -c.width, 0, c.width, c.height);
          ctx.restore();
          if (hand.isDetected) {
            ctx.beginPath();
            ctx.arc(hand.x * c.width, hand.y * c.height, 6, 0, Math.PI * 2);
            ctx.fillStyle = "oklch(0.78 0.18 145)";
            ctx.fill();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [hand.videoEl, hand.isDetected, hand.x, hand.y]);

  if (!hand.videoEl) return null;
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50">
      <div className="glass overflow-hidden rounded-xl p-1">
        <canvas ref={canvasRef} width={120} height={90} className="rounded-lg" />
      </div>
    </div>
  );
}

function IdleReset() {
  const hand = useHandTracking();
  const navigate = useNavigate();
  const location = useLocation();
  const lastActivityRef = React.useRef(Date.now());

  React.useEffect(() => {
    lastActivityRef.current = Date.now();
  }, [location.pathname]);

  React.useEffect(() => {
    if (hand.isDetected) lastActivityRef.current = Date.now();
  }, [hand.isDetected, hand.x, hand.y]);

  React.useEffect(() => {
    const handler = () => {
      lastActivityRef.current = Date.now();
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > IDLE_MS && location.pathname !== "/") {
        kioskStore.reset();
        navigate({ to: "/" });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [navigate, location.pathname]);

  return null;
}

function ShellInner() {
  const location = useLocation();
  return (
    <>
      <CameraGate />
      <StatusBar />
      <CameraThumb />
      <HintBar />
      <IdleReset />
      <GestureCursor />

      <main className="h-screen w-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Ambient background gradients */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, oklch(0.78 0.18 145 / 8%) 0%, transparent 50%), radial-gradient(ellipse at 80% 90%, oklch(0.5 0.18 220 / 6%) 0%, transparent 50%)",
        }}
      />
    </>
  );
}

export function KioskShell() {
  return (
    <HandTrackingProvider>
      <CursorProvider>
        <ShellInner />
      </CursorProvider>
    </HandTrackingProvider>
  );
}
