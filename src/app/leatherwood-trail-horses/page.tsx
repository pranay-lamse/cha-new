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

        reorderProducts();
        $(window).on("resize", reorderProducts);

        return () => {
          $(window).off("resize", reorderProducts);
        };
      }, 100);
    }
  }, [htmlContent, loading]);

  useEffect(() => {
    // Ensure the Facebook SDK is loaded
    if (
      typeof window !== "undefined" &&
      !document.getElementById("facebook-jssdk")
    ) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src =
        "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        if (window.FB) {
          window.FB.XFBML.parse();
          setLoading(false);
        } else {
          console.error("Facebook SDK failed to load.");
        }
      };
      script.onerror = () => {
        console.error("Error loading the Facebook SDK script.");
      };
      document.body.appendChild(script);
    }
  }, []);

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
