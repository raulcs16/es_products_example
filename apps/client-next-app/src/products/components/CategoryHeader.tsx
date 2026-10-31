"use client";

import {
  useProductController,
  useProductStore,
} from "../context/ProductContext";

export default function CategoryHeaderComponent() {
  const store = useProductStore();
  const controller = useProductController();

  const parentCategories = store.parentCategories;
  const selectedCategories = store.activeFilters.selectedCategories;

  return (
    <div className="flex flex-col gap-2 w-full px-4 py-2 bg-bg-light border-b border-slate-800/60">
      {/* Header bar title */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Categories
        </span>
      </div>

      {/* Grid container for parent categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {parentCategories.map((category) => {
          const children = store.getChildrenCategories(category.id);
          if (children.length === 0) return null; // Skip empty groups

          return (
            <div
              key={category.id}
              className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-bg/40 border border-slate-800/60"
            >
              {/* Parent Name Header */}
              <span className="text-[10px] font-mono text-primary uppercase tracking-wide border-b border-slate-800/80 pb-1">
                {category.name}
              </span>

              {/* Subcategories compact pill grid/stack */}
              <div className="flex items-center gap-1 flex-wrap">
                {children.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => controller.toggleCategory(cat.id)}
                      className={`px-2 py-0.5 rounded text-xs font-medium transition-all border text-left leading-tight ${
                        isSelected
                          ? "bg-bg-dark border-indigo-500/60 text-primary shadow-xs"
                          : "bg-bg border-slate-800/80 text-secondary hover:border-slate-700 hover:bg-slate-900"
                      }`}
                      title={cat.name}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
