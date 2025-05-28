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
  const [bidStatus, setBidStatus] = useState<string>("active");

  const token = getToken();

  // ✅ Extract order ID from URL
  const getOrderIdFromPath = (): string | null => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      return pathParts[pathParts.length - 1] || null;
    }
    return null;
  };

  const orderId = getOrderIdFromPath();

  const fetchData = async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);

    try {
      const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/my-account/orders/${orderId}`;
      const data = await fetchHtmlData(url);
      setHtmlContent(data);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      setHtmlContent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bidStatusValue = params.get("bid_status") || "active";
    setBidStatus(bidStatusValue);
  }, []);

  useEffect(() => {
    fetchData();
  }, [orderId]);

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] px-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 myaccount-info">
        <div className="col-span-1">
          <MenuPage />
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: filterHTMLContent(htmlContent || "", [
                "woocommerce-MyAccount-content",
              ]),
            }}
            className="text-gray-700"
          ></div>
        )}
      </div>
    </div>
  );
}
