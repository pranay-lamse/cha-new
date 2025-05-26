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
  const token = getToken();
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL_CUSTOM_API}/my-account/lost-password`;
  const url = window.location.search.includes("reset-link-sent=true")
    ? `${baseUrl}?reset-link-sent=true`
    : baseUrl;

  // Fetch bidStatus from URL search parameters on mount

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
  }, []); // Fetch data when bidStatus changes

  useEffect(() => {
    const form = document.querySelector(
      "form.woocommerce-ResetPassword"
    ) as HTMLFormElement | null;
    const resetBtn = form?.querySelector(
      "button[type='submit'], button.woocommerce-Button"
    ) as HTMLButtonElement | null;

    console.log("Form found:", !!form);
    console.log("Reset button found:", !!resetBtn);

    if (!form || !resetBtn) return;

    // Change button type to "button" to prevent native form submit
    resetBtn.type = "button";
    console.log("Button type after change:", resetBtn.type);

    const handler = async () => {
      const formData = new FormData(form);

      resetBtn.disabled = true;
      resetBtn.textContent = "Sending...";

      try {
        const payload = new URLSearchParams();
        formData.forEach((value, key) => {
          if (typeof value === "string") {
            payload.append(key, value);
          }
        });
        const form_action = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/my-account/lost-password`;

        const response = await axios.post(form_action, payload.toString(), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`, // remove if not needed
          },
          withCredentials: true,
          responseType: "text",
        });

        const responseText = response.data;

        if (
          responseText.includes("password reset email has been sent") ||
          responseText.includes("Check your email")
        ) {
          /* alert("Password reset email sent. Please check your inbox."); */
          window.location.href = `/my-account/lost-password/?reset-link-sent=true`; // Redirect to my-account page
        } else {
          alert("Failed to send reset email. Please try again.");
          console.log("Response:", responseText);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Something went wrong. Please try again.");
      } finally {
        resetBtn.disabled = false;
        resetBtn.textContent = "Reset password";
      }
    };

    resetBtn.addEventListener("click", handler);

    return () => {
      resetBtn.removeEventListener("click", handler);
    };
  }, [htmlContent]);

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
