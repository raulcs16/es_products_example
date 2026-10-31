import {
  SelectedFilterState,
  ProductCardDocument,
  ProductCardFetchResponse,
  ProductImage,
  VisibleFilters,
} from "src/sku/types";
import { IProductClient } from "./iclient";
import {
  APIError,
  ApiResponse,
  APISuccess,
  HTTP_METHODS,
  NETWORK_ERROR,
  RequestOptions,
} from "@repo/utility/http";

export default class ProductFetchClient implements IProductClient {
  constructor(private readonly baseUrl: string) {}
  private async request<T>({
    path,
    method,
    body,
  }: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${path}`;
      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      });
      return (await resp.json()) as ApiResponse<T>;
    } catch {
      return NETWORK_ERROR;
    }
  }
  public async health(): Promise<ApiResponse<boolean>> {
    const resp: APISuccess<boolean> = {
      success: true,
      data: true,
      message: "im healthy",
    };
    return resp;
  }
  private buildFilterClauses(filters: SelectedFilterState): any[] {
    const filterClauses: any[] = [];

    if (filters.selectedCategories.length > 0) {
      filterClauses.push({
        terms: { "categories.id.keyword": filters.selectedCategories },
      });
    }
    if (filters.selectedCerts.length > 0) {
      filterClauses.push({
        terms: { "certIcons.specName.keyword": filters.selectedCerts },
      });
    }
    if (filters.selectedShafts.length > 0) {
      filterClauses.push({
        terms: { "specsMap.Shaft Diameter.keyword": filters.selectedShafts },
      });
    }
    if (filters.selectedWeights.length > 0) {
      filterClauses.push({
        terms: { "specsMap.Weight.keyword": filters.selectedWeights },
      });
    }
    if (filters.selectedFrames.length > 0) {
      filterClauses.push({
        terms: { "specsMap.Frame Size.keyword": filters.selectedFrames },
      });
    }

    return filterClauses;
  }
  public async fetchSpecNames(filterClauses: any[]) {
    const query =
      filterClauses.length > 0
        ? { bool: { filter: filterClauses } }
        : { match_all: {} };
    const requestBody = {
      size: 0,
      query: query,
      aggs: {
        spec_names: {
          terms: {
            field: "specNames",
            size: 100,
          },
        },
      },
    };
    try {
      const response = await fetch("http://127.0.0.1:9200/products/_search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(`Elasticsearch query failed: ${response.statusText}`);
      }
      const data = await response.json();
      const totalHits = data?.hits?.total?.value || 0;
      const aggs = data?.aggregations || {};
      const specNameBuckets = aggs.spec_names?.buckets || [];
      console.log("hits", totalHits);
      console.log(specNameBuckets);
    } catch (err) {
      return err;
    }
  }
  public async fetchProductCards(
    filters: SelectedFilterState,
    pageSize: number = 24,
    page: number = 1
  ): Promise<ApiResponse<ProductCardFetchResponse>> {
    const filterClauses = this.buildFilterClauses(filters);
    await this.fetchSpecNames(filterClauses);
    const query =
      filterClauses.length > 0
        ? { bool: { filter: filterClauses } }
        : { match_all: {} };
    const requestBody = {
      size: pageSize,
      from: (page - 1) * pageSize,
      _source: ["name", "sku", "shortDesc", "images"],
      query: query,
      aggs: {
        categories: {
          terms: { field: "categories.id.keyword", size: 100 },
        },
        certifications: {
          terms: { field: "certIcons.specName.keyword", size: 100 },
        },
        shaft_diameters: {
          terms: { field: "specsMap.Shaft Diameter.keyword", size: 100 },
        },
        weights: {
          terms: { field: "specsMap.Weight.keyword", size: 100 },
        },
        all_catalog_specs: {
          nested: {
            path: "specs",
          },
          aggs: {
            spec_names: {
              terms: {
                field: "specs.name.keyword",
                size: 150, // Pulls back all your spec keys dynamically!
              },
              aggs: {
                spec_values: {
                  terms: {
                    field: "specs.value.keyword",
                    size: 50, // Pulls back the available options for each spec
                  },
                },
              },
            },
          },
        },
      },
    };
    try {
      const response = await fetch("http://127.0.0.1:9200/products/_search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(`Elasticsearch query failed: ${response.statusText}`);
      }
      const data = await response.json();
      // 3. Parse Product Cards
      const hits = data?.hits?.hits || [];
      const totalHits = data?.hits?.total?.value || 0;
      const products: ProductCardDocument[] = hits.map((hit: any) => {
        const images: ProductImage[] = hit._source?.images || [];
        return {
          id: hit._id,
          name: hit._source?.name || "",
          sku: hit._source?.sku || "",
          shortDesc: hit._source?.shortDesc || "",
          images,
        };
      });
      const aggs = data?.aggregations || {};

      const categoryBuckets = aggs.categories?.buckets || [];
      const certBuckets = aggs.certifications?.buckets || [];
      const weightBuckets = aggs.weights?.buckets || [];
      const shaftBuckets = aggs.shaft_diameters?.buckets || [];
      const specBuckets = aggs.all_catalog_specs?.buckets || [];
      console.log("spec_bucket", specBuckets);

      const visibleFilters: VisibleFilters = {
        visibleCategories: categoryBuckets.map((b: any) => b.key),
        visibleCerts: certBuckets.map((b: any) => b.key),
        visibleShafts: shaftBuckets.map((b: any) => b.key),
        visibleWeights: weightBuckets.map((b: any) => b.key),
      };

      const res: APISuccess<ProductCardFetchResponse> = {
        success: true,
        data: { products, productCount: totalHits, visibleFilters },
        message: "products retrieved",
      };
      return res;
    } catch (error) {
      console.error("Error fetching product cards:", error);

      const err: APIError = {
        success: false,
        code: "PRODUCT_INDEX_FAILED",
        message: "unable to search for products",
        errors: [],
      };
      return err;
    }
  }
}
