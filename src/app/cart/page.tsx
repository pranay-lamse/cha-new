"use client";
import React, { useEffect, useState } from "react";

import MenuPage from "@/components/my-account-menu/page";
import Loader from "@/components/Loader";
import { fetchHtmlData } from "@/lib/fetchHtmlData";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import { getToken } from "@/utils/storage";
import axios from "axios";
export default function EditAccountPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bidStatus, setBidStatus] = useState<string>("active"); // State to store bidStatus
  const token = getToken();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bidStatusValue = params.get("bid_status") || "active"; // Fallback to 'active'
    setBidStatus(bidStatusValue); // Set bidStatus in the state
  }, []); // This effect runs only once after the component mounts

  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/cart`; // ✅ Dynamic URL
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchHtmlData(url); // ✅ Pass URL dynamically
      setHtmlContent(data);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      setHtmlContent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bidStatus]);

  useEffect(() => {
    // Define click handler
    const handleRemoveClick = async (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.matches("a.remove")) {
        e.preventDefault(); // Prevent default navigation

        const href = target.getAttribute("href");

        if (href) {
          console.log("Removing item with href:", href);
          // Optionally: Extract the remove_item and _wpnonce from the URL
          const url = new URL(href, window.location.origin);
          const removeItem = url.searchParams.get("remove_item");
          const nonce = url.searchParams.get("_wpnonce");

          // Example: Log or send request
          console.log("Removing item:", removeItem, "Nonce:", nonce);

          const urlObj = new URL(url);

          // Get path + query
          const cleanUrl = urlObj.pathname + urlObj.search;

          // Send request (example with fetch)
          if (href && token) {
            const fullURL = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}${cleanUrl}`;
            try {
              await axios.get(fullURL, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
              });

              // Manually trigger WooCommerce event
              const $button = $(target);
              $("body").trigger("added_to_cart", [{}, "", $button]);

              // Add the 'added' class after successful add to cart
              target.classList.add("added");
            } catch (error) {
              console.error("Add to cart failed:", error);
            } finally {
              fetchData(); // Re-fetch data after removing item
              target.classList.remove("loading"); // remove loading class after request finishes
            }
          } else {
            target.classList.remove("loading");
          }
        }
      }
    };

    // Add listener
    document.addEventListener("click", handleRemoveClick);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("click", handleRemoveClick);
    };
  }, [htmlContent]);

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1000px] my-10 sm:my-20 uwa-auctions-page px-3 md:px-0 checkout-page cart-page">
      {loading ? (
        <Loader />
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: filterHTMLContent(htmlContent || "", ["site-main"]),
          }}
          className="text-gray-700"
        ></div>
      )}
    </div>
  );
}
