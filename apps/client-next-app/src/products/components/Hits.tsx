"use client";

import { useProductStore } from "../context/ProductContext";

export default function HitsComponent() {
  const hits = useProductStore().totalHits;
  return <span>{hits}</span>;
}
