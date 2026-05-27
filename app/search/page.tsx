import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? "results" : "result";

  // Fetch recommended products when no results found
  const recommendedProducts =
    searchValue && products.length === 0
      ? await getProducts({ sortKey: "BEST_SELLING", reverse: false }).then(
          (p) => p.slice(0, 4)
        )
      : [];

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? "没有找到匹配 "
            : `找到 ${products.length} 个${resultsText}，搜索 `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
      {searchValue && products.length === 0 && recommendedProducts.length > 0 ? (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-medium">为您推荐</h2>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <ProductGridItems products={recommendedProducts} />
          </Grid>
        </div>
      ) : null}
    </>
  );
}
