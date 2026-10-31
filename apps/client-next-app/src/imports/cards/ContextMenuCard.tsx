"use client";

import { ReactNode } from "react";

export default function ContextMenuCard({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-[160px]  bg-slate-950/95 backdrop-blur-md border border-slate-800 shadow-black/50  rounded-md p-1 shadow-2xl flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
      {children}
    </div>
  );
}
