import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "@/hooks/use-cursor";
import { cn } from "@/lib/utils";

interface DwellButtonProps {
  onConfirm: () => void;
  children: React.ReactNode;
  className?: string;
  dwellMs?: number;
  disabled?: boolean;
  variant?: "default" | "ghost" | "danger" | "success";
}

const DWELL_DEFAULT = 1400;

export function DwellButton({
  onConfirm,
  children,
  className,
  dwellMs = DWELL_DEFAULT,
  disabled = false,
  variant = "default",
}: DwellButtonProps) {
  const cursor = useCursor();
  const ref = React.useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [confirmed, setConfirmed] = React.useState(false);
  const startRef = React.useRef<number | null>(null);
  const rafRef = React.useRef<number | null>(null);

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
        }, 280);
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
    default: "glass-strong text-foreground hover:border-primary/50",
    ghost: "glass text-foreground/80 hover:border-primary/30",
    danger: "glass-strong text-destructive border-destructive/30",
    success:
      "text-primary-foreground border-primary/60 shadow-glow",
  }[variant];

  const variantStyle =
    variant === "success"
      ? { background: "var(--gradient-primary)" }
      : undefined;

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onConfirm()}
      style={variantStyle}
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-all duration-300",
        "focus:outline-none disabled:opacity-50",
        variantClass,
        hovered && !confirmed && "scale-[1.02] border-primary/70",
        confirmed && "scale-[1.06]",
        className,
      )}
    >
      {/* Dwell progress ring (SVG) */}
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
              x="1"
              y="1"
              width="98"
              height="98"
              fill="none"
              stroke="oklch(0.78 0.18 145)"
              strokeWidth="2"
              strokeDasharray="392"
              strokeDashoffset={392 * (1 - progress)}
              style={{
                transition: "stroke-dashoffset 60ms linear",
                filter: "drop-shadow(0 0 8px oklch(0.78 0.18 145 / 80%))",
                vectorEffect: "non-scaling-stroke",
              }}
              pathLength={392}
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Confirm pulse */}
      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: "oklch(0.78 0.18 145 / 40%)",
              boxShadow: "0 0 80px oklch(0.78 0.18 145 / 80%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Hover glow */}
      {hovered && !confirmed && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, oklch(0.78 0.18 145 / 12%) 0%, transparent 70%)",
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </button>
  );
}
