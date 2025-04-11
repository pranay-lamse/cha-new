import gql from "graphql-tag";
export const GET_DATA_HOME = gql`
query HomeQuery($status: AuctionStatusEnum! = LIVE, $first: Int! = 10, $after: Int = 1, $field: AuctionsConnectionOrderbyEnum = TITLE, $order: AuctionsConnectionOrderEnum = DESC) {
  auctionProducts(where: {status: $status, orderby: {field: $field, order: $order}, paged: $after}, first: $first) {
    nodes {
      databaseId
      title(format: RENDERED)
      shortDescription(format: RENDERED)
      slug
      type
      salePrice(format: FORMATTED)
      regularPrice(format: FORMATTED)
      price(format: RAW)
      featuredImage {
        node {
          sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
          srcSet(size: LARGE)
        }
      }
      uri
      link
      dateStart
      dateEnd
      startPrice
      reservedPrice
      nextBids
      bidIncrement
      auctionCondition
      currentBid
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    found
  }
}`;
