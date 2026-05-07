interface LogoProps {
  className?: string;
  color?: string;
  showText?: boolean;
  textColor?: string;
}

export function Logo({
  className = "w-8 h-8",
  color = "#E8E1FF",
  showText = false,
  textColor = "#E8E1FF",
}: LogoProps) {
  if (showText) {
    return (
      <div className="flex items-center gap-3">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Hourglass/Bowtie shape - inspired by the logo */}
          <path d="M8 8 L20 20 L8 32 L8 8 Z" fill={color} />
          <path d="M32 8 L20 20 L32 32 L32 8 Z" fill={color} />
        </svg>
        <span
          className="tracking-tight"
          style={{
            color: textColor,
            fontWeight: 600,
          }}
        >
          MusicStream
        </span>
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hourglass/Bowtie shape */}
      <path d="M8 8 L20 20 L8 32 L8 8 Z" fill={color} />
      <path d="M32 8 L20 20 L32 32 L32 8 Z" fill={color} />
    </svg>
  );
}