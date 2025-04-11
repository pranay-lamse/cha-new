export const GET_ABOUT = `
  query GetAbout {
    page(id: "about", idType: URI) {
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
