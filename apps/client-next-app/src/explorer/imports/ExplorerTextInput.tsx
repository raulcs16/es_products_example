"use client";

import FloatingPortal from "@/src/imports/overlays/FloatingPortal";
import Scrim from "@/src/imports/overlays/Scrim";
import TextInput from "@/src/imports/controls/TextInput";
import { RefObject } from "react";

export interface ExploererTextInputProps {
  placeholder: string;
  placeOverRef: RefObject<HTMLElement | null> | null;
  onClickAway(): void;
  onInputEnter(text: string): void;
  onInputChange(text: string): void;
}
export default function ExploererTextInput(props: ExploererTextInputProps) {
  if (!props.placeOverRef) return null;
  return (
    <>
      <Scrim onClickedAway={props.onClickAway} z={20}></Scrim>
      <FloatingPortal anchorRef={props.placeOverRef} z={30}>
        <div className="px-2 pt-0.5">
          <TextInput
            placeHolder={props.placeholder}
            onEnter={props.onInputEnter}
            onChange={props.onInputChange}
          ></TextInput>
        </div>
      </FloatingPortal>
    </>
  );
}
