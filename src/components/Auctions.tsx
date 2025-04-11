import { marcellus, raleway } from "@/config/fonts";
import { Status, Variables } from "@/interfaces";
import { currencyFormat } from "@/utils/currencyFormat";
import Image from "next/image";
import Link from "next/link";
import { Description, Pagination } from "@/components";
import { fetchAuctionProducts } from "@/api/auctionService";
import { MAX_RESULTS } from "@/constants";

interface Props {
  status: Status;
  title: string;
  searchParams?: {
    query?: string;
    page?: string;
  };
}

const imagePlaceholder = "/assets/img/placeholder.png";

export const Auctions = async ({ status, title, searchParams }: Props) => {
  const currentPage = Number(searchParams?.page) || 1;
  const params: Variables = { status, after: currentPage };

  const { auctionProducts } = await fetchAuctionProducts();
  const { found, nodes } = auctionProducts;
  const totalPages = found ? Math.ceil(found / MAX_RESULTS) : 0;

  if (!nodes.length) {
    return (
      <div className="text-center my-28">
        <h1 className={`${marcellus.className} text-center text-5xl`}>
          No auctions available
        </h1>
      </div>
    );
  }

  console.log("Auction nodes:", nodes);

  return (
    <>
      <div className="grid gap-10 mb-15">
        <div className="title-all">
          <h1
            className={`${marcellus.className} text-center text-[26px] md:text-5xl`}
          >
            {title}
          </h1>
        </div>
        <div className="container mx-auto w-full px-4 lg:w-[1170px]">
          {nodes.map((auction: any, index: any) => (
            <AuctionItem
              key={auction.databaseId}
              auction={auction}
              index={index}
            />
          ))}
        </div>
      </div>
      {totalPages > 1 && <Pagination totalPages={totalPages} />}
    </>
  );
};

interface AuctionItemProps {
  auction: any;
  index: number;
}

const AuctionItem = ({ auction, index }: AuctionItemProps) => {
  console.log("auction", auction);
  const isEven = index % 2 === 0;
  const currentBid =
    +auction.currentBid === 0
      ? currencyFormat(+auction.startPrice)
      : currencyFormat(+auction.currentBid);
  const bidLabel = +auction.currentBid === 0 ? "Starting bid:" : "Current bid:";

  return (
    <div className="grid gap-8 md:grid-cols-2 grid-cols-1 pb-12 md:pb-10 md:py-20 items-center">
      <Link
        className={`${isEven ? "md:order-1" : "md:order-2"} p-0 md:p-4`}
        href={auction.uri}
      >
        <Image
          src={auction.featuredImage?.node.sourceUrl || imagePlaceholder}
          alt={auction.title}
          sizes="100vw"
          width={500}
          height={500}
          className="rounded-xl w-full h-auto"
          {...(index === 0 ? { priority: true } : {})} // ✅ Correct way to conditionally apply `priority`
        />
      </Link>
      <div className={isEven ? "md:order-2" : "md:order-1"}>
        <h2
          className={`${marcellus.className} mb-4 md:mb-9 text-2xl md:text-4xl after:block after:content-[''] after:bottom-0 after:left-0 after:w-full after:bg-title-gradient after:h-1`}
        >
          {auction.title}
        </h2>
        <span
          className={`${raleway.className} text-[13px] md:text-[15px] font-bold mb-1 md:mb-2`}
        >
          {bidLabel}
        </span>
        <span
          className={`${marcellus.className} block mb-4 md:mb-10 text-xl md:text-2xl`}
        >
          {currentBid}
        </span>
        <Description shortDescription={auction.shortDescription} />
        <br />
        <div className="buttons-actions md:mt-5 flex flex-col md:flex-row">
          {["Bid now", "How to bid"].map((text) => (
            <Link
              key={text}
              className="focus:outline-none text-white border border-[#dac172] bg-golden-bold font-bold text-[14px] text-center px-8 py-2.5 md:px-12 md:py-3.5 mb-2 md:mb-0 md:me-4 hover:bg-transparent hover:border hover:border-[#dac172] hover:text-[#dac172] transition-all duration-300"
              href={auction.uri}
            >
              {text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
