"use client";

import { SpecBucket } from "@repo/product/sku/types";

export interface SpecFilterProps {
  spec: string;
  keys: SpecBucket[];
  selectedKeys: string[];
  onToggleKey: (key: string) => void;
  onClear: () => void;
}

export default function SpecProtocolFilter(props: SpecFilterProps) {
  if (props.keys.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 w-full text-xs">
      <div className="flex items-center justify-between pb-1 text-slate-400 font-medium">
        <span>{props.spec}</span>
        {props.selectedKeys.length > 0 && (
          <button
            onClick={props.onClear}
            className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
        {props.keys.map((key) => {
          const isSelected = props.selectedKeys.includes(key.name);
          return (
            <button
              key={key.name}
              onClick={() => props.onToggleKey(key.name)}
              className={`flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors cursor-pointer ${
                isSelected
                  ? "bg-bg-dark text-secondary font-medium"
                  : "text-primary hover:bg-bg-dark/90 hover:text-white"
              }`}
            >
              <span className="truncate pr-2">{key.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
