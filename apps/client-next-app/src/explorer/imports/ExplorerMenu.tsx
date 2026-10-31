"use client";

import ContextMenu, {
  ContextMenuItem,
} from "@/src/imports/controls/ContextMenu";
import { AnchorLocation } from "@/src/imports/hooks/anchor_location";
import FolderSvg from "@/src/imports/svgs/FolderSvg";

interface ExplorerMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAddWorkSpace: () => void;
}

export default function ExplorerMenu(props: ExplorerMenuProps) {
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
        text="add workspace"
        onTriggered={() => props.onAddWorkSpace()}
        icon={<FolderSvg width={25} height={25}></FolderSvg>}
      ></ContextMenuItem>
    </ContextMenu>
  );
}
