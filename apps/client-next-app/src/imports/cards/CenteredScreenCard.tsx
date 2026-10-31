import { ReactNode } from "react";

interface CenterScreenCardProps {
  children: ReactNode;
}

export default function CenterScreenCard({ children }: CenterScreenCardProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-none" />
      <div className="relative pointer-events-auto w-full max-w-md transform overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 px-1 pt-1 pb-6 text-left align-middle shadow-2xl shadow-black/80 transition-all transform-gpu animate-in fade-in zoom-in-95 duration-150">
        <div className="text-slate-200 p-4 pt-6">{children}</div>
      </div>
    </div>
  );
}
