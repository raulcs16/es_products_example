"use client";
import { RefObject, ReactNode } from "react";
import { AnchorLocation, useRectCoords } from "../hooks/useRectCoords";
import Portal from "./Portal";

interface FloatingPortalProps {
  children: ReactNode;
  anchorRef?: RefObject<HTMLElement | null> | null;
  anchor?: AnchorLocation;
  z: number;
}

export default function FloatingPortal(props: FloatingPortalProps) {
  if (!props.anchorRef) {
    return (
      <Portal>
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: props.z }}
        >
          {props.children}
        </div>
      </Portal>
    );
  }
  const anchorStyle = useRectCoords(props.anchorRef, props.anchor);

  if (!anchorStyle) return null;

  // Mode 2: Element-Anchored Overlay (Inline edit cover, Popover, Dropdown)
  return (
    <Portal>
      <div
        className="fixed pointer-events-none transform-gpu"
        style={{
          ...anchorStyle,
          zIndex: props.z,
        }}
      >
        <div className="pointer-events-auto">{props.children}</div>
      </div>
    </Portal>
  );
}
