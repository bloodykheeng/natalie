/**
 * Vintage gold flourish divider — echoes the ornamental corners
 * of Natalie's channel banner.
 */
export default function Ornament({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-4 text-gold-500 ${className}`}
    >
      <span className="h-px w-16 bg-linear-to-r from-transparent to-gold-500/70 sm:w-24" />
      <svg
        width="44"
        height="20"
        viewBox="0 0 44 20"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M22 3 C19 8, 14 10, 8 10 C14 10, 19 12, 22 17 C25 12, 30 10, 36 10 C30 10, 25 8, 22 3 Z"
          fill="currentColor"
          opacity="0.9"
        />
        <circle cx="3" cy="10" r="1.5" fill="currentColor" opacity="0.7" />
        <circle cx="41" cy="10" r="1.5" fill="currentColor" opacity="0.7" />
      </svg>
      <span className="h-px w-16 bg-linear-to-l from-transparent to-gold-500/70 sm:w-24" />
    </div>
  );
}
