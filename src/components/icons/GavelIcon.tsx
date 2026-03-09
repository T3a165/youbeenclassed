// Gavel Icon Component

interface GavelIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export function GavelIcon({ className = '', size = 72, animated = false }: GavelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? 'animate-gavel-strike' : ''}`}
    >
      {/* Gavel head */}
      <rect
        x="12"
        y="28"
        width="36"
        height="16"
        rx="3"
        stroke="#F5A623"
        strokeWidth="2"
        fill="none"
      />
      {/* Gavel handle */}
      <rect
        x="44"
        y="32"
        width="20"
        height="8"
        rx="2"
        stroke="#F5A623"
        strokeWidth="2"
        fill="none"
        transform="rotate(45 54 36)"
      />
      {/* Sound block */}
      <rect
        x="20"
        y="52"
        width="24"
        height="6"
        rx="2"
        stroke="#F5A623"
        strokeWidth="2"
        fill="none"
      />
      {/* Impact lines */}
      {animated && (
        <>
          <line x1="14" y1="48" x2="10" y2="52" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="48" x2="32" y2="54" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="48" x2="54" y2="52" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
