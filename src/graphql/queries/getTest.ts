export const GET_TEST = `
  query GetTest {
    page(id: "my-account/uwa-auctions/?bid_status=active", idType: URI) {
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
