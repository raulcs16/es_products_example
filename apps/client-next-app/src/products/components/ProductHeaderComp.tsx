"use client";

import { useProductStore } from "../context/ProductContext";
import PaginationComponent from "./PaginationComp";

export default function ProductCatalogHeaderComponent() {
  const store = useProductStore();
  const hits = store.totalHits;

  return (
    <div className="w-full h-15 px-6 flex items-center justify-between z-20 shrink-0 bg-bg-dark backdrop-blur-md shadow-lg">
      {/* Left: Title & Context */}
      <h2 className="text-lg  text-primary tracking-wide">Product Catalog:</h2>

      {/* Center: Dot Pagination */}
      <div className="flex items-center justify-center flex-1 px-4">
        <PaginationComponent />
      </div>

      {/* Right: Total Items Count */}
      <div className="text-xs  font-mono shrink-0">
        <strong className="text-secondary">{hits}</strong> items
      </div>
    </div>
  );
}
