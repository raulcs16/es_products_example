"use client";

import { CategoryBucket } from "@repo/product/sku/types";

export interface ParentCategoryGroup {
  parentName: string;
  categories: CategoryBucket[];
}

export function groupCategoriesByParent(
  categories: CategoryBucket[]
): ParentCategoryGroup[] {
  const groups: Record<string, CategoryBucket[]> = {};

  categories.forEach((cat) => {
    const parent = cat.parentName || "General Categories";
    if (!groups[parent]) {
      groups[parent] = [];
    }
    groups[parent].push(cat);
  });

  return Object.entries(groups).map(([parentName, categories]) => ({
    parentName,
    categories,
  }));
}
export interface CategoryGridLandingProps {
  categories: CategoryBucket[];
  onSelectCategory: (id: string) => void;
}

export default function CategoryGridLanding({
  categories,
  onSelectCategory,
}: CategoryGridLandingProps) {
  const grouped = groupCategoriesByParent(categories);

  return (
    <div className="flex flex-col gap-8 w-full p-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white tracking-tight">
          Product Catalog
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Select a category below to explore products and apply technical
          filters.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {grouped.map((group) => (
          <div key={group.parentName} className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-l-2 border-indigo-500 pl-2">
              {group.parentName}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {group.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.name)}
                  className="flex flex-col justify-between p-4 bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-800/50 rounded-lg text-left transition-all group cursor-pointer"
                >
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
                    {cat.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 mt-3 flex items-center justify-between">
                    <span>Products</span>
                    <span className="bg-slate-800 group-hover:bg-indigo-950/80 group-hover:text-indigo-300 px-2 py-0.5 rounded text-[10px]">
                      {cat.productCount}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
