"use client";

import {
  useExplorerController,
  useExplorerState,
} from "../context/ExplorerContext";
import { ExplorerInputMode, InputMode, MenuMode } from "../context/state";
import DirectoryMenu from "../imports/DirectoryMenu";
import ExplorerMenu from "../imports/ExplorerMenu";
import FileMenu from "../imports/FileMenu";

export default function ContextMenuComponent() {
  const { contextMenu } = useExplorerState();
  const controller = useExplorerController();
  if (contextMenu.mode === MenuMode.Hidden) {
    return null;
  } else if (contextMenu.mode === MenuMode.Explorer) {
    return (
      <ExplorerMenu
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => controller.hideContextMenu()}
        onAddWorkSpace={() => {
          controller.hideContextMenu();
          if (!contextMenu.anchorRef) return;
          const imode: ExplorerInputMode = {
            mode: InputMode.AddDirectoryNode,
            anchorRef: contextMenu.anchorRef,
            parentId: null,
            placeHolder: "new workspace",
          };
          controller.setInputMode(imode);
        }}
      ></ExplorerMenu>
    );
  } else if (contextMenu.mode === MenuMode.Directory) {
    return (
      <DirectoryMenu
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => controller.hideContextMenu()}
        onRename={() => {
          controller.hideContextMenu();
          if (!contextMenu.anchorRef) return;
          const mode: ExplorerInputMode = {
            mode: InputMode.RenameDirectory,
            anchorRef: contextMenu.anchorRef,
            parentId: contextMenu.targetId,
            placeHolder: "",
          };
          controller.setInputMode(mode);
        }}
        onAddFile={() => {
          controller.hideContextMenu();
          if (!contextMenu.anchorRef) return;
          const mode: ExplorerInputMode = {
            mode: InputMode.AddFileNode,
            anchorRef: contextMenu.anchorRef,
            parentId: contextMenu.targetId,
            placeHolder: "new file",
          };
          controller.setInputMode(mode);
        }}
      ></DirectoryMenu>
    );
  } else if (contextMenu.mode === MenuMode.File) {
    return (
      <FileMenu
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => controller.hideContextMenu()}
        onRename={() => {
          controller.hideContextMenu();
          if (!contextMenu.anchorRef) return;
          const mode: ExplorerInputMode = {
            mode: InputMode.RenameFile,
            anchorRef: contextMenu.anchorRef,
            parentId: contextMenu.targetId,
            placeHolder: "",
          };
          controller.setInputMode(mode);
        }}
        onDelete={() => {
          controller.hideContextMenu();
          controller.setDeleteId(contextMenu.targetId);
        }}
      ></FileMenu>
    );
  }
}
