"use client";

import { ReactNode, RefObject } from "react";
import Scrim from "../overlays/Scrim";
import FloatingPortal from "../overlays/FloatingPortal";
import { AnchorLocation } from "../hooks/anchor_location";

export interface PopUpProps {
  children: ReactNode;
  anchorRef: RefObject<HTMLElement | null>;
  anchor: AnchorLocation;
  z: number;
  open: boolean;
  onClose: () => void;
}
export default function PopUp(props: PopUpProps) {
  if (!props.open) return null;
  return (
    <FloatingPortal
      z={props.z}
      anchor={props.anchor}
      anchorRef={props.anchorRef}
    >
      <Scrim onClickedAway={props.onClose} z={props.z - 1}></Scrim>
      {props.children}
    </FloatingPortal>
  );
}
