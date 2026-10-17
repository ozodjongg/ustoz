export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="logoMark">
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <g stroke="var(--on-accent)" strokeWidth="2.6" strokeLinecap="round">
        <path d="M16 7v18M7 16h18M9.6 9.6l12.8 12.8M22.4 9.6 9.6 22.4" />
      </g>
    </svg>
  );
}
