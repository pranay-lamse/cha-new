export const GET_SINGLE_AUCTION_DATA = `
query GetSingleAuction($id: ID!) {
  auctionProduct(id: $id, idType: DATABASE_ID) {
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
}`;
