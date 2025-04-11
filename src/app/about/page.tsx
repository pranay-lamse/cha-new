"use client";
import React, { useEffect, useState } from "react";

import Loader from "@/components/Loader";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { fetchHtmlData } from "@/lib/fetchHtmlData";

export default function EditAccountPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bidStatus, setBidStatus] = useState<string>("active");

  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/about`;

  // Fetch search params using useEffect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bidStatusValue = params.get("bid_status") || "active"; // Fallback if missing
    setBidStatus(bidStatusValue);
  }, []); // Only run once after mount

  // Fetch data when bidStatus changes
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
  }, [bidStatus]);

  return (
    <div className="about-page">
      {loading ? (
        <Loader />
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: filterHTMLContent(htmlContent || "", ["elementor-123"]),
          }}
        ></div>
      )}
    </div>
  );
}
