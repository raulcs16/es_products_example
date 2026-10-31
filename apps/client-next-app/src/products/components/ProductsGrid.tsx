"use client";

import {
  useProductController,
  useProductStore,
} from "../context/ProductContext";
import ProductCardGrid from "../imports/ProductCardGrid";

export default function ProductsGridComponent() {
  const store = useProductStore();
  const controller = useProductController();
  return (
    <ProductCardGrid
      productCards={store.productCards}
      onCardSelected={controller.handleProductCardSelected}
    ></ProductCardGrid>
  );
}
