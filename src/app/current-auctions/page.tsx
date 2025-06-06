"use client";
import React, { useEffect, useState } from "react";
import MenuPage from "@/components/my-account-menu/page";
import Loader from "@/components/Loader";
import { fetchHtmlData } from "@/lib/fetchHtmlData";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import $ from "jquery";

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

  useEffect(() => {
    const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/current-auctions`;

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
  }, [bidStatus]);

  // ✅ DOM Manipulation After HTML is Injected
  useEffect(() => {
    if (!loading && htmlContent) {
      const timeoutId = setTimeout(() => {
        // -------------------------
        // Reorder Product Elements
        // -------------------------
        $(function () {
          $(".clock_jquery").each(function () {
            const el = $(this);
            const timeStr = el.data("time"); // e.g. "2025-05-15 15:33:20"

            // Parse time manually from data-time
            const [datePart, timePart] = timeStr.split(" ");
            const [year, month, day] = datePart.split("-").map(Number);
            const [hour, minute, second] = timePart.split(":").map(Number);

            // Adjust by +6 hours (UTC-6 / CST)
            const localTime = new Date(
              Date.UTC(year, month - 1, day, hour + 6, minute, second)
            );
            const endTime = localTime.getTime();

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

              el.html(
                `<span class="countdown_row countdown_show4">
        <span class="countdown_section"><span class="countdown_amount">${d} </span><br>Day(s),</span>
        <span class="countdown_section"><span class="countdown_amount">${h} </span><br>Hour(s),</span>
        <span class="countdown_section"><span class="countdown_amount">${m} </span><br>Min(s),</span>
        <span class="countdown_section"><span class="countdown_amount">${s} </span><br>Sec(s)</span>
      </span>`
              );
            }

            update();
            const timer = setInterval(update, 1000);
          });
        });

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
              "a.button.product_type_auction, a.button.alt.uwa_pay_now, .uwa_auction_product_countdown"
            );

          if (details.length && button.length) {
            details.after(button);
          }
        });

        // function reorderProducts() {
        //   const windowWidth = $(window)?.width() || 0;

        //   if (windowWidth > 768) {
        //     $(".products .product").each(function (index) {
        //       const $image = $(this).find(".woocommerce-LoopProduct-link");
        //       const $description = $(this).find(".short_des_loop");

        //       if ($image.length && $description.length) {
        //         if (index % 2 === 0) {
        //           $image.insertBefore($description);
        //         } else {
        //           $description.insertBefore($image);
        //         }
        //       }
        //     });
        //   } else {
        //     $(".products .product").each(function () {
        //       const $image = $(this).find(".woocommerce-LoopProduct-link");
        //       const $description = $(this).find(".short_des_loop");

        //       if ($image.length && $description.length) {
        //         $image.insertBefore($description); // reset order on mobile
        //       }
        //     });
        //   }
        // }

        // reorderProducts();
        // $(window).on("resize", reorderProducts);

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

          $(".auctionTow-page ul.products li.product").css("opacity", "1");
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

        $(document).on("click", ".how-to-bid-button", function (e) {
          e.preventDefault();
          // Example: Open a modal or navigate
          alert("Open How to Bid instructions or modal here.");
          // or use: window.location.href = "/how-to-bid";
        });
        $("ul.products li.product").each(function () {
          const $product = $(this);
          const $bdi = $product.find(
            "span.woocommerce-Price-amount.amount bdi"
          );

          const currency = $bdi.find("span").text();
          $bdi.find("span").remove();

          const priceRefText = $bdi.html();

          const hasReserveOrExpired =
            $product.find(".woo-ua-winned-for").hasClass("reserve_not_met") ||
            $product.find(".woo-ua-winned-for").hasClass("expired");

          const finalPrice = hasReserveOrExpired
            ? $product.find(".product-custom-price").attr("data-price") ?? "0"
            : priceRefText ?? "0";

          $product.attr("data-price", finalPrice);
          $bdi.prepend(currency);
        });

        sortProductsPriceDescending();

        function sortProductsPriceDescending() {
          const $wrapper1 = $(
            ".home_products_sec:not(.closed_auctions) ul.products"
          );
          const products = $wrapper1.find("li.product").toArray();

          products.sort((a, b) => {
            const priceA = parseFloat($(a).attr("data-price") ?? "0");
            const priceB = parseFloat($(b).attr("data-price") ?? "0");
            return priceB - priceA;
          });

          $wrapper1.append(products); // replace with sorted elements

          const $wrapper2 = $(".closed_auc ul.products");
          const products1 = $wrapper2.find("li.product").toArray();

          products1.sort((a, b) => {
            const priceA = parseFloat($(a).attr("data-price") ?? "0");
            const priceB = parseFloat($(b).attr("data-price") ?? "0");
            return priceB - priceA;
          });

          $wrapper2.append(products1);
        }
      }, 200);

      return () => {
        clearTimeout(timeoutId);
        $(window).off("resize");
      };
    }
  }, [htmlContent, loading]);

  return (
    <div className="auctionTow-page all-auctions-page auction_products">
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
