"use client";
import React, { useEffect, useState } from "react";

import MenuPage from "@/components/my-account-menu/page";
import Loader from "@/components/Loader";
import { fetchHtmlData } from "@/lib/fetchHtmlData";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import { toast } from "react-toastify";

export default function EditAccountPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [bidStatus, setBidStatus] = useState("active");

  // ✅ Get bid_status from query string without Suspense
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const status = params.get("bid_status") || "active";
      setBidStatus(status);
    }
  }, []);

  // ✅ Move URL definition outside the conditional block
  const url = bidStatus
    ? `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/my-account/uwa-auctions?bid_status=${bidStatus}`
    : `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/my-account/uwa-auctions?display=watchlist`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchHtmlData(url);
        setHtmlContent(data);
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
        setHtmlContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bidStatus, url]); // ✅ make sure url is in the dependency array

  const handleRemoveClick = async (auctionId: string) => {
    try {
      const url2 = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-admin/admin-ajax.php?post_id=${auctionId}&uwa-ajax=watchlist`;

      const response = await fetchHtmlData(url2);

      if (response) {
        toast.success("Item removed successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Error removing item.");
    }
  };

  useEffect(() => {
    const container = document.querySelector(
      ".woocommerce-MyAccount-content-wrapper"
    );

    if (container) {
      const clickHandler = (event: Event) => {
        const target = (event.target as HTMLElement).closest(".remove-uwa");

        if (target) {
          const auctionId = target.getAttribute("data-auction-id");
          if (auctionId) {
            handleRemoveClick(auctionId);
          }
        }
      };

      container.addEventListener("click", clickHandler);

      return () => {
        container.removeEventListener("click", clickHandler);
      };
    }
  }, [htmlContent]);

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] my-10 sm:my-20 uwa-auctions-page px-3 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 myaccount-info">
        <div className="col-span-1">
          <MenuPage />
        </div>
        <div className="col-span-1 md:col-span-3 md:pl-[60px]">
          {loading ? (
            <Loader />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: filterHTMLContent(
                  htmlContent || "",
                  ["woocommerce-MyAccount-content"],
                  handleRemoveClick
                ),
              }}
              className="text-gray-700"
            />
          )}
        </div>
      </div>
    </div>
  );
}
