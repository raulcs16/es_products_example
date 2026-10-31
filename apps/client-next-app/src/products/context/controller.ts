import INavigator from "@/src/utils/inavigator";
import { IProductClient } from "@repo/product/client/iclient";
import { ProductStore } from "./store";
import { ApiResponse } from "@repo/utility/http";
import {
  ProductCardFetchResponse,
  SelectedFilterState,
} from "@repo/product/sku/types";

export class ProductController {
  constructor(
    private store: ProductStore,
    private router: INavigator,
    private client: IProductClient
  ) {}

  private async updateProductFilters(
    filters: SelectedFilterState
  ): Promise<void> {
    const pageSize = this.store.pageSize;
    const page = this.store.page;
    const resp: ApiResponse<ProductCardFetchResponse> =
      await this.client.fetchProductCards(filters, pageSize, page);
    if (!resp.success) {
      console.log(resp.message);
      return;
    }
    const data: ProductCardFetchResponse = resp.data;
    this.store.updateProductCards(data.products, data.productCount);
    this.store.updateFilters(filters, data.visibleFilters);
  }

  /** Helper to reset page to 1 whenever filters change */
  private async applyFilterChange(filters: SelectedFilterState): Promise<void> {
    this.store.updatePage(1);
    await this.updateProductFilters(filters);
  }

  public toggleCategory = async (id: string): Promise<void> => {
    const currentCategories = this.store.activeFilters.selectedCategories;
    const updatedCategories = currentCategories.includes(id)
      ? currentCategories.filter((key) => key !== id)
      : [...currentCategories, id];

    await this.applyFilterChange({
      ...this.store.activeFilters,
      selectedCategories: updatedCategories,
    });
  };

  public toggleCert = async (id: string): Promise<void> => {
    const currentCerts = this.store.activeFilters.selectedCerts;
    const updatedCerts = currentCerts.includes(id)
      ? currentCerts.filter((key) => key !== id)
      : [...currentCerts, id];

    await this.applyFilterChange({
      ...this.store.activeFilters,
      selectedCerts: updatedCerts,
    });
  };

  public toggleWeight = async (id: string): Promise<void> => {
    const current = this.store.activeFilters.selectedWeights;
    const updated = current.includes(id)
      ? current.filter((key) => key !== id)
      : [...current, id];

    await this.applyFilterChange({
      ...this.store.activeFilters,
      selectedWeights: updated,
    });
  };

  public toggleShaft = async (id: string): Promise<void> => {
    const current = this.store.activeFilters.selectedShafts;
    const updated = current.includes(id)
      ? current.filter((key) => key !== id)
      : [...current, id];

    await this.applyFilterChange({
      ...this.store.activeFilters,
      selectedShafts: updated,
    });
  };
  public toggleFrame = async (id: string): Promise<void> => {
    const current = this.store.activeFilters.selectedFrames;
    const updated = current.includes(id)
      ? current.filter((key) => key !== id)
      : [...current, id];

    await this.applyFilterChange({
      ...this.store.activeFilters,
      selectedFrames: updated,
    });
  };

  public setPage = async (page: number): Promise<void> => {
    if (page < 1) return;
    this.store.updatePage(page);
    // Page changes use direct fetch without resetting page back to 1
    await this.updateProductFilters(this.store.activeFilters);
  };

  public clearSelectedCategory = async (): Promise<void> => {
    await this.applyFilterChange({
      ...this.store.activeFilters,
      selectedCategories: [],
    });
  };

  public clearSelectedCerts = async (): Promise<void> => {
    await this.applyFilterChange({
      ...this.store.activeFilters,
      selectedCerts: [],
    });
  };

  public clearSelectedWeights = async (): Promise<void> => {
    await this.applyFilterChange({
      ...this.store.activeFilters,
      selectedWeights: [],
    });
  };

  public clearSelectedShafts = async (): Promise<void> => {
    await this.applyFilterChange({
      ...this.store.activeFilters,
      selectedShafts: [],
    });
  };
  public clearSelectedFrames = async (): Promise<void> => {
    await this.applyFilterChange({
      ...this.store.activeFilters,
      selectedFrames: [],
    });
  };
  public clearAllFilters = async (): Promise<void> => {
    this.store.reset();
  };
  public handleProductCardSelected = (id: string): void => {};
}
