"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import axios from "axios";
import { env } from "@/env";
import { getToken } from "@/utils/storage";
import { filterHTMLContent } from "@/utils/htmlHelper";

export default function CheckoutPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = getToken();

  const pathname = usePathname(); // e.g. "/checkout/order-received/17139"
  const searchParams = useSearchParams(); // e.g. key=wc_order_bZpTwACe8vy90

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const orderKey = searchParams.get("key");
        const pathSegments = pathname.split("/");
        const orderId = pathSegments[pathSegments.length - 1];

        if (!orderId || !orderKey) {
          setError("Invalid order details.");
          setLoading(false);
          return;
        }

        const finalUrl = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/checkout/order-received/${orderId}/?key=${orderKey}`;

        const response = await axios.get(finalUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response && response.data) {
          setHtmlContent(response.data);
        }
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
        setHtmlContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathname, searchParams]); // Ensure re-runs if URL changes

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1000px] my-10 sm:my-20 uwa-auctions-page px-3 md:px-0 checkout-page order-received">
      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div
          className="text-gray-700"
          dangerouslySetInnerHTML={{
            __html: filterHTMLContent(htmlContent || "", ["site-main"]),
          }}
        ></div>
      )}
    </div>
  );
}
