import * as React from "react";
import { useLocation, useNavigate, Outlet } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { HandTrackingProvider, useHandTracking } from "@/hooks/use-hand-tracking";
import { CursorProvider } from "@/hooks/use-cursor";
import { GestureCursor } from "./GestureCursor";
import { GestureCoach } from "./GestureCoach";
import { CameraGate } from "./CameraGate";
import { STEPS, kioskStore, useKiosk } from "@/lib/kiosk-store";
import { getRequestedCueVariant, logResearchEvent, trackScreen, useCueVariant, useHydrated } from "@/lib/research-telemetry";

const IDLE_MS = 90_000;

function StatusBar() {
  const location = useLocation();
  const hand = useHandTracking();
  const stepIdx = STEPS.findIndex((s) => s.path === location.pathname);
  const current = stepIdx >= 0 ? stepIdx : 0;
  const total = STEPS.length;
  const currentStep = STEPS[current];
  const progressPct = (current / (total - 1)) * 100;

  return (
    <div className="fixed left-0 right-0 top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex w-full items-center justify-between gap-4 px-6 py-3 lg:gap-6 lg:px-10 lg:py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-foreground">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-foreground">SmartCare</div>
            <div className="hidden text-[11px] text-muted-foreground sm:block">Patient Check-in</div>
          </div>
        </div>

        {stepIdx > 0 && (
          <div className="hidden flex-1 items-center justify-center gap-3 sm:flex lg:gap-4">
            <div className="text-xs font-medium text-foreground lg:text-sm">
              Step {current} of {total - 1} · <span className="text-muted-foreground">{currentStep?.label}</span>
            </div>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted lg:w-48">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5">
          <div
            className="h-2 w-2 rounded-full transition-colors"
            style={{
              background: hand.isDetected ? "#0F766E" : "#94A3B8",
            }}
          />
          <span className="text-xs font-medium text-muted-foreground">
            {hand.permissionState !== "granted"
              ? "Camera off"
              : hand.isDetected
                ? "Camera ready"
                : "Show your hand"}
          </span>
        </div>
      </div>
    </div>
  );
}

function HintBar() {
  const location = useLocation();
  const kiosk = useKiosk();
  const hand = useHandTracking();
  const hydrated = useHydrated();
  const cueVariant = useCueVariant(kiosk.cueVariant);
  const isWelcome = location.pathname === "/";
  const isSanitizing = location.pathname === "/sanitize";
  const isSetup = isWelcome && !kiosk.cueVariant && !getRequestedCueVariant();
  if (!hydrated || cueVariant === "none" || isSetup) return null;
  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center px-4 pb-4 sm:px-10 sm:pb-6">
      <div className="max-w-[min(34rem,calc(100vw-2rem))] rounded-xl border border-border bg-white/90 px-4 py-2.5 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur sm:px-5">
        <div className="text-sm font-medium text-foreground">
          {isWelcome
            ? hand.isDetected
              ? "Hold steady to begin"
              : "Show your hand to the camera"
            : isSanitizing
              ? "Sanitizing in progress"
              : hand.isDetected
                ? "Hand detected · follow the guide"
                : "Show your hand to the camera"}
        </div>
        {!isSanitizing && !isWelcome && (
          <div className="text-xs text-muted-foreground">Follow the gesture guide at lower left</div>
        )}
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
            ctx.fillStyle = "#0F766E";
            ctx.fill();
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 2;
            ctx.stroke();
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
    <div className="pointer-events-none fixed bottom-6 right-6 z-40">
      <div className="overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
        <canvas ref={canvasRef} width={140} height={100} className="block rounded-md" />
        <div className="px-1 pt-1 pb-0.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          You
        </div>
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
        logResearchEvent("idle_reset", { input: "system" });
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

  React.useEffect(() => {
    trackScreen(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <CameraGate />
      <StatusBar />
      <CameraThumb />
      <HintBar />
      <GestureCoach />
      <IdleReset />
      <GestureCursor />

      <main className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-background pt-20 pb-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
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
