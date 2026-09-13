import * as React from "react";
import { motion } from "framer-motion";
import { useCursor } from "@/hooks/use-cursor";
import { useHandTracking } from "@/hooks/use-hand-tracking";
import { cn } from "@/lib/utils";
import { logResearchEvent } from "@/lib/research-telemetry";

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

function textFromChildren(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (React.isValidElement(child)) {
        return textFromChildren((child.props as { children?: React.ReactNode }).children);
      }
      return "";
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

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
  const [confirmed, setConfirmed] = React.useState(false);
  const pinchHandledRef = React.useRef(false);
  const previousHoveredRef = React.useRef(false);
  const telemetryLabel = textFromChildren(children);

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
    if (inside !== previousHoveredRef.current) {
      logResearchEvent(inside ? "hover_start" : "hover_end", {
        target: telemetryLabel || "unknown",
        input: "system",
      });
      previousHoveredRef.current = inside;
    }
  }, [cursor.x, cursor.y, cursor.active, disabled, telemetryLabel]);

  // Pinch instant-confirm shortcut
  React.useEffect(() => {
    if (!hovered || disabled || confirmed) {
      pinchHandledRef.current = false;
      return;
    }
    if (hand.isPinching && !pinchHandledRef.current) {
      pinchHandledRef.current = true;
      logResearchEvent("selection_success", {
        target: telemetryLabel || "unknown",
        input: "pinch",
      });
      setConfirmed(true);
      setTimeout(() => onConfirm(), 200);
    }
  }, [hand.isPinching, hovered, disabled, confirmed, onConfirm, telemetryLabel]);

  React.useEffect(() => {
    if (!hand.isPinching && confirmed) {
      setConfirmed(false);
      pinchHandledRef.current = false;
    }
  }, [hand.isPinching, confirmed]);

  // Dwell progression removed - user must pinch to select
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

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        logResearchEvent("selection_success", {
          target: telemetryLabel || "unknown",
          input: "click",
        });
        onConfirm();
      }}
      className={cn(
        "relative inline-flex items-center justify-center text-center overflow-hidden rounded-2xl border transition-colors duration-200",
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
      {/* Visual ring removed since we don't dwell to confirm anymore */}
      <div className={cn("relative z-10", isFilled && variant !== "primary" && "text-primary-foreground")}>
        {children}
      </div>

    </button>
  );
}
