"use client";
import React, { useEffect, useState } from "react";

import Loader from "@/components/Loader";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { fetchHtmlData } from "@/lib/fetchHtmlData";
import axios from "axios";

export default function EditAccountPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-json/wp/v2/pages?slug=about`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(url);

        // response.data is an array, get the first item
        const page = response.data?.[0];

        if (page && page.content && page.content.rendered) {
          setHtmlContent(page.content.rendered);
        } else {
          setHtmlContent(null);
          setError("No content found.");
        }
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
        setHtmlContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
