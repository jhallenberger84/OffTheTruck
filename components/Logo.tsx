export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="7" fill="#ff6a13" />
      <path d="M5 11h13v10H5z" fill="#121416" />
      <path d="M18 14h5l4 4.2V21h-9z" fill="#121416" />
      <circle cx="10" cy="22.5" r="2.6" fill="#121416" stroke="#ff6a13" strokeWidth="1.4" />
      <circle cx="22.5" cy="22.5" r="2.6" fill="#121416" stroke="#ff6a13" strokeWidth="1.4" />
      <path d="M2 7.5 30 7.5" stroke="#121416" strokeWidth="2" strokeDasharray="3 2.2" />
      <path d="M7 16.5h4M13 16.5h2" stroke="#ff6a13" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
