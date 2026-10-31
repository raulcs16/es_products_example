"use client";
import { ReactNode } from "react";

interface GridProps<T> {
  items: T[];
  currentIndex: number;
  onItemClicked: (index: number) => void;
  renderItem: (item: T, index: number, isFocused: boolean) => ReactNode;
}

export default function Grid<T>({
  items,
  currentIndex,
  onItemClicked,
  renderItem,
}: GridProps<T>) {
  return (
    <div className="w-full h-full grid grid-cols-2 md:grid-cols-4 gap-2 p-4 overflow-auto items-start">
      {items.map((item, index) => {
        const isFocused = index === currentIndex;

        return (
          <div
            key={index}
            onClick={() => onItemClicked(index)}
            /* Items naturally fill 100% of their grid cell, preventing shrinking completely */
            className="w-full h-100 flex flex-col justify-start cursor-pointer group"
          >
            <div className="grow overflow-hidden rounded-lg p-2 pointer-events-none select-none">
              <div
                className="w-[133%] h-[133%] origin-top-left scale-[0.75] transform-gpu transition-all duration-300"
                style={{ opacity: isFocused ? 1.0 : 0.4 }}
              >
                {renderItem(item, index, isFocused)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
