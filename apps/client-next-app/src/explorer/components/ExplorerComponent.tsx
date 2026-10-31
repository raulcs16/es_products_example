"use client";

import { useExplorerController } from "../context/ExplorerContext";
import {
  ExplorerContextMenu,
  ExplorerInputMode,
  InputMode,
  MenuMode,
} from "../context/state";
import ExplorerContainer from "../imports/ExplorerContainer";
import ExplorerTreeComponent from "./ExplorerTreeComponent";

export default function ExplorerComponent() {
  const controller = useExplorerController();
  return (
    <ExplorerContainer
      onContextMenu={(x, y, bottomAnchorRef) => {
        const context: ExplorerContextMenu = {
          mode: MenuMode.Explorer,
          x,
          y,
          targetId: "",
          anchorRef: bottomAnchorRef,
        };
        controller.setContextMenu(context);
      }}
      onAddDir={(bottomRef) => {
        const mode: ExplorerInputMode = {
          mode: InputMode.AddDirectoryNode,
          anchorRef: bottomRef,
          parentId: null,
          placeHolder: "new workspace",
        };
        controller.setInputMode(mode);
      }}
    >
      <ExplorerTreeComponent></ExplorerTreeComponent>
    </ExplorerContainer>
  );
}
