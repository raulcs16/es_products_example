"use client";

import React, { useState } from "react";

interface WorkspaceProps {
  leftHeader: React.ReactNode;
  title: React.ReactNode;
  workspace: React.ReactNode;
  sideBar: React.ReactNode;
  sideBarOpen: boolean;
}

export default function WorkspaceLayout(props: WorkspaceProps) {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(props.sideBarOpen);

  return (
    <div className="w-full h-full pt-3 flex flex-col">
      {/* HEADER SECTION */}
      <div className="w-full flex justify-between px-3 items-end pb-3 border-b border-slate-800 shrink-0">
        <div>{props.leftHeader}</div>
        {props.title}
        <button
          onClick={() => {
            if (props.sideBar) setSideBarOpen(!sideBarOpen);
          }}
          className="cursor-pointer text-slate-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
            className="w-7 h-7"
          >
            <rect x="3" y="3" width="18" height="18" fill="none" />
            <rect
              x="14"
              y="3"
              width="7"
              height="18"
              fill={sideBarOpen ? "currentColor" : "none"}
              stroke={sideBarOpen ? "none" : "currentColor"}
            />
          </svg>
        </button>
      </div>

      {/* BODY VIEWPORT WINDOW CONTAINER */}
      <div className="w-full h-full flex-1 min-h-0 relative overflow-hidden">
        {/* Main Workspace (Takes full space, independent of sidebar status) */}
        <div className="w-full h-full flex flex-col min-w-0 overflow-auto">
          {props.workspace}
        </div>

        {/* Floating Sidebar Panel (Overlays smoothly from the right) */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-[80vw] max-w-lg z-10
                     flex flex-col overflow-hidden
                     bg-[#0A0A0A]
                     border-l border-slate-800
                     shadow-2xl shadow-black/50
                     transition-transform duration-300 ease-in-out will-change-transform
                     ${sideBarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="w-full h-full flex flex-col overflow-hidden">
            {props.sideBar}
          </div>
        </div>
      </div>
    </div>
  );
}
