// Court Seal Icon Component

interface CourtSealProps {
  className?: string;
  size?: number;
}

export function CourtSeal({ className = '', size = 64 }: CourtSealProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle
        cx="32"
        cy="32"
        r="30"
        stroke="#F5A623"
        strokeWidth="1.5"
        fill="none"
        opacity="0.9"
      />
      {/* Inner circle */}
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke="#F5A623"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      {/* Scales of justice */}
      <line
        x1="32"
        y1="16"
        x2="32"
        y2="44"
        stroke="#F5A623"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Balance beam */}
      <line
        x1="16"
        y1="28"
        x2="48"
        y2="28"
        stroke="#F5A623"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Left scale pan */}
      <path
        d="M16 28 L12 36 L20 36 Z"
        stroke="#F5A623"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Right scale pan */}
      <path
        d="M48 28 L44 36 L52 36 Z"
        stroke="#F5A623"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Base */}
      <line
        x1="24"
        y1="48"
        x2="40"
        y2="48"
        stroke="#F5A623"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="32"
        y1="44"
        x2="32"
        y2="48"
        stroke="#F5A623"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Decorative dots */}
      <circle cx="32" cy="12" r="2" fill="#F5A623" opacity="0.8" />
      <circle cx="12" cy="32" r="1.5" fill="#F5A623" opacity="0.6" />
      <circle cx="52" cy="32" r="1.5" fill="#F5A623" opacity="0.6" />
    </svg>
  );
}
