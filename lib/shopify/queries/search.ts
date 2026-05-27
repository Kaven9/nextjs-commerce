import imageFragment from "../fragments/image";

export const getSearchSuggestionsQuery = /* GraphQL */ `
  query getSearchSuggestions($query: String!, $first: Int = 5) {
    predictiveSearch(query: $query, first: $first, types: [PRODUCT]) {
      products {
        id
        handle
        title
        featuredImage {
          ...image
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
  ${imageFragment}
`;
