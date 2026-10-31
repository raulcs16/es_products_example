"use client";
import { ReactNode } from "react";
import { AnchorLocation } from "../hooks/anchor_location";
import { usePosCoords } from "../hooks/usePosCoords";
import FloatingPortal from "../overlays/FloatingPortal";
import Scrim from "../overlays/Scrim";

// --- MENU ITEM COMPONENT (Maps closely to QML MenuItem) ---
interface ContextMenuItemProps {
  text: string;
  icon?: ReactNode;
  onTriggered: () => void;
}

export function ContextMenuItem({
  text,
  icon,
  onTriggered,
}: ContextMenuItemProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation(); // Block bubbling to the overlay scrim
        onTriggered();
      }}
      className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-md transition-colors duration-150 flex items-center gap-2 group cursor-pointer"
    >
      {icon && (
        <span className="text-slate-500 group-hover:text-slate-300 shrink-0">
          {icon}
        </span>
      )}
      <span className="truncate">{text}</span>
    </button>
  );
}

interface ContextMenuProps {
  x: number;
  y: number;
  open: boolean;
  onClosed: () => void;
  children: ReactNode;
}

export default function ContextMenu({
  x,
  y,
  open,
  onClosed,
  children,
}: ContextMenuProps) {
  if (!open) return null;
  const anchor = getAutoAnchor(x, y);
  const style = usePosCoords(x, y, anchor);

  return (
    <FloatingPortal z={90}>
      <Scrim z={89} onClickedAway={onClosed}></Scrim>
      <div
        className="fixed  min-w-[160px] bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-lg p-1 shadow-xl shadow-black/50 flex flex-col gap-0.5 transform-gpu animate-in fade-in zoom-in-95 duration-100 pointer-events-auto"
        style={style}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClosed();
        }}
      >
        {children}
      </div>
    </FloatingPortal>
  );
}
function getAutoAnchor(x: number, y: number): AnchorLocation {
  if (typeof window === "undefined") return AnchorLocation.BottomRight;

  // Approximate thresholds (or menu dimensions) before collision occurs
  const MENU_WIDTH_ESTIMATE = 180;
  const MENU_HEIGHT_ESTIMATE = 220;

  const hitsRight = x + MENU_WIDTH_ESTIMATE > window.innerWidth;
  const hitsBottom = y + MENU_HEIGHT_ESTIMATE > window.innerHeight;

  if (hitsRight && hitsBottom) return AnchorLocation.TopLeft;
  if (hitsRight) return AnchorLocation.BottomLeft;
  if (hitsBottom) return AnchorLocation.TopRight;

  return AnchorLocation.BottomRight;
}
