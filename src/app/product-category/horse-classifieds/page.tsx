"use client";
import React, { useEffect, useState } from "react";
import $ from "jquery";
import MenuPage from "@/components/my-account-menu/page";
import Loader from "@/components/Loader";
import { fetchHtmlData } from "@/lib/fetchHtmlData";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import Head from "next/head";
import { Leatherwood } from "@/components/Leatherwood";
import Image from "next/image";
import { marcellus, raleway } from "@/config/fonts";

export default function EditAccountPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/product-category/horse-classifieds`;

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
            .find(
              "a.button.product_type_auction, a.button.product_type_simple"
            );

          if (details.length && button.length) {
            details.after(button);
          }
        });

        function reorderProducts() {
          const windowWidth = $(window)?.width() || 0;

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
                $image.insertBefore($description);
              }
            });
          }
        }

        reorderProducts();
        $(window).on("resize", reorderProducts);

        return () => {
          $(window).off("resize", reorderProducts);
        };
      }, 100);
    }
  }, [htmlContent, loading]);

  return (
    <div className="auctionTow-page">
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
