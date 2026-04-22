import { useCursor } from "@/hooks/use-cursor";
import { useHandTracking } from "@/hooks/use-hand-tracking";

export function GestureCursor() {
  const cursor = useCursor();
  const hand = useHandTracking();

  if (!cursor.active) return null;

  const isHand = cursor.source === "hand";
  const pinching = isHand && hand.isPinching;
  const size = pinching ? 28 : 22;

  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: cursor.x,
        top: cursor.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className="rounded-full transition-all duration-150"
        style={{
          width: size,
          height: size,
          background: "#0F766E",
          border: "2px solid #FFFFFF",
          boxShadow: "0 1px 3px rgba(15,23,42,0.25), 0 0 0 1px rgba(15,23,42,0.08)",
        }}
      />
    </div>
  );
}
