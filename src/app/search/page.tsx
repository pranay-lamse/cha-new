"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { fetchHtmlData } from "@/lib/fetchHtmlData";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import { getToken } from "@/utils/storage";

export default function EditAccountPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orderKey, setOrderKey] = useState<string | null>(null);
  const token = getToken();

  useEffect(() => {
    // Only run on client
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const key = params.get("search");
    setOrderKey(key);
  }, []);

  useEffect(() => {
    if (!orderKey) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/?s=${orderKey}`;
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
  }, [orderKey]);

  return (
    <div className="search-page">
      {loading ? (
        <Loader />
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: filterHTMLContent(htmlContent || "", [
              "elementor-location-archive",
            ]),
          }}
          className="search-page-inner"
        />
      )}
    </div>
  );
}
