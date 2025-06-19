"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
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

  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/my-account/orders`; // ✅ Dynamic URL
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
    const handleCancelClick = async (e: Event) => {
      const target = e.target as HTMLElement;

      // Look for anchor element with class 'cancel'
      if (target && target.closest("a.cancel")) {
        const anchor = target.closest("a.cancel") as HTMLAnchorElement;
        if (!anchor) return;

        e.preventDefault();

        const href = anchor.getAttribute("href");
        if (!href) return;

        console.log("Cancelling order via href:", href);

        // Parse the full URL to get path and query
        const urlObj = new URL(href, window.location.origin);
        const cleanPathWithQuery = urlObj.pathname + urlObj.search;

        // Build full API URL
        const fullURL = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}${cleanPathWithQuery}`;

        try {
          anchor.classList.add("loading");

          await axios.get(fullURL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });

          // Optionally trigger WooCommerce event or your own logic
          console.log("Order cancelled successfully");

          // Re-fetch data to reflect cancellation
          fetchData();
        } catch (error) {
          console.error("Failed to cancel order:", error);
        } finally {
          anchor.classList.remove("loading");
        }
      }
    };

    document.addEventListener("click", handleCancelClick);

    return () => {
      document.removeEventListener("click", handleCancelClick);
    };
  }, [htmlContent]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container  mx-auto w-full sm:w-11/12 lg:w-[1170px] px-2">
      <div className="e-my-account-tab e-my-account-tab__dashboard">
        <div className="woocommerce myaccount-info">
          <div className="woocommerce-MyAccount-navigation col-span-1">
            <MenuPage />
          </div>
          <div className="woocommerce-MyAccount-content-outer">
            {loading ? (
              <Loader />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: filterHTMLContent(htmlContent || "", [
                    "woocommerce-MyAccount-content",
                  ]),
                }}
                className="woocommerce-MyAccount-content-inner"
              ></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
