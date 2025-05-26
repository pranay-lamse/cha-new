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

  useEffect(() => {
    const form = document.querySelector(
      ".woocommerce-cart-form"
    ) as HTMLFormElement;

    const handleCartCouponSubmit = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      const input = form.querySelector("#coupon_code") as HTMLInputElement;
      const couponCode = input?.value;

      if (!couponCode) {
        alert("Please enter a coupon code");
        return;
      }

      const submitButton = form.querySelector(
        "button[name='apply_coupon']"
      ) as HTMLButtonElement;

      submitButton.disabled = true;
      submitButton.textContent = "Applying...";

      const runAsync = async () => {
        try {
          const baseURL = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-json/custom/v1/apply_coupon`;

          const payload = new URLSearchParams();
          payload.append("coupon_code", couponCode);
          payload.append("security", "edd75dde8a"); // adjust nonce if needed

          await axios.post(baseURL, payload.toString(), {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });

          alert("Coupon applied successfully");
          // Optional: refresh page or cart section
          window.location.reload(); // or dynamically update cart totals
        } catch (err) {
          console.error("Error applying coupon:", err);
          alert("Failed to apply coupon");
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = "Apply coupon";
        }
      };

      runAsync();
    };

    if (form) {
      form.addEventListener("submit", handleCartCouponSubmit);
    }

    return () => {
      form?.removeEventListener("submit", handleCartCouponSubmit);
    };
  }, [token]);

  useEffect(() => {
    const handleRemoveCouponClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        target.classList.contains("woocommerce-remove-coupon") &&
        target instanceof HTMLAnchorElement
      ) {
        e.preventDefault();
        e.stopPropagation();

        const couponCode = target.getAttribute("data-coupon");
        const billingEmailInput =
          document.querySelector<HTMLInputElement>("#billing_email");

        if (!couponCode) {
          alert("Coupon code not found");
          return;
        }

        const runAsyncRemove = async () => {
          try {
            const baseURL = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-json/custom/v1/remove_coupon`;

            const payload = new URLSearchParams();
            payload.append("coupon_code", couponCode);
            payload.append("billing_email", billingEmailInput?.value || "");

            await axios.post(baseURL, payload.toString(), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            });

            fetchData();

            // Optional: refresh or update UI after removal
          } catch (err) {
            console.error("Error removing coupon:", err);
            alert("Failed to remove coupon");
          }
        };

        runAsyncRemove();
      }
    };

    document.addEventListener("click", handleRemoveCouponClick);

    return () => {
      document.removeEventListener("click", handleRemoveCouponClick);
    };
  }, [token]);

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
