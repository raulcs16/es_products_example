import { IStateStore } from "@/src/utils/istate_store";
import { ProductState } from "./state";
import {
  CategoryBucket,
  ProductCardDocument,
  SelectedFilterState,
  SpecBucket,
  VisibleFilters,
} from "@repo/product/sku/types";

export class ProductStore {
  constructor(private store: IStateStore<ProductState>) {}

  private get state(): ProductState {
    return this.store.getState();
  }
  public get pageSize(): number {
    return this.state.pageSize;
  }
  public get page(): number {
    return this.state.page;
  }
  public updatePage(page: number): void {
    this.store.setState((prev) => ({
      ...prev,
      page,
    }));
  }
  public get totalHits(): number {
    return this.state.totalHits;
  }
  public get parentCategories(): CategoryBucket[] {
    const categories = this.state.categories;
    return categories.filter((cat) => cat.parentId === "NULL");
  }
  public getChildrenCategories(parentId: string): CategoryBucket[] {
    const categories = this.state.categories;
    return categories.filter((cat) => cat.parentId === parentId);
  }
  public get selectedCategories(): CategoryBucket[] {
    return this.categories.filter((cat) =>
      this.state.selectedCategories.includes(cat.id)
    );
  }
  public get categories(): CategoryBucket[] {
    const state = this.state;
    return this.state.categories;
  }
  public get certifications(): SpecBucket[] {
    const state = this.state;
    return this.state.certs.filter((item) =>
      state.visibleCerts.includes(item.name)
    );
  }

  public get frames(): SpecBucket[] {
    const state = this.state;
    return this.state.frames.filter((item) =>
      state.visibleFrames.includes(item.name)
    );
  }

  public get weights(): SpecBucket[] {
    const state = this.state;
    return this.state.weights.filter((item) =>
      state.visibleWeights.includes(item.name)
    );
  }

  public get shafts(): SpecBucket[] {
    const state = this.state;
    return this.state.shafts.filter((item) =>
      state.visibleShafts.includes(item.name)
    );
  }
  public get productCards(): ProductCardDocument[] {
    const cards = this.store.getState().productCards;
    return cards;
  }
  public get activeFilters(): SelectedFilterState {
    const state = this.state;
    const filters: SelectedFilterState = {
      selectedCategories: state.selectedCategories,
      selectedCerts: state.selectedCerts,
      selectedFrames: state.selectedFrames,
      selectedShafts: state.selectedShafts,
      selectedWeights: state.selectedWeights,
    };
    return filters;
  }
  public get activeCategories(): string[] {
    return this.state.selectedCategories;
  }
  public get activeCerts(): string[] {
    return this.state.selectedCerts;
  }
  public removeCert(id: string) {
    this.store.setState((prev) => {
      const selectedCerts = prev.selectedCerts.filter((id) => id !== id);
      return {
        ...prev,
        selectedCerts,
      };
    });
  }

  public get activeWeights(): string[] {
    return this.state.selectedWeights;
  }
  public removeWeight(id: string) {
    this.store.setState((prev) => {
      const selectedWeights = prev.selectedWeights.filter((id) => id !== id);
      return {
        ...prev,
        selectedWeights,
      };
    });
  }
  public get activeShafts(): string[] {
    return this.state.selectedShafts;
  }
  public removeShaft(id: string) {
    this.store.setState((prev) => {
      const selectedShafts = prev.selectedShafts.filter((id) => id !== id);
      return {
        ...prev,
        selectedShafts,
      };
    });
  }
  public updateProductCards(
    cards: ProductCardDocument[],
    totalHits: number
  ): void {
    this.store.setState((prev) => ({
      ...prev,
      productCards: cards,
      totalHits,
    }));
  }
  public updateFilters(
    filters: SelectedFilterState,
    visibleFilters: VisibleFilters
  ) {
    this.store.setState((prev) => ({
      ...prev,
      ...filters,
      ...visibleFilters,
    }));
  }
  public existsActiveFilters(): boolean {
    const filters = this.activeFilters;
    return (
      filters.selectedCategories.length > 0 ||
      filters.selectedCerts.length > 0 ||
      filters.selectedFrames.length > 0 ||
      filters.selectedShafts.length > 0 ||
      filters.selectedWeights.length > 0
    );
  }
  public reset(): void {
    this.store.setState((prev) => ({
      ...prev,
      selectedCategories: [],
      selectedFlags: [],
      selectedCerts: [],
      selectedProtocols: [],
      selectedEncoders: [],
      selectedShafts: [],
      selectedWeights: [],
      visibleCategories: prev.categories.map((item) => item.id),
      visibleCerts: prev.certs.map((item) => item.name),
      visibleProtocols: prev.certs.map((item) => item.name),
      visibleShafts: prev.shafts.map((item) => item.name),
      visibleWeights: prev.weights.map((item) => item.name),
      visibleFrames: prev.frames.map((item) => item.name),
      productCards: [],
      totalHits: 0,
    }));
  }
}
