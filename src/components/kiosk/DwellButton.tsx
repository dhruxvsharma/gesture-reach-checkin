import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "@/hooks/use-cursor";
import { useHandTracking } from "@/hooks/use-hand-tracking";
import { cn } from "@/lib/utils";

interface DwellButtonProps {
  onConfirm: () => void;
  children: React.ReactNode;
  className?: string;
  dwellMs?: number;
  disabled?: boolean;
  variant?: "default" | "primary" | "secondary" | "ghost" | "danger";
  showCountdown?: boolean;
}

const DWELL_DEFAULT = 1400;

export function DwellButton({
  onConfirm,
  children,
  className,
  dwellMs = DWELL_DEFAULT,
  disabled = false,
  variant = "default",
  showCountdown = false,
}: DwellButtonProps) {
  const cursor = useCursor();
  const hand = useHandTracking();
  const ref = React.useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [confirmed, setConfirmed] = React.useState(false);
  const startRef = React.useRef<number | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const pinchHandledRef = React.useRef(false);

  // Cursor-based hover detection
  React.useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const inside =
      cursor.active &&
      cursor.x >= r.left &&
      cursor.x <= r.right &&
      cursor.y >= r.top &&
      cursor.y <= r.bottom;
    setHovered(inside);
  }, [cursor.x, cursor.y, cursor.active, disabled]);

  // Pinch instant-confirm shortcut
  React.useEffect(() => {
    if (!hovered || disabled || confirmed) {
      pinchHandledRef.current = false;
      return;
    }
    if (hand.isPinching && !pinchHandledRef.current) {
      pinchHandledRef.current = true;
      setConfirmed(true);
      setTimeout(() => onConfirm(), 200);
    }
  }, [hand.isPinching, hovered, disabled, confirmed, onConfirm]);

  // Dwell progression
  React.useEffect(() => {
    if (disabled || confirmed) return;
    if (!hovered) {
      startRef.current = null;
      setProgress(0);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now();
    const tick = () => {
      if (startRef.current == null) return;
      const elapsed = performance.now() - startRef.current;
      const p = Math.min(1, elapsed / dwellMs);
      setProgress(p);
      if (p >= 1) {
        setConfirmed(true);
        setTimeout(() => {
          onConfirm();
        }, 250);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hovered, dwellMs, onConfirm, disabled, confirmed]);

  const variantClass = {
    default:
      "bg-white border-border text-foreground hover:border-primary",
    primary:
      "bg-primary border-primary text-primary-foreground",
    secondary:
      "bg-white border-border text-foreground hover:border-primary",
    ghost:
      "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted shadow-none",
    danger:
      "bg-white border-border text-destructive hover:border-destructive",
  }[variant];

  const isFilled = variant === "primary" || confirmed;
  const ringColor = "#0F766E";
  const remainingSecs = Math.max(0, Math.ceil((dwellMs * (1 - progress)) / 1000));

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onConfirm()}
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-colors duration-200",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/35",
        "disabled:opacity-50 cursor-pointer",
        variant !== "ghost" && "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]",
        variantClass,
        hovered && !confirmed && variant === "default" && "bg-[var(--hover-tint)] border-primary",
        hovered && !confirmed && variant === "secondary" && "bg-[var(--hover-tint)] border-primary",
        confirmed && variant !== "ghost" && "bg-primary border-primary text-primary-foreground",
        className,
      )}
      style={
        confirmed
          ? { transform: "scale(1.03)", transition: "transform 250ms ease-out, background-color 250ms" }
          : undefined
      }
    >
      {/* Dwell progress ring */}
      <AnimatePresence>
        {hovered && progress > 0 && !confirmed && (
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <rect
              x="2"
              y="2"
              width="96"
              height="96"
              rx="6"
              fill="none"
              stroke={ringColor}
              strokeWidth="3"
              strokeDasharray="384"
              strokeDashoffset={384 * (1 - progress)}
              style={{
                transition: "stroke-dashoffset 60ms linear",
                vectorEffect: "non-scaling-stroke",
              }}
              pathLength={384}
            />
          </motion.svg>
        )}
      </AnimatePresence>

      <div className={cn("relative z-10", isFilled && variant !== "primary" && "text-primary-foreground")}>
        {children}
      </div>

      {showCountdown && hovered && progress > 0 && progress < 1 && !confirmed && (
        <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold tabular-nums text-primary-foreground">
          {remainingSecs}s
        </div>
      )}
    </button>
  );
}
