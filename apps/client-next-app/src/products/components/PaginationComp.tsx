"use client";

import DotNavigation from "@/src/imports/controls/DotNavigation";
import {
  useProductController,
  useProductStore,
} from "../context/ProductContext";

export default function PaginationComponent() {
  const store = useProductStore();
  const controller = useProductController();

  const pageSize = store.pageSize;
  const page = store.page;
  const hits = store.totalHits;

  const totalPages = Math.ceil(hits / pageSize) || 1;

  if (totalPages <= 1) {
    return null; // Hide pagination if there's only 1 page or no results
  }

  return (
    <DotNavigation
      total={totalPages}
      currentIndex={page - 1}
      onIndexSelect={(index) => controller.setPage(index + 1)}
    ></DotNavigation>
  );
}
