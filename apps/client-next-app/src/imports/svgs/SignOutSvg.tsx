export default function SignOutSvg({
  width = 24,
  height = 24,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Door Frame */}
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      {/* Arrow Shaft */}
      <polyline points="16 17 21 12 16 7" />
      {/* Arrow Point */}
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
