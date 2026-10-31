"use client";

import { ReactNode } from "react";
import FloatingPortal from "../overlays/FloatingPortal";

export interface ModalProps {
  children: ReactNode;
  z: number;
  open: boolean;
}
export default function Modal(props: ModalProps) {
  if (!props.open) return null;
  return <FloatingPortal z={props.z}>{props.children}</FloatingPortal>;
}
