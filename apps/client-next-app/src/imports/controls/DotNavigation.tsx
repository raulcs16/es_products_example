"use client";
import React, { useMemo } from "react";

interface DotNavigationProps {
  total: number;
  currentIndex: number;
  onIndexSelect: (index: number) => void;
}

export default function DotNavigation({
  total,
  currentIndex,
  onIndexSelect,
}: DotNavigationProps) {
  if (total <= 1) return null;

  // Configuration values for alignment math
  const maxVisibleDots = 7;
  const cellWidth = 24;
  const halfVisible = Math.floor(maxVisibleDots / 2);

  // Calculate the sliding offset based on fixed cell widths
  const trackTranslateX = useMemo(() => {
    if (total <= maxVisibleDots) return 0;

    // Center the active dot unless it's near the extreme start or end boundaries
    if (currentIndex <= halfVisible) return 0;
    const maxScroll = (total - maxVisibleDots) * cellWidth;
    if (currentIndex >= total - halfVisible) return maxScroll;

    return (currentIndex - halfVisible) * cellWidth;
  }, [currentIndex, total, halfVisible, cellWidth, maxVisibleDots]);

  // Conditionals: Only show jumps if the extreme edge dots have slid completely out of view
  const showFirstJump = total > maxVisibleDots && currentIndex > halfVisible;
  const showLastJump =
    total > maxVisibleDots && currentIndex < total - 1 - halfVisible;

  return (
    <div className="flex items-center gap-1 select-none px-2 py-1">
      <div className="w-6 h-12 flex items-center justify-center shrink-0 mr-2">
        {showFirstJump && (
          <DotIndexButton
            index={0}
            onIndexSelect={(index) => onIndexSelect(index)}
            isActive={false}
            scaleClass={""}
          ></DotIndexButton>
        )}
      </div>

      {/* --- CENTRAL VIEWPORT WINDOW --- */}
      <div
        className="relative flex items-center justify-start overflow-hidden h-12"
        style={{
          width: `${maxVisibleDots * cellWidth}px`,
        }}
      >
        <div
          className="flex items-center transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translateX(-${trackTranslateX}px)` }}
        >
          {Array.from({ length: total }).map((_, index) => {
            const isActive = index === currentIndex;
            const distance = Math.abs(index - currentIndex);

            // Progressive scale drop-off based on distance from the center element
            let scaleClass = "scale-100";
            if (distance > 2) scaleClass = "scale-90 opacity-75";
            if (distance > 3) scaleClass = "scale-75 opacity-40";
            if (distance > 4)
              scaleClass = "scale-50 opacity-10 pointer-events-none";

            return (
              <div
                key={index}
                style={{ width: `${cellWidth}px` }}
                className="shrink-0 flex items-center justify-center"
              >
                <DotIndexButton
                  index={index}
                  onIndexSelect={onIndexSelect}
                  isActive={isActive}
                  scaleClass={scaleClass}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-6 h-12 flex items-center justify-center shrink-0 ml-2">
        {showLastJump && (
          <DotIndexButton
            index={total - 1}
            onIndexSelect={(index) => onIndexSelect(index)}
            isActive={false}
            scaleClass={""}
          ></DotIndexButton>
        )}
      </div>
    </div>
  );
}

interface DotIndexButtonProps {
  index: number;
  onIndexSelect: (index: number) => void;
  isActive: boolean;
  scaleClass: string;
}

function DotIndexButton({
  index,
  onIndexSelect,
  isActive,
  scaleClass,
}: DotIndexButtonProps) {
  return (
    <div
      className={`cursor-pointer transition-all duration-300 ease-out origin-center ${scaleClass} flex flex-col items-center gap-1 w-full`}
    >
      <button
        onClick={() => onIndexSelect(index)}
        className={`h-3 w-3 shrink-0 rounded-full transition-all duration-300 ${
          isActive
            ? "bg-indigo-500 shadow-sm shadow-indigo-500/50 scale-110"
            : "bg-slate-600 hover:bg-slate-400"
        }`}
        aria-label={`Go to board ${index + 1}`}
      />
      <span
        className={`transition-all duration-300 text-[12px] font-bold font-mono text-center block tracking-tighter ${
          isActive
            ? "opacity-100 text-indigo-400 scale-105"
            : "opacity-40 text-slate-500 text-[9px]"
        }`}
      >
        {index + 1}
      </span>
    </div>
  );
}
