export const GET_PRIVACY_POLICY = `
query GetAbout {
    page(id: "privacy-policy", idType: URI) {
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



export const GET_TERMS_CONDITIONS = `
query GetAbout {
    page(id: "terms-conditions-buyers", idType: URI) {
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


export const GET__SELLER_TERMS_CONDITIONS = `
query GetAbout {
    page(id: "seller-terms-conditions", idType: URI) {
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



export const GET__COOKIE_POLICY = `
query GetAbout {
    page(id: "cookie-policy", idType: URI) {
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