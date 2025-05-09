"use client";
import React, { useEffect, useState } from "react";
import MenuPage from "@/components/my-account-menu/page";
import Loader from "@/components/Loader";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import $ from "jquery";
import axios from "axios";

const EditAccountPage = () => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [productPage, setProductPage] = useState<string>("");

  // ✅ Get initial productPage from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const productPageParam = params.get("product-page") || "1";
      setProductPage(productPageParam);
    }
  }, []);

  // ✅ Fetch page data based on productPage
  useEffect(() => {
    if (typeof window === "undefined" || productPage === "") return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-json/wp/v2/pages?slug=all-auctions&_fields=content&product-page=${productPage}`;
        const response = await axios.get(url);
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
  }, [productPage]);

  function fixPaginationLinks(html: string) {
    return html.replace(
      /\/stage\/wp-json\/wp\/v2\/pages\?slug=all-auctions&_fields=content&product-page=(\d+)/g,
      "/all-auctions?product-page=$1"
    );
  }

  // ✅ DOM Manipulation after content is loaded
  useEffect(() => {
    if (!loading && htmlContent) {
      $(".product").each(function () {
        const price = $(this).find(".price");
        const title = $(this).find(".woocommerce-loop-product__title");
        const details = $(this).find(".short_des_loop");

        if (details.length) {
          if (price.length && !details.find(".price").length) {
            price.detach().prependTo(details);
          }
          if (
            title.length &&
            !details.find(".woocommerce-loop-product__title").length
          ) {
            title.detach().prependTo(details);
          }
        }
      });

      $(".short_des_loop").each(function () {
        const details = $(this).find("ul");
        const button = $(this)
          .closest(".product")
          .find("a.button.product_type_auction");

        if (details.length && button.length) {
          details.after(button);
        }
      });

      const reorderProducts = () => {
        if (typeof window === "undefined") return;

        const windowWidth = $(window).width() || 0;

        $(".products .product").each(function (index) {
          const $image = $(this).find(".woocommerce-LoopProduct-link");
          const $description = $(this).find(".short_des_loop");

          if ($image.length && $description.length) {
            if (windowWidth > 768) {
              if (index % 2 === 0) {
                $image.insertBefore($description);
              } else {
                $description.insertBefore($image);
              }
            } else {
              $image.insertBefore($description); // Reset for mobile
            }
          }
        });
      };

      reorderProducts();
      $(window).on("resize", reorderProducts);

      // ✅ BONUS: Attach click listeners to pagination
      $(".page-numbers a").on("click", function (e) {
        e.preventDefault();
        const href = $(this).attr("href");
        if (href) {
          const url = new URL(href, window.location.origin);
          const page = url.searchParams.get("product-page") || "1";

          setProductPage(page);

          // Update browser URL without reload
          window.history.pushState(
            {},
            "",
            `/all-auctions?product-page=${page}`
          );
        }
      });

      return () => {
        $(window).off("resize", reorderProducts);
      };
    }
  }, [htmlContent, loading]);

  return (
    <div className="auctionTow-page all-auctions-page">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">Error: {error}</div>
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
