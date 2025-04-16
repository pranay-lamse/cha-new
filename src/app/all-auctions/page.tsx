"use client";
import React, { useEffect, useState } from "react";

import MenuPage from "@/components/my-account-menu/page";
import Loader from "@/components/Loader";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import $ from "jquery";
import { ensureStableJQueryLogic } from "@/components/jquery/ensureStableJQueryLogic";
import { fetchHtmlData } from "@/lib/fetchHtmlData";
import axios from "axios";

const EditAccountPage = () => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [productPage, setProductPage] = useState("");

  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-json/wp/v2/pages?slug=all-auctions&_fields=content`;

  // ✅ Fetch HTML content
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(url);

        // response.data is an array, get the first item
        const page = response.data?.[0];

        if (page && page.content && page.content.rendered) {
          setHtmlContent(page.content.rendered);
        } else {
          setHtmlContent(null);
          setError("No content found.");
        }
      } catch (err) {
        console.error("Error fetching WordPress page:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <div className="auctionTow-page all-auctions-page">
      {loading ? (
        <Loader />
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: filterHTMLContent(htmlContent || "", ["elementor"]),
          }}
          className="text-gray-700"
        ></div>
      )}
    </div>
  );
};

export default EditAccountPage;
