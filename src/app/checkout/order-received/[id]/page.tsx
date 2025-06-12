"use client";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    jQuery?: any;
  }
}

import { useRouter } from "next/navigation"; // Import useRouter for redirection
import Loader from "@/components/Loader";
import { fetchHtmlData } from "@/lib/fetchHtmlData";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import axios from "axios";
import { getToken } from "@/utils/storage";

import { usePathname, useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = getToken();

  // Fetch bidStatus from URL search parameters on mount

  const pathname = usePathname(); // e.g. "/checkout/order-received/17139"
  const searchParams = useSearchParams(); // for key=...

  const [finalUrl, setFinalUrl] = useState("");

  useEffect(() => {
    const orderKey = searchParams.get("key"); // get 'key' param
    const pathSegments = pathname.split("/"); // split path
    const orderId = pathSegments[pathSegments.length - 1]; // get last segment = orderId

    if (orderId && orderKey) {
      const newUrl = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/checkout/order-received/${orderId}/?key=${orderKey}`;
      setFinalUrl(newUrl);

      // optional: auto send request
      // fetch(newUrl).then(res => res.text()).then(console.log);
    }
  }, [pathname, searchParams]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    if (finalUrl) {
      try {
        const data = await axios.get(finalUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        if (data && data.data) {
          setHtmlContent(data.data);
        }
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
        setHtmlContent(null);
      } finally {
        setLoading(false);
      }
    }
  };
  // Fetch HTML content based on bidStatus
  useEffect(() => {
    fetchData();
  }, []); // Fetch data when bidStatus changes

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1000px] my-10 sm:my-20 uwa-auctions-page px-3 md:px-0 checkout-page order-received">
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
