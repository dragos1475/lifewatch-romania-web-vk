/** Contour-line mark in the LifeWatch colours: navy tile, green terrain line, orange sun. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <rect width="28" height="28" rx="7" fill="#254380" />
      <rect x="0.5" y="0.5" width="27" height="27" rx="6.5" fill="none" className="stroke-white/0 dark:stroke-white/15" />
      <path d="M5 19.5c2.4-5.4 5.2-8.2 9-8.2s6.4 2.2 9 6.4" fill="none" stroke="#5db46b" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.5 21.5c1.8-3.2 3.6-4.8 5.5-4.8s3.6 1.4 5.5 4" fill="none" stroke="#4aa4a6" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14" cy="11.3" r="2.2" fill="#d55a2b" />
    </svg>
  );
}
