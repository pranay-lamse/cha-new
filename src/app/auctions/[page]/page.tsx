"use client";
import { marcellus, raleway } from "@/config/fonts";
import { Status, Variables } from "@/interfaces";
import { currencyFormat } from "@/utils/currencyFormat";
import Image from "next/image";
import Link from "next/link";
import { Description, Pagination } from "@/components";
import { getAuctions } from "@/actions";
import { MAX_RESULTS } from "@/constants";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useCallback } from "react";
import axiosClientGeneralToken from "@/api/axiosClientGeneralToken";
import axiosClientGeneralTokenCustomApi from "@/api/axiosClientGeneralTokenCustomApi";
import Timer from "@/components/Timer";
import { ProductGalleryPage } from "@/components/ProductGallery";
import { MoreDetails } from "@/components/MoreDetails";
import Loader from "@/components/Loader";
import DocumentCard from "@/components/Document";
import { redirect, usePathname } from "next/navigation";
import $ from "jquery";

import axios from "axios";
import Cookies from "js-cookie";
import { env } from "@/env";
import axiosClient from "@/api/axiosClient";
import axiosClientwithApi from "@/api/axiosClientwithApi";
import { filterHTMLContent } from "@/utils/htmlHelper";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { fetchHtmlData } from "@/lib/fetchHtmlData";
import { getToken } from "@/utils/storage";
import { placeAuctionBid } from "@/services/placeBid";
interface Props {
  status: any;
  title: any;
  searchParams?: {
    query?: any;
    page?: any;
  };
}

const AuctionDetails = () => {
  const [bidStatus, setBidStatus] = useState("active");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [bidMessage, setBidMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState(false);

  const pathname = usePathname();
  const token = getToken();
  const slug = pathname.split("/").pop();
  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/auctions/${slug}`;

  // --- Centralized HTML Fetch ---
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
      const noticeWrapper = document.querySelector("body");
      if (noticeWrapper) {
        noticeWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.log("Element not found");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [bidStatus]);

  useEffect(() => {
    fetchData();
  }, []);

  // --- Combined jQuery click handlers ---
  useEffect(() => {
    const handleClick = function (this: any, e: JQuery.ClickEvent) {
      e.preventDefault();
      const auctionId = $(this).data("auction-id");
      if (auctionId) {
        handleWatchListSubmit(auctionId);
      }
    };

    $(document).on("click", ".add-uwa, .remove-uwa", handleClick);

    return () => {
      $(document).off("click", ".add-uwa, .remove-uwa", handleClick);
    };
  }, []);

  useEffect(() => {
    if (!loading && htmlContent) {
      const timeoutId = setTimeout(() => {
        $(".clock_jquery").each(function () {
          const el = $(this);
          const timeStr = el.data("time");
          const [datePart, timePart] = timeStr.split(" ");
          const [year, month, day] = datePart.split("-").map(Number);
          const [hour, minute, second] = timePart.split(":").map(Number);
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

            el.html(`
            <span class="countdown_row countdown_show4">
              <span class="countdown_section"><span class="countdown_amount">${d}, </span><br>Day(s)</span>
              <span class="countdown_section"><span class="countdown_amount">${h}, </span><br>Hour(s)</span>
              <span class="countdown_section"><span class="countdown_amount">${m}, </span><br>Min(s)</span>
              <span class="countdown_section"><span class="countdown_amount">${s}</span><br>Sec(s)</span>
            </span>`);
          }

          update();
          const timer = setInterval(update, 1000);
        });
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [htmlContent, loading]);

  const handleWatchListSubmit = async (auctionId: string | number) => {
    if (!token) {
      setLoginMessage(true);
      return;
    }

    try {
      await axios.get(
        `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-admin/admin-ajax.php`,
        {
          params: { "uwa-ajax": "watchlist", post_id: auctionId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchData();
    } catch (error: any) {
      console.error(
        "Error adding to watchlist:",
        error.response?.data || error.message
      );
    }
  };

  // --- Add to Cart Button Handler ---
  useEffect(() => {
    const form = document.querySelector("form.buy-now.cart");
    const submitBtn = form?.querySelector("button.single_add_to_cart_button");

    if (!form || !submitBtn) return;

    submitBtn.setAttribute("type", "button");

    const handleAddToCartClick = async (e: Event) => {
      e.preventDefault();

      if (!token) {
        setLoginMessage(true);
        return;
      }

      const target = e.currentTarget as HTMLButtonElement;
      target.classList.add("loading");
      target.classList.remove("added");

      if (!target.querySelector(".spinner")) {
        const spinner = document.createElement("span");
        spinner.className = "spinner";
        target.appendChild(spinner);
      }

      const formData = new FormData(form as HTMLFormElement);
      const productId =
        formData.get("product_id") || formData.get("add-to-cart");

      if (!productId) {
        alert("Product ID missing");
        target.classList.remove("loading");
        target.querySelector(".spinner")?.remove();
        return;
      }

      try {
        await axios.get(
          `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/auctions/${slug}?add-to-cart=${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        $("body").trigger("added_to_cart", [{}, "", $(target)]);

        const messageContainer = document.createElement("div");
        messageContainer.className = "woocommerce-notices-wrapper";
        messageContainer.innerHTML = `
        <div class="woocommerce-message" role="alert" tabindex="-1">
          ${slug} has been added to your cart. <a href="/cart/" class="button wc-forward">View cart</a>
        </div>`;
        document.querySelector(".woocommerce-notices-wrapper")?.remove();
        document.querySelector(".video-container")?.prepend(messageContainer);

        target.classList.add("added");
      } catch (error) {
        console.error("Add to cart failed:", error);
      } finally {
        target.classList.remove("loading");
        target.querySelector(".spinner")?.remove();
        const noticeWrapper = document.querySelector("body");
        if (noticeWrapper) {
          noticeWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          console.log("Element not found");
        }
      }
    };

    const buttons = document.querySelectorAll(
      "button.single_add_to_cart_button"
    );
    buttons.forEach((btn) =>
      btn.addEventListener("click", handleAddToCartClick)
    );

    return () => {
      buttons.forEach((btn) =>
        btn.removeEventListener("click", handleAddToCartClick)
      );
    };
  }, [token, htmlContent]);

  // --- Product Fetch for Page ---
  useEffect(() => {
    const fetchSingleProduct = async () => {
      setLoading(true);
      try {
        const response = await axiosClientGeneralTokenCustomApi.get(
          `/wp-json/wc/v3/products?slug=${slug}`
        );
        setData(response.data || {});
      } catch (error) {
        console.error("Error fetching about data:", error);
        setData({});
      } finally {
        setLoading(false);
        const noticeWrapper = document.querySelector("body");
        if (noticeWrapper) {
          noticeWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          console.log("Element not found");
        }
      }
    };
    fetchSingleProduct();
  }, []);

  // --- Bid Form Submission ---
  useEffect(() => {
    const handleFormSubmit = async (e: JQuery.SubmitEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!token) {
        setLoginMessage(true);
        return;
      }

      const form = $(e.target);
      const button = form.find("#placebidbutton");
      const bidValue = form.find("#uwa_bid_value").val();

      if (!bidValue || isNaN(Number(bidValue))) {
        alert("Please enter your bid before placing it.");
        return;
      }

      button.prop("disabled", true);
      button.prepend('<span class="spinner" id="bid-spinner"></span>');
      button
        .contents()
        .filter(function () {
          return this.nodeType === 3;
        })
        .first()
        .replaceWith(" Placing bid...");

      try {
        const productId = form.find("input[name='product_id']").val();
        await placeAuctionBid({
          productId,
          auctionId: productId,
          bidAmount: bidValue,
        });

        fetchData();
        setBidMessage(`Your bid of $${bidValue} has been placed successfully!`);
      } catch (err) {
        console.error("Bid failed:", err);
      } finally {
        button.prop("disabled", false);
        $("#bid-spinner").remove();
        button.text("Custom Bid");

        const noticeWrapper = document.querySelector("body");
        if (noticeWrapper) {
          noticeWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          console.log("Element not found");
        }
      }
    };

    $(document).on("submit", "#uwa_auction_form", handleFormSubmit);
    return () => {
      $(document).off("submit", "#uwa_auction_form", handleFormSubmit);
    };
  }, []);

  const imagePlaceholder = "/assets/img/placeholder.png";
  if (loading)
    return (
      <>
        <Loader />
      </>
    );

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] p-4 my-10 sm:my-10">
      {data?.map((auction: any, index: number) => {
        const isEven = index % 2 === 0;
        const imageFirst =
          auction.images.length > 0 ? auction.images[0].src : imagePlaceholder;
        const videoIfram = auction.ams_acf.find(
          (item: any) => item.key == "video"
        )?.value;
        const videoIframmore = auction.meta_data.find(
          (item: any) => item.key == "_oembed_2a4981f458970ae62b20a6a6a7b398a7"
        )?.value;

        const startDateEntry = auction.meta_data.find(
          (item: any) => item.key == "woo_ua_auction_start_date"
        )?.value;

        const endDateEntry = auction.meta_data.find(
          (item: any) => item.key === "woo_ua_auction_end_date"
        )?.value;

        const more_information = auction.meta_data.find(
          (item: any) => item.key === "more_information"
        )?.value;

        const prepurchase_exam = auction.ams_acf.find(
          (item: any) => item.key === "prepurchase_exam"
        )?.value;

        const COGGINS = auction.ams_acf.find(
          (item: any) => item.key === "coggins"
        )?.value;
        return (
          <div key="auction.id" className="woocommerce auction-deatils-page">
            {bidMessage && (
              <div className="woocommerce-notices-wrapper">
                <div className="woocommerce-message" role="alert">
                  {bidMessage}
                </div>
              </div>
            )}
            {loginMessage && (
              <div className="woocommerce-notices-wrapper">
                <ul className="woocommerce-error" role="alert">
                  <li>
                    Please Login/Register in to place your bid or buy the
                    product.{" "}
                    <a href="/my-account" className="button">
                      Login/Register →
                    </a>{" "}
                  </li>
                </ul>
              </div>
            )}
            <div className="w-full aspect-video rounded-[22px] overflow-hidden">
              {videoIfram ? (
                <div
                  key={auction.id}
                  className="video-container"
                  dangerouslySetInnerHTML={{
                    __html: videoIfram,
                  }}
                />
              ) : (
                ""
              )}
            </div>

            <div className="mt-8">
              <h2
                className={`${marcellus.className} mb-9 text-2xl sm:text-4xl after:block after:content-[''] after:bottom-0 after:left-0 after:w-full after:bg-title-gradient after:h-1`}
              >
                {auction?.name || "Loading..."}
              </h2>

              {auction.price_html ? (
                <div
                  className={`${marcellus.className} block mb-4 md:mb-6 text-xl md:text-2xl`}
                  dangerouslySetInnerHTML={{
                    __html: auction.price_html,
                  }}
                />
              ) : (
                ""
              )}

              {loading ? (
                <Loader />
              ) : (
                <div
                  className="mb-2"
                  dangerouslySetInnerHTML={{
                    __html: filterHTMLContent(htmlContent || "", [
                      "uwa_proxy_text",
                    ]),
                  }}
                ></div>
              )}

              <div className="">
                {loading ? (
                  <Loader />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: filterHTMLContent(htmlContent || "", [
                        "uwa_auction_product_countdown",
                      ]),
                    }}
                    className="text-gray-700"
                  ></div>
                )}
              </div>
            </div>
            {loading ? (
              <Loader />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: filterHTMLContent(htmlContent || "", [
                    "uwa_auction_product_ajax_change",
                  ]),
                }}
              ></div>
            )}
            {loading ? (
              <Loader />
            ) : (
              <div
                className="mb-2"
                dangerouslySetInnerHTML={{
                  __html: filterHTMLContent(htmlContent || "", ["buy-now"]),
                }}
              ></div>
            )}

            <div className="uwa_auction_product_ajax_change">
              {auction.images.length > 1 ? (
                <ProductGalleryPage {...auction.images} />
              ) : (
                ""
              )}
              {auction.short_description ? (
                <Description shortDescription={auction.short_description} />
              ) : (
                ""
              )}
              {/* if more video present  */}
              {videoIframmore ? (
                <div
                  key={auction.id}
                  className="video-container"
                  dangerouslySetInnerHTML={{
                    __html: videoIframmore,
                  }}
                />
              ) : (
                ""
              )}

              <div className="flex flex-col md:flex-row items-center gap-2 DocumentCard">
                <DocumentCard name="HEALTH DOC" src={prepurchase_exam.url} />
                <DocumentCard name="COGGINS" src={COGGINS.url} />
              </div>
              {/* Rules  */}
              {more_information ? (
                <div
                  className={`${marcellus.className} ac-description block my-8 my:mb-10 text-[16px] md:text-[16px]`}
                  dangerouslySetInnerHTML={{
                    __html: more_information,
                  }}
                />
              ) : (
                ""
              )}

              {loading ? (
                <Loader />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: filterHTMLContent(htmlContent || "", [
                      "woocommerce-Tabs-panel--uwa_auction_bids_history",
                    ]),
                  }}
                ></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AuctionDetails;
