import { marcellus, raleway } from "@/config/fonts";
import Link from "next/link";
import coverImg from "@/cover-md.webp";
import Image from "next/image";

export const Cover = () => {
  return (
    <div className="relative bg-cover">
      <Image
        fill
        className="object-center object-cover pointer-events-none"
        src={coverImg}
        alt={"cover"}
        priority={false}
      />
      <div className="relative z-1">
        <div className="bg-black opacity-60 absolute inset-0"></div>
        <div className="flex flex-col relative justify-center z-10 min-h-[400px] md:min-h-[700px] home-cover">
          <h2
            className={`${marcellus.className} text-center text-[26px] md:text-[45px] text-white mb-8 md:pt-[200px]`}
          >
            Classic Horse Auction
          </h2>
          <p
            className={`${raleway.className} text-white text-center text-sm mb-8`}
          >
            Classic Horse Auction brings over 25 years of equine marketing
            experience to the online trading industry.
          </p>
           <div className="flex justify-center mb-6">
            <Link
             className="text-white bg-[#dac172] text-[14px] text-center px-[28px] py-[18px] me-2 mb-2 border border-[#dac172] min-w-[175px] w-auto rounded-none transition-all duration-300 ease-in-out hover:bg-transparent hover:border-[#dac172] hover:text-[#dac172] tracking-wider"
              href="/cha-horse-submit"
            >
              Auction submission form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};