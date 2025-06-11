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
export default function CheckoutPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bidStatus, setBidStatus] = useState<string>(""); // State to store bidStatus
  const token = getToken();
  const router = useRouter();
  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/checkout`;

  // Fetch bidStatus from URL search parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bidStatusValue = params.get("pay-uwa-auction");
    if (bidStatusValue) {
      setBidStatus(bidStatusValue);
      const handleAddToCartClick = async (e: Event) => {
        e.preventDefault();

        try {
          await axios.get(
            `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/auctions/silver-cat-daddy?add-to-cart=${bidStatusValue}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
        } catch (error) {
        } finally {
        }
      };
      handleAddToCartClick(new Event("click")); // Simulate click to trigger the function
    }
    // Ensure a string is always set
  }, []); // This effect runs only once after the component mounts
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await axios.get(url, {
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
  };
  // Fetch HTML content based on bidStatus
  useEffect(() => {
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
                router.push(`${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/checkout`); // Redirect using Next.js router
              });
          });
        } else {
          console.error("jQuery not found!");
        }
      }, 1000); // Delay to ensure HTML content is loaded
    };

    loadJQuery();
  }, [htmlContent]); // Run when HTML content is updated

  useEffect(() => {
    const handleCouponSubmit = (e: Event) => {
      e.preventDefault();

      const form = e.currentTarget as HTMLFormElement;
      const input = form.querySelector("#coupon_code") as HTMLInputElement;
      const couponCode = input?.value;

      const billingEmailInput =
        document.querySelector<HTMLInputElement>("#billing_email");

      if (!couponCode) {
        alert("Please enter a coupon code");
        return;
      }

      const submitButton = form.querySelector(
        "button[type='submit']"
      ) as HTMLButtonElement;
      submitButton.disabled = true;
      submitButton.textContent = "Applying...";

      const runAsync = async () => {
        try {
          const baseURL = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-json/custom/v1/apply_coupon`;

          // Build data like WordPress expects
          const payload = new URLSearchParams();
          payload.append("security", "edd75dde8a"); // adjust this token dynamically if needed
          payload.append("coupon_code", couponCode);
          payload.append("billing_email", billingEmailInput?.value || ""); // set actual email if you have

          await axios.post(baseURL, payload.toString(), {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });

          fetchData();
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

    const form = document.querySelector(
      "#woocommerce-checkout-form-coupon"
    ) as HTMLFormElement;

    if (form) {
      form.addEventListener("submit", handleCouponSubmit);
    }

    return () => {
      form?.removeEventListener("submit", handleCouponSubmit);
    };
  }, [htmlContent, token]);

  useEffect(() => {
    if (!htmlContent) return;

    const style = document.createElement("style");
    style.innerHTML = `
    li.woocommerce-SavedPaymentMethods-new {
      display: none !important;
    }

    fieldset#wc-stripe-cc-form {
      display: none;
    }
  `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style); // Clean up
    };
  }, [htmlContent]);

  useEffect(() => {
    const button = document.getElementById("place_order");
    const checkbox = document.getElementById("terms");
    const form = document.forms.namedItem("checkout");

    const handleClick = async (e: Event) => {
      if (!(checkbox as HTMLInputElement)?.checked) {
        e.preventDefault();
        alert(
          "Please agree to the terms and conditions before placing the order."
        );
        return;
      }

      if (form) {
        e.preventDefault(); // Stop the default HTML form submission

        const formData = new FormData(form);

        try {
          const response = await axios.post(
            "https://classichorseauction.com/stage/?wc-ajax=checkout",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true, // Ensure session/cookies are sent
            }
          );

          /* console.log("Checkout success:", response.data); */
          alert("Order placed successfully!");
          if (response.data.result === "success" && response.data.redirect) {
            const redirectUrl = new URL(response.data.redirect);

            // Remove "/stage" from the beginning of the pathname
            const cleanedPath =
              redirectUrl.pathname.replace(/^\/stage/, "") + redirectUrl.search;

            // Redirect to local frontend without /stage
            window.location.href = `${cleanedPath}`;
          }
          // Optional: Redirect to a success page
          // window.location.href = "/order-success";
        } catch (error) {
          /* console.error("Checkout error:", error); */
          alert("Failed to place order. Please try again.");
        }
      }
    };

    if (button) {
      button.addEventListener("click", handleClick);
    }

    // Cleanup
    return () => {
      if (button) {
        button.removeEventListener("click", handleClick);
      }
    };
  }, [htmlContent]);
  useEffect(() => {
    const handleRemoveCouponClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        target.classList.contains("woocommerce-remove-coupon") &&
        target instanceof HTMLAnchorElement
      ) {
        e.preventDefault();

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
