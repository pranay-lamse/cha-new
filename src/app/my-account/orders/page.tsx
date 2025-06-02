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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bidStatusValue = params.get("bid_status") || "active"; // Fallback to 'active'
    setBidStatus(bidStatusValue); // Set bidStatus in the state
  }, []); // This effect runs only once after the component mounts

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

  const handleLogout = () => {
    try {
      // Remove authentication tokens and user info from cookies
      Cookies.remove("authToken");
      Cookies.remove("refreshToken");
      Cookies.remove("user");
      Cookies.remove("rememberMe"); // Optional, if rememberMe was set
      window.location.href = "/my-account";
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  useEffect(() => {
    const handleLogoutClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" &&
        target.textContent?.trim().toLowerCase() === "log out"
      ) {
        e.preventDefault();

        // Call your logout function here
        handleLogout();
      }
    };

    document.addEventListener("click", handleLogoutClick);

    return () => {
      document.removeEventListener("click", handleLogoutClick);
    };
  }, []);

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
