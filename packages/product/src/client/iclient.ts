import { ApiResponse } from "@repo/utility/http";
import { ProductCardFetchResponse, SelectedFilterState } from "src/sku/types";

export interface IProductClient {
  health(): Promise<ApiResponse<boolean>>;
  fetchProductCards(
    filters: SelectedFilterState,
    pageSize: number,
    page: number
  ): Promise<ApiResponse<ProductCardFetchResponse>>;
}
