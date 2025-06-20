"use client";
import React, { useEffect, useState } from "react";
import $ from "jquery";

import Loader from "@/components/Loader";
import { fetchHtmlData } from "@/lib/fetchHtmlData";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";

import axios from "axios";
import { getToken } from "@/utils/storage";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
export default function EditAccountPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bidStatus, setBidStatus] = useState("active");
  const [loginMessage, setLoginMessage] = useState(false);
  const token = getToken();
  const params = useParams();
  const orderId = params?.id;
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const status = params.get("bid_status") || "active";
      setBidStatus(status);
    }
  }, []);

  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/product-category/horse-classifieds/page/${orderId}`;

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

  useEffect(() => {
    if (bidStatus) {
      fetchData();
    }
  }, [bidStatus]);

  // Core logic that runs after HTML content is injected
  useEffect(() => {
    if (!loading && htmlContent) {
      setTimeout(() => {
        // DOM reordering and layout fixes
        $(".clock_jquery").each(function () {
          const el = $(this);
          const timeStr = el.data("time");
          const [datePart, timePart] = timeStr.split(" ");
          const [year, month, day] = datePart.split("-").map(Number);
          const [hour, minute, second] = timePart.split(":").map(Number);
          const endTime = new Date(
            Date.UTC(year, month - 1, day, hour + 6, minute, second)
          ).getTime();

          function update() {
            const now = Date.now();
            const diff = endTime - now;
            if (diff <= 0) {
              el.html('<span class="countdown-expired">Auction ended</span>');
              clearInterval(timer);
              return;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor(
              (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            el.html(`
              <span class="countdown_row countdown_show4">
                <span class="countdown_section"><span class="countdown_amount">${d} </span><br>Day(s),</span>
                <span class="countdown_section"><span class="countdown_amount">${h} </span><br>Hour(s),</span>
                <span class="countdown_section"><span class="countdown_amount">${m} </span><br>Min(s),</span>
                <span class="countdown_section"><span class="countdown_amount">${s} </span><br>Sec(s)</span>
              </span>`);
          }

          update();
          const timer = setInterval(update, 1000);
        });

        $(".product").each(function () {
          const price = $(this).find(".price");
          const title = $(this).find(".woocommerce-loop-product__title");
          const details = $(this).find(".short_des_loop");

          if (details.length) {
            if (price.length && !details.find(".price").length)
              price.detach().prependTo(details);
            if (
              title.length &&
              !details.find(".woocommerce-loop-product__title").length
            )
              title.detach().prependTo(details);
          }
        });

        $(".short_des_loop").each(function () {
          const details = $(this).find("ul");
          const button = $(this)
            .closest(".product")
            .find(
              ".button, a.button.alt.uwa_pay_now, .uwa_auction_product_countdown"
            );
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
        $(".woocommerce ul.products li.product span.woo-ua-winned-for").text(
          "Sold via Bid"
        );
        $(".woocommerce ul.products li.product span.woo-ua-sold-for").text(
          "Sold via Buy Now"
        );

        // Append "How to bid" button and wrap action buttons
        $(".home_products_sec .product").each(function () {
          const $link = $(this)
            .find(".woocommerce-LoopProduct-link")
            .attr("href");
          $(this)
            .find(".short_des_loop")
            .append(
              `<a href='${$link}#bidding' style='margin-left: 20px;' id='hwa_button' class='button'>How to bid</a>`
            );
          $(this).find(".button").wrapAll("<div class='button_wrap'></div>");
        });

        // Handle Add to Cart (WooCommerce style)
        $("body").on(
          "added_to_cart",
          function (event, fragments, cart_hash, $button) {
            if (!$button.closest(".short_des_loop").length) return;
            $button
              .closest(".short_des_loop")
              .find(".custom_view_cart_link")
              .remove();

            const viewCart = $("<a/>", {
              href: "/cart/",
              class: "added_to_cart wc-forward custom_view_cart_link",
              title: "View cart",
              text: "View cart",
            });

            $button.after(viewCart);
          }
        );

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
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState("/my-account");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search;
      setRedirectUrl(`/my-account?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, []);

  const handleRedirect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(redirectUrl);
  };
  // Custom Add to Cart Handler with Event Trigger
  useEffect(() => {
    const handleAddToCartClick = (e: Event) => {
      e.preventDefault();
      if (!token) {
        fetchData();
        setLoginMessage(true);
        return null;
      }

      const target = e.currentTarget as HTMLAnchorElement;
      target.classList.add("loading"); // add loading class immediately
      target.classList.remove("added"); // remove added class before new request

      const runAsync = async () => {
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

            // Manually trigger WooCommerce event
            const $button = $(target);
            $("body").trigger("added_to_cart", [{}, "", $button]);

            // Add the 'added' class after successful add to cart
            target.classList.add("added");
          } catch (error) {
            console.error("Add to cart failed:", error);
          } finally {
            target.classList.remove("loading"); // remove loading class after request finishes
          }
        } else {
          target.classList.remove("loading");
        }
      };

      runAsync();
    };

    const buttons = document.querySelectorAll("a.ajax_add_to_cart");
    buttons.forEach((btn) =>
      btn.addEventListener("click", handleAddToCartClick)
    );

    return () => {
      buttons.forEach((btn) =>
        btn.removeEventListener("click", handleAddToCartClick)
      );
    };
  }, [token, htmlContent]);

  return (
    <>
      <div className="auctionTow-page add-loading">
        {loginMessage && (
          <div className="woocommerce-notices-wrapper">
            <ul className="woocommerce-error" role="alert">
              <li>
                Please Login/Register to place your bid or buy the product.{" "}
                <a
                  href={redirectUrl}
                  onClick={handleRedirect}
                  className="button"
                >
                  Login/Register →
                </a>{" "}
              </li>
            </ul>
          </div>
        )}
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
    </>
  );
}
