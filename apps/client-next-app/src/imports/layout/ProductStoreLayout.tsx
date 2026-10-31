import React from "react";

export interface ProductStoreLayoutProps {
  searchBar?: React.ReactNode;
  categoryHeader?: React.ReactNode;
  activeFiltersBar?: React.ReactNode;
  filterSidebar?: React.ReactNode;
  productHeader?: React.ReactNode;
  productGrid?: React.ReactNode;
  sortControl?: React.ReactNode;
}

export default function ProductStoreLayout(props: ProductStoreLayoutProps) {
  return (
    <div className="w-full h-full flex flex-col bg-[#0A0A0A] text-slate-100 overflow-hidden">
      <div className="w-full">{props.searchBar}</div>
      <div className="w-full border-b border-slate-800   shrink-0">
        {props.categoryHeader}
      </div>
      <div className="w-full border-b border-slate-800">
        {props.activeFiltersBar}
      </div>
      {/* LOWER SPLIT VIEWPORT */}
      <div className="w-full flex-1 flex min-h-0 overflow-hidden">
        {/* LEFT FILTER SIDEBAR */}
        <aside className="w-72 h-full border-r border-slate-800">
          {props.filterSidebar}
        </aside>

        {/* RIGHT COLUMN */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#050505] overflow-y-auto relative">
          {/* STICKY PRODUCT HEADER */}
          {props.productHeader && (
            <div className="sticky top-[0px] w-full z-20 shrink-0">
              {props.productHeader}
            </div>
          )}

          {/* MAIN PRODUCT GRID */}
          <main className="flex-1">{props.productGrid}</main>
        </div>
      </div>
    </div>
  );
}
