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
import axios from "axios";
import { getToken } from "@/utils/storage";

export default function EditAccountPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bidStatus, setBidStatus] = useState("active");

  const token = getToken();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const status = params.get("bid_status") || "active";
      setBidStatus(status);
    }
  }, []);

  useEffect(() => {
    const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/product-category/horse-classifieds`;

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

    if (bidStatus) {
      fetchData();
    }
  }, [bidStatus]);

  // Core logic that runs after HTML content is injected
  useEffect(() => {
    if (!loading && htmlContent) {
      setTimeout(() => {
        // DOM reordering and layout fixes
        $(".product").each(function () {
          const price = $(this).find(".price");
          const title = $(this).find(".woocommerce-loop-product__title");
          const details = $(this).find(".short_des_loop");

          if (details.length) {
            if (price.length && !details.find(".price").length) {
              price.detach().prependTo(details);
            }
            if (title.length && !details.find(".woocommerce-loop-product__title").length) {
              title.detach().prependTo(details);
            }
          }
        });

        $(".short_des_loop").each(function () {
          const details = $(this).find("ul");
          const button = $(this)
            .closest(".product")
            .find("a.button.product_type_auction, a.button.product_type_simple");

          if (details.length && button.length) {
            details.after(button);
          }
        });

        // Responsive reorder
        function reorderProducts() {
          const windowWidth = $(window)?.width() || 0;
          $(".products .product").each(function (index) {
            const $image = $(this).find(".woocommerce-LoopProduct-link");
            const $description = $(this).find(".short_des_loop");
            if ($image.length && $description.length) {
              if (windowWidth > 768) {
                if (index % 2 === 0) $image.insertBefore($description);
                else $description.insertBefore($image);
              } else {
                $image.insertBefore($description);
              }
            }
          });
        }

        // Labels
        $(".woocommerce ul.products li.product span.woo-ua-winned-for").text("Sold via Bid");
        $(".woocommerce ul.products li.product span.woo-ua-sold-for").text("Sold via Buy Now");

        // Append "How to bid" button and wrap action buttons
        $(".home_products_sec .product").each(function () {
          const $link = $(this).find(".woocommerce-LoopProduct-link").attr("href");
          $(this)
            .find(".short_des_loop")
            .append(
              `<a href='${$link}#bidding' style='margin-left: 20px;' id='hwa_button' class='button'>How to bid</a>`
            );
          $(this).find(".button").wrapAll("<div class='button_wrap'></div>");
        });

        // Handle Add to Cart (WooCommerce style)
        $("body").on("added_to_cart", function (event, fragments, cart_hash, $button) {
          if (!$button.closest(".short_des_loop").length) return;
          $button.closest(".short_des_loop").find(".custom_view_cart_link").remove();

          const viewCart = $("<a/>", {
            href: "/cart/",
            class: "added_to_cart wc-forward custom_view_cart_link",
            title: "View cart",
            text: "View cart",
          });

          $button.after(viewCart);
        });

        // Move short_desc and add_to_cart button into layout
        $("body ul.products .product").each(function () {
          const $product = $(this);
          const $shortDesc = $product.find(".short_des_loop").first();
          const $addToCartBtn = $product.find("a.ajax_add_to_cart").first();
          if ($shortDesc.length && $addToCartBtn.length) {
            $shortDesc.append($addToCartBtn);
          }
        });

        reorderProducts();
        $(window).on("resize", reorderProducts);

        // Scroll to #bidding section if URL includes it
        if (window.location.href.indexOf("bidding") > -1) {
          $("html, body").animate({
            scrollTop: ($("#bidding_sec").offset()?.top || 0) - 300,
          });
        }

        return () => {
          $(window).off("resize", reorderProducts);
        };
      }, 100);
    }
  }, [htmlContent, loading]);

  // Custom Add to Cart Handler with Event Trigger
  useEffect(() => {
    const handleAddToCartClick = (e: Event) => {
      e.preventDefault();

      const runAsync = async () => {
        const target = e.currentTarget as HTMLAnchorElement;
        const relativeHref = target.getAttribute("href");
        const baseURL = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/product-category/horse-classifieds`;

        if (relativeHref && token) {
          const fullURL = `${baseURL}${relativeHref}`;
          try {
            await axios.get(fullURL, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            });

            // ✅ Manually trigger WooCommerce event
            const $button = $(target);
            $("body").trigger("added_to_cart", [{}, "", $button]);
          } catch (error) {
            console.error("Add to cart failed:", error);
          }
        }
      };

      runAsync();
    };

    const buttons = document.querySelectorAll("a.ajax_add_to_cart");
    buttons.forEach((btn) => btn.addEventListener("click", handleAddToCartClick));

    return () => {
      buttons.forEach((btn) => btn.removeEventListener("click", handleAddToCartClick));
    };
  }, [token, htmlContent]);

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
