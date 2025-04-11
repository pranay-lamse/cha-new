import { marcellus, raleway } from "@/config/fonts";
import { Status, Variables } from "@/interfaces";
import { currencyFormat } from "@/utils/currencyFormat";
import Image from "next/image";
import Link from "next/link";
import { Description, Pagination } from "@/components";
import { getAuctions } from "@/actions";
import { MAX_RESULTS } from "@/constants";
import { Timer } from "./Timer";
import { MoreDetails } from "./MoreDetails";
import { ProductGalleryPage } from "./ProductGallery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

interface Props {
  status: Status;
  title: string;
  searchParams?: {
    query?: string;
    page?: string;
  };
}

export const AuctionDetails = async ({
  status,
  title,
  searchParams,
}: Props) => {
  const currentPage = Number(searchParams?.page) || 1;
  const params: Variables = { status, after: currentPage };
  const { auctionProducts } = await getAuctions(params);
  const { found, nodes } = auctionProducts;
  const auction = auctionProducts.nodes[0]; // Adjust this line based on the correct property name
  const totalPages = !!found ? Math.ceil(found / MAX_RESULTS) : 0;
  const originalUrl = process.env.NEXT_PUBLIC_ORIGINAL;
  const imagePlaceholder = "/assets/img/placeholder.png";

  console.log("auctionProducts", auctionProducts);

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] p-4 my-10 sm:my-28">
      <div className="w-full aspect-video rounded-[22px] overflow-hidden">
        <iframe
          title="VIRGIL COLE - ClassicHorseAuction.com"
          src="https://www.youtube.com/embed/0LTunXLiZjA?feature=oembed&enablejsapi=1&origin=https://classichorseauction.com"
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          id="92293049"
        ></iframe>
      </div>

      <div className="mt-8">
        <h2
          className={`${marcellus.className} mb-9 text-2xl sm:text-4xl after:block after:content-[''] after:bottom-0 after:left-0 after:w-full after:bg-title-gradient after:h-1`}
        >
          {auction?.title || "Loading..."}
        </h2>

        <span className={`${raleway.className} text-[15px] font-bold mb-2`}>
          {+auction.currentBid === 0 ? "Starting bid:" : "Current bid:"}
        </span>
        <span
          className={`${marcellus.className} block mb-2 text-xl sm:text-2xl`}
        >
          {+auction.currentBid === 0
            ? currencyFormat(+auction.startPrice)
            : currencyFormat(+auction.currentBid)}
        </span>
      </div>

      <Timer title="" startDate={""} endDate={""} />

      <div className="uwa_auction_product_ajax_change">
        <div className="uwa-watchlist-button my-5">
          <a
            href="javascript:void(0)"
            data-auction-id="16671"
            className="add-uwa uwa-watchlist-action no-action"
            title="Please sign in to add auction to watchlist."
          >
            <FontAwesomeIcon icon={faHeart} className="mr-2" />
            Add to watchlist!
          </a>
        </div>

        <div className="uwa-custom-bid mb-2">
          <span className={`${raleway.className} text-[15px] font-bold mb-2`}>
            {+auction.currentBid === 0 ? "Current bid:" : ""}
          </span>
        </div>

        <form
          id="uwa_auction_form"
          className="uwa_auction_form cart"
          method="post"
          data-product_id="16671"
        >
          <div className="quantity buttons_added relative">
            <span className="uwa_currency absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-center text-white">
              $
            </span>
            <input
              type="number"
              name="uwa_bid_value"
              id="uwa_bid_value"
              data-auction-id="16671"
              min="4100"
              step="any"
              title="bid"
              className="input-text qty bid pl-8 pr-4 py-2 bg-white border border-[#dedede] text-left focus:outline-none rounded-md"
            />
          </div>

          <button
            type="submit"
            id="placebidbutton"
            className="focus:outline-none text-white border border-[#dac172] bg-golden-bold font-medium text-base text-center px-10 py-3 hover:bg-transparent hover:border hover:border-[#dac172] hover:text-[#dac172] transition-all duration-300"
          >
            Custom Bid
          </button>
          <span className="ajax-loader-placebid" style={{ display: "none" }}>
            <Image
              alt="loader"
              className="loaderimg"
              src="https://cha.veerit.com/wp-content/plugins/ultimate-woocommerce-auction-pro/assets/images/ajax_loader.gif"
              style={{ visibility: "hidden", marginLeft: "5px" }}
            />
          </span>

          <div className="uwa_inc_price_hint float-left w-full pt-1.5 text-gray-800 text-xl font-extrabold">
            <small className="uwa_inc_price">
              (Enter more than or equal to:{" "}
            </small>
            <small className="uwa_inc_latest_price uwa_inc_price_ajax_16671">
              <span className="woocommerce-Price-amount amount">
                <bdi>
                  <span className="woocommerce-Price-currencySymbol">$</span>
                  4100
                </bdi>
              </span>{" "}
              and please don't enter $ , . sign while bidding
            </small>
            <small className="uwa_inc_price">
              (This will set your max bid.)
            </small>
          </div>
          {/*  <ProductGalleryPage /> */}
          <div className="description w-full">
            <h2>Description</h2>
            <Description shortDescription={auction.shortDescription} />
          </div>
          <div className="container mx-auto mt-5 mb-8">
            <div className="w-full max-w-[1170px] mx-auto">
              <div className="w-full aspect-video rounded-[22px] overflow-hidden">
                <iframe
                  title="VIRGIL COLE - ClassicHorseAuction.com"
                  src="https://www.youtube.com/embed/d-0JXBa6znk?feature=oembed"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>

          <MoreDetails />

          <input type="hidden" name="bid" value="16671" />
          <input
            type="hidden"
            id="uwa_place_bid"
            name="uwa-place-bid"
            value="16671"
          />
          <input type="hidden" name="product_id" value="16671" />
        </form>
      </div>
    </div>
  );
};
