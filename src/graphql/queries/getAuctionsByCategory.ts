export const GET_AUCTIONS_BY_CATEGORY = `
query productsByCategory($slug: String!, $first: Int! = 10, $field: ProductsOrderByEnum = NAME, $order: OrderEnum = ASC) {
  products(
    where: {orderby: {field:$field, order: $order}, category: $slug}
    first: $first
  ) {
    nodes {
      databaseId
      title(format: RENDERED)
      featured
      slug
      uri
      link
      type
      featuredImage {
        node {
          sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
          srcSet(size: LARGE)
        }
      }
      ... on SimpleProduct {
        name
        price(format: RAW)
        regularPrice(format: FORMATTED)
        salePrice(format: FORMATTED)
      }
        ... on AuctionProduct {
        name
        price(format: RAW)
        regularPrice(format: FORMATTED)
        salePrice(format: FORMATTED)
      }
      shortDescription(format: RENDERED)
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
`