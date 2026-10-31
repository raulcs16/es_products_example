"use client";

import {
  useProductController,
  useProductStore,
} from "../context/ProductContext";

export default function ActiveFiltersComponent() {
  const store = useProductStore();
  const controller = useProductController();
  const filters = store.activeFilters;

  // Flatten active filters into a single array with their specific removal handlers
  const activeItems = [
    ...store.selectedCategories.map((val) => ({
      label: val.name,
      onRemove: () => controller.toggleCategory(val.id),
    })),
    ...filters.selectedCerts.map((val) => ({
      label: val,
      onRemove: () => controller.toggleCert(val),
    })),
    ...filters.selectedShafts.map((val) => ({
      label: val,
      onRemove: () => controller.toggleShaft(val),
    })),
    ...filters.selectedWeights.map((val) => ({
      label: val,
      onRemove: () => controller.toggleWeight(val),
    })),
    ...filters.selectedFrames.map((val) => ({
      label: val,
      onRemove: () => controller.toggleFrame(val),
    })),
  ];

  return (
    <div className="w-full px-6 h-12 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 justify-between bg-bg">
      <div>
        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider mr-1">
          Active Filters:
        </span>
        {activeItems.map((item, idx) => (
          <div
            key={`${item.label}-${idx}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-bg-dark border border-slate-800 text-secondary text-xs shadow-sm hover:border-slate-700 transition-colors"
          >
            <span>{item.label}</span>
            <button
              onClick={item.onRemove}
              className="text-slate-400 hover:text-rose-400 transition-colors focus:outline-none font-mono font-bold text-xs px-0.5"
              title={`Remove ${item.label}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={controller.clearAllFilters}
        className="text-[11px] text-slate-400 hover:text-slate-200 underline ml-2 shrink-0 transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}
