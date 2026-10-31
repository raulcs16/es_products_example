"use client";

import {
  useExplorerController,
  useExplorerState,
} from "../context/ExplorerContext";
import ExploererTextInput from "../imports/ExplorerTextInput";

export default function ExplorerInputComponent() {
  const { inputMode } = useExplorerState();

  const controller = useExplorerController();
  return (
    <ExploererTextInput
      placeholder={inputMode.placeHolder}
      placeOverRef={inputMode.anchorRef}
      onClickAway={() => controller.hideTextInput()}
      onInputEnter={(text) => controller.handleTextInput(text)}
      onInputChange={() => {}}
    ></ExploererTextInput>
  );
}
