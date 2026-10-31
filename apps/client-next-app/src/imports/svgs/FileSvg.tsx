interface FileSvgProps {
  width: number;
  height: number;
}
export default function FileSvg(props: FileSvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-emerald-500/70 group-hover:text-emerald-400"
      width={props.width}
      height={props.height}
    >
      {/* Document page outline with a dog-eared corner top right */}
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      {/* Plus line: horizontal */}
      <line x1="9" y1="15" x2="15" y2="15" />
      {/* Plus line: vertical */}
      <line x1="12" y1="12" x2="12" y2="18" />
    </svg>
  );
}
