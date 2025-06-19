"use client";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}
import $ from "jquery";
import { useSearchParams } from "next/navigation";
import MenuPage from "@/components/my-account-menu/page";
import Loader from "@/components/Loader";
import { fetchHtmlData } from "@/lib/fetchHtmlData";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import Head from "next/head";
import { Leatherwood } from "@/components/Leatherwood";
import Image from "next/image";
import { marcellus, raleway } from "@/config/fonts";
import { useRouter } from "next/navigation";

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
    const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/leatherwood-trail-horses`;

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

    const router = useRouter();
    const [redirectUrl, setRedirectUrl] = useState("/my-account");
 const handleRedirect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(redirectUrl);
  };
  


    useEffect(() => {
    if (!loading && htmlContent) {
      const timeoutId = setTimeout(() => {
        // ✅ Client-side routing for both "Bid now" and "How to bid"
        $(document).on(
          "click",
          "a.product_type_auction, #hwa_button, a.button.product_type_simple",
          function (e) {
            const href = $(this).attr("href");
            if (!href) return;

            const url = new URL(href, window.location.origin);
            const path = url.pathname;
            const hash = url.hash;

            e.preventDefault();
            router.push(path + hash);
          }
        );

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
              "a.button.product_type_auction, a.button.alt.uwa_pay_now, .uwa_auction_product_countdown, a.button.product_type_simple"
            );
          if (details.length && button.length) {
            details.after(button);
          }
        });

        $(".woo-ua-winned-for.winning_bid").text("Sold via Bid");
        $(".woo-ua-sold-for.sold_for").text("Sold via Buy Now");

        $(".home_products_sec .product").each(function () {
          const $link = $(this)
            .find(".woocommerce-LoopProduct-link")
            .attr("href");
          $(this)
            .find(".short_des_loop")
            .append(
              `<a href="${$link}#bidding" style="margin-left: 20px;" id="hwa_button" class="button">How to bid</a>`
            );
          $(this).find(".button").wrapAll("<div class='button_wrap'></div>");
          $(".auctionTow-page ul.products li.product").css("opacity", "1");
        });

        if (window.location.href.includes("bidding")) {
          $("html, body").animate({
            scrollTop: $("#bidding_sec").offset()?.top
              ? $("#bidding_sec").offset()!.top - 300
              : 0,
          });
        }

        $(document).on("click", ".how-to-bid-button", function (e) {
          e.preventDefault();
          alert("Open How to Bid instructions or modal here.");
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

        function sortProductsPriceDescending() {
          [
            ".home_products_sec:not(.closed_auctions) ul.products",
            ".closed_auc ul.products",
          ].forEach((selector) => {
            const $wrapper = $(selector);
            const products = $wrapper.find("li.product").toArray();

            products.sort((a, b) => {
              const priceA = parseFloat($(a).attr("data-price") ?? "0");
              const priceB = parseFloat($(b).attr("data-price") ?? "0");
              return priceB - priceA;
            });

            $wrapper.append(products);
          });
        }

        sortProductsPriceDescending();
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        $(document).off("click", "a.product_type_auction, a.button.product_type_simple");
        $(document).off("click", "#hwa_button");
      };
    }
  }, [htmlContent, loading]);

  return (
    <div className="auctionTow-page">
      <div className="title-all">
        <h1
          className={`${marcellus.className} uppercase text-center text-[26px] md:text-5xl font-extrabold`}
        >
          Leatherwood Farm Trail Horses
        </h1>
      </div>
      <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] my-10 sm:my-10 about px-2">
        <div className="mb-15">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid p-0 md:p-1">
              <Image
                src="/assets/img/leatherwood1.jpg"
                alt={"Leatherwood Farm Trail Horses"}
                width={1000}
                height={1000}
                className="object-cover"
              />
            </div>
            <div className="p-0 md:p-1">
              <p
                className={`${raleway.className} text-center text-base mb-6 leading-[1.8em] text-[#222]`}
              >
                At Leatherwood Farm, we specialize in starting young horses
                under saddle for trail and pleasure riding. Our approach
                combines patience, skill and a deep understanding of equine
                behavior to create confident and responsive partners for
                leisurely outings on the trails.
              </p>
            </div>
          </div>

          <div className="grid md:flex gap-4 pt-5">
            <div className="w-full md:w-1/3 p-0 md:p-1">
              <div
                className="fb-page"
                data-href="https://www.facebook.com/105127196018771"
                data-tabs="timeline"
                data-width="360"
                data-height="130"
                data-small-header="false"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="true"
              >
                <blockquote
                  cite="https://www.facebook.com/105127196018771"
                  className="fb-xfbml-parse-ignore"
                >
                  <a href="https://www.facebook.com/105127196018771">
                    Leatherwood Farm Trail Horses
                  </a>
                </blockquote>
              </div>
            </div>
            <div className="w-full md:w-2/3 p-0 md:p-1">
              <Image
                src="/assets/img/leatherwood4.jpg"
                alt={"Leatherwood Farm Trail Horses"}
                width={1000}
                height={1000}
                className="object-cover"
              />
            </div>
          </div>

          <div className="description w-full text-center pt-5 md:pt-10">
            <h2>
              PLEASE CALL US WITH ANY QUESTIONS YOU HAVE, OR COME TEST RIDE ANY
              OF THE AVAILABLE HORSES
            </h2>
            <p
              className={`${raleway.className} text-center text-[14px] font-semibold italic mb-6 leading-[1.8em] text-[#222]`}
            >
              Under the guidance of experienced trainers at Leatherwood Farm,
              horses undergo a progressive training approach. Groundwork
              exercises and gentle rides in controlled environments help build
              trust and confidence, laying the groundwork for successful trail
              and pleasure riding experiences.
            </p>
          </div>

          <div className="description w-full flex flex-col items-center text-center">
            <h2>WE LOVE HAPPY CUSTOMERS!!</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="flex justify-center p-0 md:p-1">
                <Image
                  src="/assets/img/leatherwood2.jpg"
                  alt={"Leatherwood Farm Trail Horses"}
                  width={350}
                  height={350}
                  className="object-cover"
                />
              </div>
              <div className="flex justify-center p-0 md:p-1">
                <Image
                  src="/assets/img/leatherwood3.jpg"
                  alt={"Leatherwood Farm Trail Horses"}
                  width={350}
                  height={350}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="auctionTow-page">
          {loading ? (
            <Loader />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: filterHTMLContent(htmlContent || "", ["products"]),
              }}
              className="text-gray-700"
            ></div>
          )}
        </div>
      )}
    </div>
  );
}
