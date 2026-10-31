"use client";
import { useState } from "react";
import Button from "./Button";

interface GridToggleProps {
  onToggled: (state: boolean) => void;
  active: boolean;
}

export default function GridToggle(props: GridToggleProps) {
  return (
    <Button
      onClick={() => props.onToggled(props.active)}
      title="Toggle Grid View"
      active={props.active}
      className={`transition-all duration-200 ease-out flex items-center justify-center group`}
    >
      {/* Custom SVG 4-Square Layout Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 transition-transform duration-200 group-hover:scale-105 transform-gpu"
      >
        {/* Top-Left Square (Expanded to 9x9, sitting flush with a 2px outer margin) */}
        <rect x="2" y="2" width="9" height="9" rx="1.5" />

        {/* Top-Right Square (Starts at x=13 to preserve a perfect 2px center gutter) */}
        <rect x="13" y="2" width="9" height="9" rx="1.5" />

        {/* Bottom-Left Square */}
        <rect x="2" y="13" width="9" height="9" rx="1.5" />

        {/* Bottom-Right Square */}
        <rect x="13" y="13" width="9" height="9" rx="1.5" />
      </svg>
    </Button>
  );
}
