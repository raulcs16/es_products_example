"use client";

import {
  useExplorerController,
  useExplorerState,
  useVisibleNodes,
} from "../context/ExplorerContext";
import ExplorerRow from "../imports/ExplorerRow";
import ExplorerTree from "../imports/ExplorerTree";
import {
  EXPLORER_TYPES,
  ExplorerContextMenu,
  InputMode,
  MenuMode,
} from "../context/state";
import { useCallback } from "react";

export default function ExplorerTreeComponent() {
  const controller = useExplorerController();
  const state = useExplorerState();
  const visibleNodes = useVisibleNodes();
  const handleRegisterAnchorRef = useCallback(
    (el: HTMLDivElement | null) => {
      controller.setInputTarget(el);
    },
    [controller]
  );
  return (
    <ExplorerTree
      visibleNodes={visibleNodes}
      addingChildDirId={
        state.inputMode.mode === InputMode.AddFileNode
          ? state.inputMode.parentId
          : ""
      }
      renderNode={(visibleNode) => (
        <ExplorerRow
          key={visibleNode.node.id}
          depth={visibleNode.depth}
          id={visibleNode.node.id}
          type={visibleNode.node.type}
          title={visibleNode.node.label}
          hasChildren={visibleNode.hasChildren}
          editable={state.editId === visibleNode.node.id}
          selected={visibleNode.node.id === state.selectedId}
          onContextMenu={(x, y, anchorRef) => {
            let mode: MenuMode = MenuMode.File;
            if (visibleNode.node.type === EXPLORER_TYPES.CONTAINER) {
              mode = MenuMode.Directory;
            }
            const menu: ExplorerContextMenu = {
              mode,
              x,
              y,
              anchorRef,
              targetId: visibleNode.node.id,
            };
            controller.setContextMenu(menu);
          }}
          onSelected={() => {
            controller.onNodeSelected(visibleNode);
          }}
        ></ExplorerRow>
      )}
      registerAnchorRef={handleRegisterAnchorRef}
    ></ExplorerTree>
  );
}
