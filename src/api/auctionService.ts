import axiosClient from "./axiosClient";

export const fetchAuctionProducts = async () => {
  const GET_AUCTIONS_QUERY = `
    query HomeQuery {
      auctionProducts(first: 10) {
        nodes {
          databaseId
          title
          shortDescription
          slug
          type
          salePrice
          regularPrice
          price
          featuredImage {
            node {
              sourceUrl
              srcSet
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
      }
    }
  `;

  try {
    const response = await axiosClient.post("", { query: GET_AUCTIONS_QUERY });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching auction products:", error);
    return null;
  }
};
