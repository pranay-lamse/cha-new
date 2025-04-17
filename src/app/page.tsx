import type { Metadata } from "next";
import { getMetadata } from "@/actions";
import {
  Auctions,
  Cover,
  ClosedAuctions,
  GetInTouch,
  Newsletter,
} from "@/components";
import { searchProps } from "@/interfaces";
import CurrentAuction from "./current-auctions/page";
import Link from "next/link";
import { cormorantSC, marcellus, raleway } from "@/config/fonts";
import { GetInTouchMain } from "@/components/GetInTouchMain";
export async function generateMetadata(): Promise<Metadata> {
  const { metadata: meta } = await getMetadata();

  return {
    description: meta.seo.description,
    openGraph: {
      locale: meta.seo.openGraph.locale,
      type: meta.seo.openGraph.type,
      title: meta.seo.openGraph.title,
      description: meta.seo.openGraph.description,
      url: meta.seo.openGraph.url,
      siteName: meta.seo.openGraph.siteName,
      images: {
        url: `${process.env.NEXT_PUBLIC_AUTH_URL}/assets/img/logo-white.png`,
        secureUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/assets/img/logo-white.png`,
        width: 512,
        height: 512,
        alt: "Home",
        type: "image/png",
      },
    },
    robots: meta.seo.robots.join(),
    title: meta.seo.title,
    twitter: {
      card: meta.seo.openGraph.twitterMeta.card,
      title: meta.seo.openGraph.twitterMeta.title,
      description: meta.seo.openGraph.twitterMeta.description,
      images: {
        url: `${process.env.NEXT_PUBLIC_AUTH_URL}/assets/img/logo-white.png`,
        secureUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/assets/img/logo-white.png`,
      },
    },
  };
}

export default async function Home(props: searchProps) {
  const searchParams = await props.searchParams;

  return (
    <>
      <div className="home-main-title">
        <Cover />
        {/* <Auctions
          searchParams={searchParams}
          status="LIVE"
          title="Current Auctions"
        /> */}
        <CurrentAuction />

        <div className="flex justify-center mb-2 md:mb-6 mt-2 md:mt-10">
        <Link
          href="/closed-auctions"
          className={`border border-[#dac172] px-[26px] py-[18px] bg-[#dac172] text-center text-white text-[14px] font-bold rounded-none transition-all duration-300 ease-in-out leading-[1.1em] hover:bg-transparent hover:border-[#dac172] hover:text-[#dac172]`}
        >
          View All Closed Auctions
        </Link>
        </div>


        {/* <ClosedAuctions /> */}
        <Newsletter />
        <GetInTouchMain />
      </div>
    </>
  );
}
