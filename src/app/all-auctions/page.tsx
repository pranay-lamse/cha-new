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

      $("body ul.products li.product").each(function () {
        $(this).wrapAll('<li class="product_loop_wrap"></li>');
      });

      $(".product_loop_wrap").each(function () {
        const $wrap = $(this);

        const $priceSpan = $wrap.find(
          "span.woocommerce-Price-amount.amount bdi span"
        );
        const currency: string = $priceSpan.text() || "";

        $priceSpan.remove();

        const priceRefHTML: string =
          $wrap.find("span.woocommerce-Price-amount.amount bdi").html() || "";

        const hasReserveNotMet = $wrap
          .find(".woo-ua-winned-for")
          .hasClass("reserve_not_met");
        const hasExpired = $wrap.find(".woo-ua-winned-for").hasClass("expired");

        if (hasReserveNotMet || hasExpired) {
          const priceFallback =
            $wrap.find(".product-custom-price").attr("data-price") || "0";
          $wrap.attr("data-price", priceFallback);
        } else {
          // Remove any non-numeric chars from priceRefHTML if necessary
          $wrap.attr("data-price", priceRefHTML || "0");
        }

        // Safely prepend currency
        const $bdi = $wrap.find("span.woocommerce-Price-amount.amount bdi");
        if (currency && $bdi.length > 0) {
          $bdi.prepend(currency);
        }
      });

      const $products = $(
        ".home_products_sec:not(.closed_auctions)  .product_loop_wrap"
      ).toArray();
      $products.sort((a, b) => {
        const priceA = parseFloat($(a).attr("data-price") || "0");
        const priceB = parseFloat($(b).attr("data-price") || "0");
        return priceB - priceA;
      });

      $(".home_products_sec:not(.closed_auctions) ul.products")
        .empty()
        .append($products);

      const $products1 = $(".closed_auc .product_loop_wrap").toArray();

      $products1.sort((a, b) => {
        const priceA = parseFloat($(a).attr("data-price") || "0");
        const priceB = parseFloat($(b).attr("data-price") || "0");
        return priceB - priceA;
      });

      $(".closed_auc ul.products").empty().append($products1);
      $(function () {
        $(".product_loop_wrap").each(function () {
          const $wrap = $(this);

          // Add the div inside the product li
          const $product = $wrap.find("li.product");
          $product.prepend("<div class='product_details_left'></div>");

          // Move .short_des_loop into the new div
          $product
            .children(".short_des_loop") // Only direct children
            .prependTo($product.find(".product_details_left"));
        });
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
