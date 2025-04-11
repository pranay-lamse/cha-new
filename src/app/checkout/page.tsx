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

export default function CheckoutPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bidStatus, setBidStatus] = useState<string>("active"); // State to store bidStatus

  const router = useRouter();
  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/checkout`;

  // Fetch bidStatus from URL search parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bidStatusValue = params.get("bid_status") || "active"; // Fallback to 'active'
    setBidStatus(bidStatusValue); // Set bidStatus in the state
  }, []); // This effect runs only once after the component mounts

  // Fetch HTML content based on bidStatus
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
  }, [bidStatus]); // Fetch data when bidStatus changes

  // Load and attach jQuery script dynamically
  useEffect(() => {
    const loadJQuery = () => {
      if (typeof window !== "undefined") {
        if (!window.jQuery) {
          const script = document.createElement("script");
          script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
          script.async = true;
          script.onload = () => {
            console.log("jQuery Loaded");
            attachScripts();
          };
          document.body.appendChild(script);
        } else {
          console.log("jQuery already exists");
          attachScripts();
        }
      }
    };

    const attachScripts = () => {
      setTimeout(() => {
        if (window.jQuery) {
          console.log("Attaching jQuery event handlers...");
          window.jQuery(document).ready(function ($: any) {
            // Toggle coupon section
            $(".showcoupon")
              .off("click")
              .on("click", function (e: any) {
                e.preventDefault();
                $(".checkout_coupon").slideToggle();
              });

            // Redirect to checkout after order placement
            $(".place-order-button")
              .off("click")
              .on("click", function (e: any) {
                e.preventDefault();
                console.log("Order placed! Redirecting to checkout...");
                router.push("https://classichorseauction.com/stage/checkout"); // Redirect using Next.js router
              });
          });
        } else {
          console.error("jQuery not found!");
        }
      }, 1000); // Delay to ensure HTML content is loaded
    };

    loadJQuery();
  }, [htmlContent]); // Run when HTML content is updated

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1000px] my-10 sm:my-20 uwa-auctions-page px-3 md:px-0 checkout-page">
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
