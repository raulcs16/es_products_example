import ProductStoreLayout from "@/src/imports/layout/ProductStoreLayout";
import { FetchFilters } from "@/src/products/api/fetchFilters";
import ActiveFiltersComponent from "@/src/products/components/ActiveFilters";
import CategoryHeaderComponent from "@/src/products/components/CategoryHeader";
import FilterSideBarComponent from "@/src/products/components/FilterSideBar";
import ProductCatalogHeaderComponent from "@/src/products/components/ProductHeaderComp";
import ProductsGridComponent from "@/src/products/components/ProductsGrid";
import SearchBarComponent from "@/src/products/components/SearchBar";
import { ProductContextProvider } from "@/src/products/context/ProductContext";

export default async function Home() {
  const initState = await FetchFilters();
  return (
    <main className="h-full bg-bg selection:bg-highlight selection:text-bg-dark">
      <ProductContextProvider initState={initState}>
        <ProductStoreLayout
          searchBar={<SearchBarComponent></SearchBarComponent>}
          categoryHeader={<CategoryHeaderComponent></CategoryHeaderComponent>}
          activeFiltersBar={<ActiveFiltersComponent></ActiveFiltersComponent>}
          productHeader={
            <ProductCatalogHeaderComponent></ProductCatalogHeaderComponent>
          }
          filterSidebar={<FilterSideBarComponent></FilterSideBarComponent>}
          productGrid={<ProductsGridComponent></ProductsGridComponent>}
        ></ProductStoreLayout>
      </ProductContextProvider>
    </main>
  );
}
