import { env } from "@/env";
import axios from "axios";
import { getToken } from "@/utils/storage";

export const placeAuctionBid = async ({
  productId,
  auctionId,
  bidAmount,
}: {
  productId: any;
  auctionId: any;
  bidAmount: any;
}) => {
  const token = getToken();

  const formData = new FormData();
  formData.append("uwa_bid_value", bidAmount.toString());
  formData.append("bid", auctionId.toString());
  formData.append("uwa-place-bid", auctionId.toString());
  formData.append("product_id", productId.toString());
  formData.append("user_id", "1"); // ⚠️ optional — WP will auto-detect user via JWT

  try {
    const response = await axios.post(
      `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-admin/admin-ajax.php?action=uwa_place_bid`, // 👈 replace if actual action is different
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Bid failed:", error.response?.data || error.message);
    return null;
  }
};
