export function FlameMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect width="64" height="64" rx="14" fill="#004374" />
      <path
        d="M32 10c8 10 18 16 18 28a18 18 0 1 1-36 0c0-12 10-18 18-28z"
        fill="#006CB1"
      />
      <path
        d="M32 22c5 6 11 10 11 17a11 11 0 1 1-22 0c0-7 6-11 11-17z"
        fill="#32ADE5"
      />
      <path
        d="M32 34c2.5 3 5.5 5 5.5 8.5A5.5 5.5 0 1 1 26.5 42.5C26.5 39 29.5 37 32 34z"
        fill="#FF6A00"
      />
    </svg>
  )
}
