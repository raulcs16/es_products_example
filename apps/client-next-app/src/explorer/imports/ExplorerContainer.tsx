"use client";

import FolderSvg from "@/src/imports/svgs/FolderSvg";
import { RefObject, useRef } from "react";

export interface ExplorerContainerProps {
  onContextMenu(
    x: number,
    y: number,
    bottomAnchorRef: RefObject<HTMLDivElement | null>
  ): void;
  onAddDir(bottomRef: RefObject<HTMLDivElement | null>): void;
  children: React.ReactNode;
}
export default function ExplorerContainer(props: ExplorerContainerProps) {
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="w-full h-full flex flex-col overflow-x-hidden overflow-y-auto select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        props.onContextMenu(e.clientX, e.clientY, bottomAnchorRef);
      }}
    >
      <header className="w-full px-3 py-2 flex justify-between items-center shrink-0">
        <h1 className="text-xs font-semibold uppercase tracking-wider text-secondary">
          {"Explorer"}
        </h1>
        <button onClick={() => props.onAddDir(bottomAnchorRef)}>
          <FolderSvg width={25} height={25}></FolderSvg>
        </button>
      </header>
      <div className="w-full h-fit max-h-[90%] overflow-auto mb-2">
        {props.children}
      </div>
      <div ref={bottomAnchorRef} className="mx-3 h-10"></div>
    </div>
  );
}
