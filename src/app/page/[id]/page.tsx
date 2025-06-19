"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { fetchHtmlData } from "@/lib/fetchHtmlData";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import { getToken } from "@/utils/storage";
import { useRouter } from "next/navigation"; // Use 'next/router' if you're in the Pages Router

export default function EditAccountPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orderKey, setOrderKey] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState("1");
  const token = getToken();
  const router = useRouter();

  // Extract search term (?s=) and page (/page/:num) from the URL
  useEffect(() => {
    const search = window.location.search;
    const path = window.location.pathname;

    const params = new URLSearchParams(search);
    const key = params.get("s");

    const pageMatch = path.match(/\/page\/(\d+)/);
    const pageNumber = pageMatch ? pageMatch[1] : "1";

    setOrderKey(key);
    setCurrentPage(pageNumber);
  }, []);

  // Fetch the HTML content
  useEffect(() => {
    if (!orderKey) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/page/${currentPage}?s=${orderKey}`;
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
  }, [orderKey, currentPage]);

  // Intercept <a href="/..."> clicks inside the HTML
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A") {
        const anchor = target as HTMLAnchorElement;
        const href = anchor.getAttribute("href");

        // Only intercept local/internal links
        if (
          href &&
          href.startsWith("/") &&
          !href.startsWith("//") &&
          !anchor.hasAttribute("target")
        ) {
          e.preventDefault();
          router.push(href);
        }
      }
    };

    const container = document.querySelector(".search-page-inner");
    container?.addEventListener("click", handleClick);

    return () => {
      container?.removeEventListener("click", handleClick);
    };
  }, [htmlContent, router]);

  return (
    <div className="search-page">
      {loading ? (
        <Loader />
      ) : (
        <div
          className="search-page-inner"
          dangerouslySetInnerHTML={{
            __html: filterHTMLContent(htmlContent || "", [
              "elementor-location-archive",
            ]),
          }}
        />
      )}
    </div>
  );
}
