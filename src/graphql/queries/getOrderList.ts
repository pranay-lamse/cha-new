export const GET_AUCTION_ORDERS = `
query GetAuctionOrders($first: Int!, $after: String) {
  orders(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      databaseId
      status
      total
      date
      orderNumber
      createdVia
      customer {
        databaseId
        email
        firstName
        lastName
      }
      lineItems {
        nodes {
          product {
            node {
              databaseId
              name
            }
          }
          quantity
          total

        }
      }
    }
  }
}

`;
