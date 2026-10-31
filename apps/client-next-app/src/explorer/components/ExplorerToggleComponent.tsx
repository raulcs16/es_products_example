"use client";

import {
  useExplorerController,
  useExplorerState,
} from "../context/ExplorerContext";
import ExplorerToggleBttn from "../imports/ExplorerToggleBttn";

export default function ExplorerToggleComponent() {
  const { isOpen } = useExplorerState();
  const { toggleOpenState } = useExplorerController();
  return (
    <ExplorerToggleBttn
      isOpen={isOpen}
      onClicked={toggleOpenState}
    ></ExplorerToggleBttn>
  );
}
