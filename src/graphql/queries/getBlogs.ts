export const GET_BLOG_POSTS = `
query GetBlogPosts($first: Int! = 20) {
  posts(first: $first) {
    nodes {
      id
      title
      content
      excerpt
      date
      slug
      uri
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      author {
        node {
          name
        }
      }
    }
  }
}`;


export const GET_BLOG_POST_BY_SLUG = `
query GetBlogPost($slug: ID!) {
  post(id: $slug, idType: SLUG) {
    id
    title
    content
    date
    slug
    uri
    excerpt
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    author {
      node {
        name
      }
    }
  }
}`;
