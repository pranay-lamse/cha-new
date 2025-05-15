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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const status = params.get("bid_status") || "active";
      setBidStatus(status);
    }
  }, []);
  const token = getToken();
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
        $(
          ".woocommerce ul.products li.product.type-product span.woo-ua-winned-for.winning_bid"
        ).text("Sold via Bid");

        $(
          ".woocommerce ul.products li.product.type-product span.woo-ua-sold-for.sold_for"
        ).text("Sold via Buy Now");

        $(".home_products_sec .product").each(function () {
          const $link = $(this)
            .find(".woocommerce-LoopProduct-link")
            .attr("href");

          $(this)
            .find(".short_des_loop")
            .append(
              "<a href='" +
                $link +
                "#bidding' style='margin-left: 20px;' id='hwa_button' class='button'>How to bid</a>"
            );

          $(this).find(".button").wrapAll("<div class='button_wrap'></div>");
        });

        if (window.location.href.indexOf("bidding") > -1) {
          console.log("yes");

          $("html, body").animate({
            scrollTop:
              $("#bidding_sec").offset() && $("#bidding_sec").offset()?.top
                ? $("#bidding_sec").offset()!.top - 300
                : 0,
          });
        }

        $("body ul.products .product").each(function () {
          const $product = $(this);
          const $shortDesc = $product
            .find(
              ".woocommerce-loop-product__title,.price,.short_des_loop,.uwa_auction_product_countdown,.button"
            )
            .first(); // safer

          // Only move if short_desc exists
          if ($shortDesc.length) {
            const $detailsDiv = $("<div class='product_details_left'></div>");
            $shortDesc.before($detailsDiv); // insert before short_desc
            $shortDesc.appendTo($detailsDiv); // move it into the new div
          }
        });

        $("body ul.products .product").each(function () {
          const $product = $(this);
          const $shortDesc = $product.find(".short_des_loop").first();
          const $addToCartBtn = $product.find("a.ajax_add_to_cart").first();

          if ($shortDesc.length && $addToCartBtn.length) {
            $shortDesc.append($addToCartBtn); // move the button inside short_des_loop
          }
        });

        reorderProducts();
        $(window).on("resize", reorderProducts);

        return () => {
          $(window).off("resize", reorderProducts);
        };
      }, 100);
    }
  }, [htmlContent, loading]);

  useEffect(() => {
    const handleAddToCartClick = (e: Event) => {
      e.preventDefault(); // STOP the default link behavior immediately

      const runAsync = async () => {
        const target = e.currentTarget as HTMLAnchorElement;
        const relativeHref = target.getAttribute("href");

        const baseURL =
          "https://classichorseauction.com/stage/product-category/horse-classifieds";

        if (relativeHref && token) {
          const fullURL = `${baseURL}${relativeHref}`;

          try {
            const response = await axios.get(fullURL, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            });

            alert("Item added to cart successfully!");
          } catch (error) {
            console.error("Add to cart failed:", error);
          }
        }
      };

      runAsync(); // run the async code after preventing default
    };

    const buttons = document.querySelectorAll("a.ajax_add_to_cart");

    buttons.forEach((btn) => {
      btn.addEventListener("click", handleAddToCartClick);
    });

    return () => {
      buttons.forEach((btn) => {
        btn.removeEventListener("click", handleAddToCartClick);
      });
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
