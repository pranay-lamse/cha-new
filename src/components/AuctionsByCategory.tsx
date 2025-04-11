import { GetAuctionsByCategory } from "@/actions";
import { marcellus } from "@/config/fonts";
import { Variables } from "@/interfaces";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { Description } from "./Description";
import { MAX_RESULTS } from "@/constants";
import { Pagination } from "./Pagination";

interface Props {
  slug: string;
  title: string;
  searchParams?: {
    query?: string;
    page?: string;
  };
}

export const AuctionsByCategory = async ({
  slug,
  title,
  searchParams,
}: Props) => {
  const currentPage = Number(searchParams?.page) || 1;
  const params: Variables = { slug, after: currentPage };
  const { products } = await GetAuctionsByCategory(params);
  const { found, nodes } = products;
  const totalPages = !!found ? Math.ceil(found / MAX_RESULTS) : 0;

  const imagePlaceholder = "/assets/img/placeholder.png";
  console.log("nodes", nodes);
  return (
    <>
      <div className="grid">
        <div className="title-all">
          <h1 className={`${marcellus.className} text-center text-5xl`}>
            {title}
          </h1>
        </div>
        <div className="container mx-auto w-[1170px]">
          {nodes.map((auction, index) => (
            <div
              key={auction.databaseId}
              className="grid gap-8 md:grid-cols-2 grid-cols mb-20 mt-8 items-center"
            >
              <Link
                className={index % 2 === 0 ? "md:order-1" : "md:order-2"}
                href={auction.uri}
              >
                <Image
                  src={
                    auction.featuredImage?.node.sourceUrl || imagePlaceholder
                  }
                  alt={auction.title}
                  sizes="100vw"
                  width={500}
                  height={500}
                  priority={false}
                  style={{ width: "100%", height: "auto" }}
                  className="rounded-xl"
                />
              </Link>
              <div className={index % 2 === 0 ? "md:order-2" : "md:order-1"}>
                <h2
                  className={`${marcellus.className} mb-9 text-4xl after:block after:content-[''] after:bottom-0 after:left-0 after:w-full after:bg-title-gradient after:h-1`}
                >
                  {auction.title}
                </h2>
                <span className={`${marcellus.className} block mb-10 text-2xl`}>
                  {currencyFormat(+auction.price)}
                </span>
                <Description shortDescription={auction.shortDescription} />
                <div className="buttons-actions">
                  <Link
                    className="focus:outline-none border border-[#dac172] text-white bg-golden-bold font-medium text-base text-center px-8 py-3.5 me-4 mb-2 hover:bg-transparent hover:border hover:border-[#dac172] hover:text-[#dac172] transition-all duration-300"
                    href={auction.uri}
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {totalPages > 1 && <Pagination totalPages={totalPages} />}
    </>
  );
};
