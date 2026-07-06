/**
 * Slow-drifting aurora borealis made of three blurred gradient ribbons.
 * Pure CSS (transform/opacity only) — GPU friendly, respects reduced motion
 * via the global media query in globals.css.
 */
export default function Aurora() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Blur is baked into the radial gradients (no `filter: blur`) so each
          ribbon stays a cheap GPU-composited transform animation */}
      <div className="absolute -top-1/4 left-[-10%] h-[70vh] w-[80vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(94,234,212,0.13),rgba(94,234,212,0.05)_45%,transparent_70%)] will-change-transform animate-aurora-a" />
      <div className="absolute top-[5%] right-[-15%] h-[80vh] w-[70vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.12),rgba(167,139,250,0.05)_45%,transparent_70%)] will-change-transform animate-aurora-b" />
      <div className="absolute bottom-[-20%] left-[15%] h-[60vh] w-[75vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(125,211,252,0.09),rgba(125,211,252,0.04)_45%,transparent_70%)] will-change-transform animate-aurora-c" />
    </div>
  );
}
