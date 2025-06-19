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
import { useRouter } from "next/navigation";

export default function EditAccountPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = getToken();
  const router = useRouter();

  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/my-account/orders`;

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

  useEffect(() => {
    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a") as HTMLAnchorElement;

      if (!anchor || !anchor.href) return;

      const href = anchor.getAttribute("href");

      // ✅ Cancel Order logic
      if (anchor.classList.contains("cancel")) {
        e.preventDefault();
        if (!href) return;

        const urlObj = new URL(href, window.location.origin);
        const cleanPathWithQuery = urlObj.pathname + urlObj.search;
        const fullURL = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}${cleanPathWithQuery}`;

        try {
          anchor.classList.add("loading");

          await axios.get(fullURL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });

          fetchData(); // Refresh list
        } catch (error) {
          console.error("Failed to cancel order:", error);
        } finally {
          anchor.classList.remove("loading");
        }
        return;
      }

      // ✅ Redirect /checkout/order-pay/:id/... → /checkout?pay-uwa-auction=ORDER_ID
      if (
        href &&
        href.includes("/checkout/order-pay") &&
        anchor.hostname === window.location.hostname
      ) {
        e.preventDefault();

        try {
          const urlObj = new URL(href, window.location.origin);
          const orderPayMatch = urlObj.pathname.match(
            /\/checkout\/order-pay\/(\d+)/
          );

          if (orderPayMatch && orderPayMatch[1]) {
            const orderId = orderPayMatch[1];
            router.push(`/checkout?pay-uwa-auction=${orderId}`);
          } else {
            console.warn("Could not extract order ID from href:", href);
          }
        } catch (err) {
          console.error("Failed to parse href:", err);
        }

        return;
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [htmlContent]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] px-2">
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
