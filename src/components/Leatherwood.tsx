import { GetAuctionsByCategory } from "@/actions";
import { Variables } from "@/interfaces";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { Description } from "./Description";
import { MAX_RESULTS } from "@/constants";
import { Pagination } from "./Pagination";
import { marcellus, raleway } from "@/config/fonts";

interface Props {
  slug: string;
  title: string;
  searchParams?: {
    query?: string;
    page?: string;
  };
}

export const Leatherwood = async ({
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

        <div className="title-all">
          <h1 className={`${marcellus.className} text-center text-[26px] md:text-5xl font-bold`}>
            {title}
          </h1>
        </div>
        <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] my-10 sm:my-10 about px-2">
        <div className="mb-15">
          <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid p-0 md:p-1">
                      <Image
                        src="/assets/img/leatherwood1.jpg"
                        alt={title}
                        width={1000}
                        height={1000}
                        className="object-cover"
                      />
                    </div>
                    <div className="p-0 md:p-1">
                      <p className={`${raleway.className} text-center text-base mb-6 leading-[1.8em] text-[#222]`}>At Leatherwood Farm, we specialize in starting young horses under saddle for trail and pleasure riding. Our approach combines patience, skill and a deep understanding of equine behavior to create confident and responsive partners for leisurely outings on the trails.</p>
                    </div>
          </div>



                  <div className="grid md:flex gap-4 pt-5">
                  <div className="w-full md:w-1/3 p-0 md:p-1">
                    <p className={`${raleway.className} text-center text-base mb-6 leading-[1.8em] text-[#222]`}>
                      At Leatherwood Farm, we specialize in starting young horses under saddle for trail and pleasure riding. Our approach combines patience, skill and a deep understanding of equine behavior to create confident and responsive partners for leisurely outings on the trails.
                    </p>
                  </div>
                  <div className="w-full md:w-2/3 p-0 md:p-1">
                    <Image
                      src="/assets/img/leatherwood4.jpg"
                      alt={title}
                      width={1000}
                      height={1000}
                      className="object-cover"
                    />
                  </div>
                </div>



          <div className="description w-full text-center pt-5 md:pt-10">
              <h2>PLEASE CALL US WITH ANY QUESTIONS YOU HAVE, OR COME TEST RIDE ANY OF THE AVAILABLE HORSES</h2>
              <p className={`${raleway.className} text-center text-[14px] font-semibold italic mb-6 leading-[1.8em] text-[#222]`}>
              Under the guidance of experienced trainers at Leatherwood Farm, horses undergo a progressive training approach. Groundwork exercises and gentle rides in controlled environments help build trust and confidence, laying the groundwork for successful trail and pleasure riding experiences.</p>
          </div>

          <div className="description w-full flex flex-col items-center text-center">
          <h2>WE LOVE HAPPY CUSTOMERS!!</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="flex justify-center p-0 md:p-1">
              <Image
                src="/assets/img/leatherwood2.jpg"
                alt={title}
                width={350}
                height={350}
                className="object-cover"
              />
            </div>
            <div className="flex justify-center p-0 md:p-1">
              <Image
                src="/assets/img/leatherwood3.jpg"
                alt={title}
                width={350}
                height={350}
                className="object-cover"
              />
            </div>
          </div>


          </div>
        </div>

      </div>

    </>
  );
};
