import { useCursor } from "@/hooks/use-cursor";
import { useHandTracking } from "@/hooks/use-hand-tracking";

export function GestureCursor() {
  const cursor = useCursor();
  const hand = useHandTracking();

  if (!cursor.active) return null;

  const isHand = cursor.source === "hand";
  const pinching = isHand && hand.isPinching;

  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: cursor.x,
        top: cursor.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Outer glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150"
        style={{
          width: pinching ? 64 : 48,
          height: pinching ? 64 : 48,
          background: "radial-gradient(circle, oklch(0.78 0.18 145 / 40%) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
      {/* Core dot */}
      <div
        className="relative rounded-full border-2 transition-all duration-150"
        style={{
          width: pinching ? 18 : 14,
          height: pinching ? 18 : 14,
          background: "oklch(0.78 0.18 145)",
          borderColor: "oklch(0.98 0.003 247 / 90%)",
          boxShadow: "0 0 16px oklch(0.78 0.18 145 / 80%)",
        }}
      />
      {isHand && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            width: 36,
            height: 36,
            borderColor: "oklch(0.78 0.18 145 / 60%)",
            animation: "pulse-ring 1.6s ease-out infinite",
          }}
        />
      )}
    </div>
  );
}
