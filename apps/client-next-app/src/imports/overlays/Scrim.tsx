"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ScrimProps {
  onClickedAway: () => void;
  z: number;
  debug?: boolean;
}

export default function Scrim(props: ScrimProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const rgb = props.debug ? "#ff000088" : "#00000001";
  return createPortal(
    <>
      {/* 1. THE GIANT HITBOX BACKDROP */}
      <div
        className={`fixed inset-0 cursor-default select-none`}
        style={{ zIndex: props.z, backgroundColor: rgb }}
        onClick={(e) => {
          e.stopPropagation(); // Stop the event trail
          props.onClickedAway(); // Signal to parent to close/setEdit(false)
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          props.onClickedAway(); // Right clicking away also closes it safely
        }}
      />
    </>,
    document.body
  );
}
