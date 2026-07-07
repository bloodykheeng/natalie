/**
 * Slow-drifting sky ribbons. At night they're a teal/violet aurora borealis;
 * at dawn (light theme) they become rosy peach clouds plus a rising sun glow.
 * Colors live in globals.css (--aur* variables) so they flip with the theme.
 * Transform-only animation — GPU friendly, respects reduced motion.
 */
export default function Aurora() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="aurora-ribbon-1 absolute -top-1/4 left-[-10%] h-[70vh] w-[80vw] rounded-full will-change-transform animate-aurora-a" />
      <div className="aurora-ribbon-2 absolute top-[5%] right-[-15%] h-[80vh] w-[70vw] rounded-full will-change-transform animate-aurora-b" />
      <div className="aurora-ribbon-3 absolute bottom-[-20%] left-[15%] h-[60vh] w-[75vw] rounded-full will-change-transform animate-aurora-c" />
      {/* Sunrise glow — visible only in the light theme */}
      <div className="dawn-sun absolute top-[8%] right-[12%] h-[45vh] w-[45vh] rounded-full will-change-transform animate-float" />
    </div>
  );
}
