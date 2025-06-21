"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import axios from "axios";
import { getToken } from "@/utils/storage";
import ShowResetForm from "./show-reset-form/page"; // ✅ make sure this path is correct

declare global {
  interface Window {
    jQuery?: any;
  }
}

export default function CheckoutPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const token = getToken();
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL_CUSTOM_API}/my-account/lost-password`;
  const router = useRouter();
  const searchParams = useSearchParams();

  const key = searchParams.get("key");
  const id = searchParams.get("id");
  const login = searchParams.get("login");

  const showResetForm = key && id && login;

  // Set the URL for lost-password fetch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const finalUrl = window.location.search.includes("reset-link-sent=true")
        ? `${baseUrl}?reset-link-sent=true`
        : baseUrl;
      setUrl(finalUrl);
    }
  }, []);

  // Fetch HTML content for lost-password
  useEffect(() => {
    if (!url) return;

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

    fetchData();
  }, [url]);

  // Attach submit handler for native reset form
  useEffect(() => {
    if (typeof window === "undefined") return;

    const form = document.querySelector(
      "form.woocommerce-ResetPassword"
    ) as HTMLFormElement | null;

    const resetBtn = form?.querySelector(
      "button[type='submit'], button.woocommerce-Button"
    ) as HTMLButtonElement | null;

    if (!form || !resetBtn) return;

    resetBtn.type = "button";

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
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
          responseType: "text",
        });

        const responseText = response.data;

        if (
          responseText.includes("password reset email has been sent") ||
          responseText.includes("Check your email")
        ) {
          window.location.href = `/my-account/lost-password/?reset-link-sent=true`;
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

  if (showResetForm) {
    return <ShowResetForm />;
  }

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1100px] my-10 sm:my-20 uwa-auctions-page px-3 md:px-0 checkout-page password-lost">
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
