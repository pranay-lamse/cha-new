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
interface Props {
  status: any;
  title: any;
  searchParams?: {
    query?: any;
    page?: any;
  };
}

const AuctionDetails = () => {
   // Removed duplicate declaration of htmlContent
   const [bidStatus, setBidStatus] = useState("active");
    const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  const pathname = usePathname();
  const token = getToken();
  // Extract 'bonafide' from the path
  const slug = pathname.split("/").pop();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  
  const fetchData = async () => {
      setLoading(true);
  
      try {
        const data = await fetchHtmlData(url);
        setHtmlContent(data);
      } catch (error) {
        setHtmlContent(null);
      } finally {
        setLoading(false);
      }
    };

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

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    $(document).on("click", ".add-uwa", function (e) {
      e.preventDefault();

      const auctionId = $(this).data("auction-id");

      if (auctionId) {
        handleWatchListSubmit(auctionId);
      }
    });
  }, []);

  useEffect(() => {
    $(document).on("click", ".remove-uwa", function (e) {
      e.preventDefault();

      const auctionId = $(this).data("auction-id");

      if (auctionId) {
        handleWatchListSubmit(auctionId);
      }
    });
  }, []);

 useEffect(() => {
  if (!loading && htmlContent) {
    const timeoutId = setTimeout(() => {
      $(function () {
        $(".clock_jquery").each(function () {
          const el = $(this);
          const timeStr = el.data("time"); // e.g., "2025-05-15 15:33:20"

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
                <span class="countdown_section"><span class="countdown_amount">${d}</span><br>Day(s)</span>
                <span class="countdown_section"><span class="countdown_amount">${h}</span><br>Hour(s)</span>
                <span class="countdown_section"><span class="countdown_amount">${m}</span><br>Min(s)</span>
                <span class="countdown_section"><span class="countdown_amount">${s}</span><br>Sec(s)</span>
              </span>`
            );
          }

          update();
          const timer = setInterval(update, 1000);

          // Cleanup timer when the element is removed
          el.data("timer", timer);
        });
      });
    }, 0);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      $(".clock_jquery").each(function () {
        const timer = $(this).data("timer");
        if (timer) {
          clearInterval(timer);
        }
      });
    };
  }
}, [htmlContent, loading]);

  const handleWatchListSubmit = async (auctionId: string | number) => {
    if (!token) {
      alert("Please log in to add to watchlist.");
      return null;
    }

    try {
      const response = await axios.get(
        `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-admin/admin-ajax.php`,
        {
          params: {
            "uwa-ajax": "watchlist",
            post_id: auctionId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        fetchData();
        /* window.location.reload(); */
      }
    } catch (error: any) {
      console.error(
        "Error adding to watchlist:",
        error.response?.data || error.message
      );
      return null;
    }
  };
  useEffect(() => {
    const fetchSingleProduct = async () => {
      setLoading(true);
      try {
        const response = await axiosClientGeneralTokenCustomApi.get(
          `/wp-json/wc/v3/products?slug=${slug}`
        );

        if (response.data) {
          setData(response.data);
        } else {
          setData({});
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
        setData({});
      } finally {
        setLoading(false);
      }
    };

    fetchSingleProduct();
  }, []);

 
  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/auctions/${slug}`;

  useEffect(() => {
    const handleFormSubmit = async (e: JQuery.SubmitEvent) => {
      e.preventDefault(); // Prevent default form submission
      e.stopPropagation(); // Stop event from propagating further
      setLoading(true);

      const form = $(e.target); // Get the form element

      // Extract form values
      const bidValue = form.find("#uwa_bid_value").val();
      const productId = form.find("input[name='product_id']").val();
      const userId = form.find("input[name='user_id']").val();

      try {
        if (token) {
          const response = await axiosClientwithApi.post(
            "/wp-json/custom-auction/v1/place-bid",
            {
              uwa_bid_value: bidValue,
              product_id: productId,
              user_id: userId,
            }
          );

          // Handle success response
          /* if (response.data.success) {
            window.location.reload();
          } */
          fetchData();
        } else {
          alert("Please login to place a bid");
          /* redirect("/login"); */
        }
      } catch (err) {
        console.error("Error submitting bid:", err);
      } finally {
        setLoading(false);
      }
    };

    // Attach event listener to form
    $(document).on("submit", "#uwa_auction_form", handleFormSubmit);

    return () => {
      $(document).off("submit", "#uwa_auction_form", handleFormSubmit);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // Directly create Date object with full timestamp
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",

      hour12: true, // Ensures AM/PM format
    });
  };
  const imagePlaceholder = "/assets/img/placeholder.png";
  if (loading)
    return (
      <>
        <Loader />
      </>
    );

  const formatYouTubeEmbed = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] p-4 my-10 sm:my-10">
      {data.map((auction: any, index: number) => {
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
          <div key="auction.id" className="auction-deatils-page">
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
              <div className="mb-2"
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
                        __html: filterHTMLContent(htmlContent || "", ["uwa_auction_product_countdown"]),
                      }}
                      className="text-gray-700"
                    ></div>
                  )}
                </div>
              {/* {startDateEntry && endDateEntry ? (
                <Timer
                  title=""
                  startDate={startDateEntry}
                  endDate={endDateEntry}
                />
              ) : (
                ""
              )} */}
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
