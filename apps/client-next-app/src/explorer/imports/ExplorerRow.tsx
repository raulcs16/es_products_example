import { RefObject, useRef } from "react";
import ContextButton from "@/src/imports/controls/ContextButton";
import { EXPLORER_TYPES, ExplorerType } from "../context/state";

interface ExplorerRowProps {
  id: string;
  depth: number;
  title: string;
  type: ExplorerType;
  hasChildren: boolean;
  route?: string;
  editable: boolean;
  selected: boolean;
  onContextMenu: (
    x: number,
    y: number,
    rowAnchorRef: RefObject<HTMLDivElement | null>
  ) => void;
  onSelected: () => void;
}

export default function ExplorerRow(props: ExplorerRowProps) {
  const rowAnchorRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={rowAnchorRef} className="relative w-full">
      <li
        className={`w-full hover:${props.selected ? "" : "bg-[#FFFFFF0D]"} cursor-pointer list-none select-none border border-transparent ${
          props.editable ? "invisible pointer-events-none" : ""
        } ${
          /* VS Code Selection Style: Full width background fill + bright blue outline */
          props.selected ? "bg-[#04395e] !border-[#007fd4]" : ""
        } ${
          props.type === EXPLORER_TYPES.CONTAINER
            ? "font-bold text-blue-400"
            : ""
        }`}
        onClick={() => props.onSelected()}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          props.onContextMenu(e.clientX, e.clientY, rowAnchorRef);
        }}
      >
        {/* Indentation is applied INSIDE so the selection background covers full width */}
        <div
          className="w-full h-full px-3"
          style={{ paddingLeft: `${props.depth * 12 + 12}px` }}
        >
          <ContextButton
            onClick={(x, y) => {
              props.onContextMenu(x, y, rowAnchorRef);
            }}
          >
            <p className="py-1 text-sm truncate max-w-[20ch] text-white">
              {props.title}
            </p>
          </ContextButton>
        </div>
      </li>
    </div>
  );
}
