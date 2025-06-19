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
import { useSearchParams } from "next/navigation";
export default function EditAccountPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bidStatus, setBidStatus] = useState<string>("active"); // State to store bidStatus
  const token = getToken();
  const searchParams = useSearchParams();

  const orderKey = searchParams.get("search");
  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/?s=${orderKey}`; // ✅ Dynamic URL
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
  }, []);

  return (
    <div className="container  mx-auto w-full sm:w-11/12 lg:w-[1170px] px-2">
      <div className="e-my-account-tab e-my-account-tab__dashboard">
        <div className="woocommerce myaccount-info">
          <div className="woocommerce-MyAccount-content-outer">
            {loading ? (
              <Loader />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: filterHTMLContent(htmlContent || "", [
                    "elementor-widget-container",
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
