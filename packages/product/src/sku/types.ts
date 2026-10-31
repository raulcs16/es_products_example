export type ProductImage = {
  id: string;
  imageUrl: string;
  sortOrder: number;
};
export type ProductCardDocument = {
  id: string;
  name: string;
  sku: string;
  shortDesc: string;
  images: ProductImage[];
};
export type SelectedFilterState = {
  selectedCategories: string[];
  selectedCerts: string[];
  selectedWeights: string[];
  selectedFrames: string[];
  selectedShafts: string[];
};
export type CategoryBucket = {
  id: string;
  name: string;
  parentId: string | null;
  productCount: number;
};

export type SpecBucket = {
  name: string;
  productCount: number;
};
//should filter filters
export type VisibleFilters = {
  visibleCategories: string[];
  visibleCerts: string[];
  visibleShafts: string[];
  visibleWeights: string[];
};
export type ProductCardFetchResponse = {
  products: ProductCardDocument[];
  productCount: number;
  visibleFilters: VisibleFilters;
};
