import { CategoryBucket, SpecBucket } from "@repo/product/sku/types";
import { ProductState } from "../context/state";

export async function FetchFilters(): Promise<ProductState> {
  let state: ProductState = {
    categories: [],
    certs: [],
    shafts: [],
    weights: [],
    frames: [],
    selectedCategories: [],
    selectedCerts: [],
    selectedShafts: [],
    selectedWeights: [],
    selectedFrames: [],

    visibleCategories: [],
    visibleCerts: [],
    visibleShafts: [],
    visibleWeights: [],
    visibleFrames: [],

    productCards: [],

    pageSize: 25,
    page: 1,
    totalHits: 0,
  };
  try {
    const requestBody = {
      size: 0,
      aggs: {
        categories: {
          terms: { field: "breadcrumbs", size: 100 },
        },
        certifications: {
          terms: { field: "certIcons.specName.keyword", size: 100 },
        },
        weights: {
          terms: { field: "specsMap.Weight.keyword", size: 100 },
        },
        frames: {
          terms: { field: "specsMap.Frame Size.keyword", size: 100 },
        },
        shaft_diameters: {
          terms: { field: "specsMap.Shaft Diameter.keyword", size: 100 },
        },
      },
    };
    const response = await fetch("http://127.0.0.1:9200/products/_search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      throw new Error(`Elasticsearch query failed: ${response.statusText}`);
    }
    const data = await response.json();
    const aggs = data?.aggregations || {};

    const categoryBuckets: [] = aggs.categories?.buckets || [];
    const certBuckets = aggs.certifications?.buckets || [];
    const weightBuckets = aggs.weights?.buckets || [];
    const frameBuckets = aggs.frames?.buckets || [];

    const shaftBuckets = aggs.shaft_diameters?.buckets || [];

    const cats: CategoryBucket[] = categoryBuckets.map((bucket: any) => {
      const tokens = (bucket.key as string).split(".");
      return {
        id: tokens[0],
        name: tokens[1],
        parentId: tokens[2],
        productCount: bucket.doc_count,
      };
    });
    const certs: SpecBucket[] = certBuckets.map((bucket: any) => ({
      name: bucket.key,
      productCount: bucket.doc_count,
    }));
    const weights: SpecBucket[] = weightBuckets.map((bucket: any) => ({
      name: bucket.key,
      productCount: bucket.doc_count,
    }));
    const frames: SpecBucket[] = frameBuckets.map((b: any) => ({
      name: b.key,
      productCount: b.doc_count,
    }));
    const shafts: SpecBucket[] = shaftBuckets.map((bucket: any) => ({
      name: bucket.key,
      productCount: bucket.doc_count,
    }));

    state.categories = cats;
    state.certs = certs;
    state.weights = weights;
    state.shafts = shafts;
    state.frames = frames;

    state.visibleCategories = cats.map((item) => item.id);
    state.visibleCerts = certs.map((item) => item.name);
    state.visibleWeights = weights.map((item) => item.name);
    state.visibleShafts = shafts.map((item) => item.name);
    state.visibleFrames = frames.map((item) => item.name);
  } catch (err) {
  } finally {
    return state;
  }
}
