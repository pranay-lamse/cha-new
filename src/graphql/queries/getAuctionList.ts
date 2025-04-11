export const GET_AUCTION_LIST = `
  query GetAbout {
    page(id: "my-account/uwa-auctions/?bid_status=lost", idType: URI) {
      title
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
        }
      }
      seo {
        title
        description
        canonicalUrl
      }
    }
  }
`;
