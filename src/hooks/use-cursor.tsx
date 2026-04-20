import * as React from "react";
import { useHandTracking } from "./use-hand-tracking";

interface CursorState {
  x: number; // px in viewport
  y: number; // px in viewport
  active: boolean;
  source: "hand" | "mouse";
}

const CursorCtx = React.createContext<CursorState>({
  x: 0,
  y: 0,
  active: false,
  source: "mouse",
});

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const hand = useHandTracking();
  const [mouse, setMouse] = React.useState({ x: 0, y: 0, active: false });

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY, active: true });
    };
    const onLeave = () => setMouse((s) => ({ ...s, active: false }));
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const value = React.useMemo<CursorState>(() => {
    if (hand.isDetected) {
      return {
        x: hand.x * window.innerWidth,
        y: hand.y * window.innerHeight,
        active: true,
        source: "hand",
      };
    }
    return { x: mouse.x, y: mouse.y, active: mouse.active, source: "mouse" };
  }, [hand.isDetected, hand.x, hand.y, mouse]);

  return <CursorCtx.Provider value={value}>{children}</CursorCtx.Provider>;
}

export function useCursor() {
  return React.useContext(CursorCtx);
}
