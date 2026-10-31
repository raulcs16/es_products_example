import {
  CategoryBucket,
  ProductCardDocument,
  SpecBucket,
} from "@repo/product/sku/types";

export type ProductState = {
  categories: CategoryBucket[];
  certs: SpecBucket[];
  weights: SpecBucket[];
  frames: SpecBucket[];
  shafts: SpecBucket[];

  selectedCategories: string[];
  selectedCerts: string[];
  selectedWeights: string[];
  selectedShafts: string[];
  selectedFrames: string[];

  visibleCategories: string[];
  visibleCerts: string[];
  visibleWeights: string[];
  visibleShafts: string[];
  visibleFrames: string[];

  productCards: ProductCardDocument[];

  pageSize: number;
  page: number;
  totalHits: number;
};
