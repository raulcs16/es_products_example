"use client";

import ContextMenu, {
  ContextMenuItem,
} from "@/src/imports/controls/ContextMenu";
import FileSvg from "@/src/imports/svgs/FileSvg";

interface DirectoryMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onRename: () => void;
  onAddFile: () => void;
}

export default function DirectoryMenu(props: DirectoryMenuProps) {
  return (
    <ContextMenu
      x={props.x}
      y={props.y}
      open={true}
      onClosed={() => {
        props.onClose();
      }}
    >
      <ContextMenuItem
        text="Rename"
        onTriggered={() => props.onRename()}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        }
      ></ContextMenuItem>
      <ContextMenuItem
        text="add file"
        onTriggered={() => props.onAddFile()}
        icon={<FileSvg width={10} height={10}></FileSvg>}
      ></ContextMenuItem>
    </ContextMenu>
  );
}
