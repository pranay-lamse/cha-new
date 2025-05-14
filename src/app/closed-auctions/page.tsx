"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { fetchHtmlData } from "@/lib/fetchHtmlData";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import $ from "jquery";
import axios from "axios";

export default function EditAccountPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bidStatus, setBidStatus] = useState<string>("active");

  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-json/wp/v2/pages?slug=closed-auctions&_fields=content`;

  useEffect(() => {
    // Event delegation since HTML is loaded via Ajax
    $(document).on(
      "click",
      ".woocommerce-pagination a.page-numbers",
      function (e) {
        e.preventDefault();

        const href = $(this).attr("href");
        const match = href?.match(/page\/(\d+)/);
        const slugMatch = href ? href.match(/slug=([^&]+)/) : null;

        if (match && slugMatch) {
          const page = match[1];
          const slug = slugMatch[1];

          // Navigate using Next.js router (no page reload)
          window.location.href = `/${slug}/page/${page}`;
        }
      }
    );

    // Cleanup on unmount
    return () => {
      $(document).off("click", ".woocommerce-pagination a.page-numbers");
    };
  }, []);
  // Fetch HTML Data
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

  useEffect(() => {
    if (!loading && htmlContent) {
      setTimeout(() => {
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

        function reorderProducts() {
          if (typeof window !== "undefined") {
            const windowWidth = $(window)?.width() || 0; // Prevent undefined issue

            if (windowWidth > 768) {
              $(".products .product").each(function (index) {
                const $image = $(this).find(".woocommerce-LoopProduct-link");
                const $description = $(this).find(".short_des_loop");

                if ($image.length && $description.length) {
                  if (index % 2 === 0) {
                    $image.insertBefore($description);
                  } else {
                    $description.insertBefore($image);
                  }
                }
              });
            } else {
              $(".products .product").each(function () {
                const $image = $(this).find(".woocommerce-LoopProduct-link");
                const $description = $(this).find(".short_des_loop");

                if ($image.length && $description.length) {
                  $image.insertBefore($description); // Reset to default order on mobile
                }
              });
            }
          }
        }

        reorderProducts();

        if (typeof window !== "undefined") {
          $(window).on("resize", reorderProducts);
        }

        return () => {
          if (typeof window !== "undefined") {
            $(window).off("resize", reorderProducts);
          }
        };
      }, 100);
    }
  }, [htmlContent, loading]);

  return (
    <div className="auctionTow-page all-auctions-page">
      {loading ? (
        <Loader />
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
}
