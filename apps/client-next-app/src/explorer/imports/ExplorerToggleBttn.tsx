"use client";
export interface ExplorerToggleBttnProps {
  isOpen: boolean;
  onClicked: () => void;
}
export default function ExplorerToggleBttn(props: ExplorerToggleBttnProps) {
  return (
    <button
      onClick={props.onClicked}
      className="cursor-pointer text-slate-400 hover:text-white transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1"
        className="w-7 h-7"
      >
        <rect x="3" y="3" width="18" height="18" fill="none" />
        <rect
          x="14"
          y="3"
          width="7"
          height="18"
          fill={props.isOpen ? "currentColor" : "none"}
          stroke={props.isOpen ? "none" : "currentColor"}
        />
      </svg>
    </button>
  );
}
