"use client";

import { marcellus, raleway } from "@/config/fonts";
import {
  faHeart,
  faHorse,
  faNetworkWired,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Head from "next/head";
import { useEffect, useState } from "react";
import axiosClientGeneralToken from "@/api/axiosClientGeneralToken";

import { GET_ABOUT } from "@/graphql/queries/getAbout";
import Loader from "./Loader";

export const About = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAbout = async () => {
      setLoading(true);
      try {
        const response = await axiosClientGeneralToken.post("", {
          query: GET_ABOUT,
          variables: { first: 20 },
        });

        if (response.data?.data?.page) {
          setData(response.data.data);

          if (response.data.data) {
            console.log("data", response.data.data);
          }
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

    fetchAbout();
  }, []);
  /* if (data) {
    console.log("data", data.page.seo.title);
  } */

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <title>{data ? data.page.title : ""}</title>
          </Head>
          <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] my-10 sm:my-20 about px-2">
            <div className="mt-3">
              <h1
                className={`${marcellus.className} text-left text-[26px] md:text-5xl pb-3`}
              >
                {data.page.title}
              </h1>
            </div>

            {/* <div
              dangerouslySetInnerHTML={{ __html: data.page.content }}
              className="text-gray-700"
            /> */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid p-0 md:p-1">
                <Image
                  src="/assets/img/about.jpg"
                  alt={data?.page?.title}
                  width={1000}
                  height={1000}
                  className="object-cover"
                />
              </div>
              <div className="p-0 md:p-1">
                <h2
                  className={`${marcellus.className} text-2xl text-[26px] md:text-5xl mb-4`}
                >
                  MEET THE JENNE&apos; FAMILY
                </h2>
                <p
                  className={`${raleway.className} text-base mb-6 leading-[1.8em] text-[#222]`}
                >
                  {" "}
                  In July of 2022, the Jenne&apos; family established Classic
                  Horse Auction—an innovative online platform that caters to the
                  equine community&apos;s needs, providing a seamless and
                  user-friendly experience for selling and buying horses
                  nationwide. With a personal touch, Classic Horse Auction
                  strives to connect individuals with exceptional horses.
                </p>
                <p
                  className={`${raleway.className} text-base mb-6 leading-[1.8em] text-[#222]`}
                >
                  The Jenne&apos; family has made a significant impact in the
                  market, having successfully marketed over 100 horses and
                  counting in their short time on the scene. Their commitment to
                  safety and security sets them apart, earning them the highest
                  customer service ratings in the industry. Their motto,
                  “Promote as if it were our own,” reflects their dedication to
                  providing exceptional service. The Jenne&apos; family is eager
                  to assist you.
                </p>
                <p
                  className={`${raleway.className} text-base mb-6 leading-[1.8em] text-[#222]`}
                >
                  Join Justin, Hope, Jagger, Juke Rein, and Judge on this
                  remarkable equine journey.
                </p>
              </div>
            </div>
            <div className="pt-4 pb-5">
              <div className="grid grid-cols">
                <h2
                  className={`${marcellus.className} text-2xl text-[26px] md:text-5xl mb-5`}
                >
                  WHAT WE OFFER
                </h2>
                <h6
                  className={`${marcellus.className} text-xl mb-5 about-text`}
                >
                  Fulfill the personal need of a superior online horse auction
                  platform
                </h6>
                <div className="flex justify-center items-center my-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5 sm:gap-20 md:gap-40 about-icon">
                    <div>
                      <span className="grid justify-center items-center rounded-full bg-white w-24 h-24 mx-auto mb-4">
                        <FontAwesomeIcon
                          icon={faNetworkWired}
                          className="w-14 h-14 hover:scale-75"
                        />
                      </span>
                      <h4
                        className={`${marcellus.className} text-center text-base mb-6 text-[#222] text-[15px] font-bold! leading-[1.8em]`}
                      >
                        Nationwide Network
                      </h4>
                    </div>
                    <div>
                      <span className="flex justify-center items-center rounded-full bg-white w-24 h-24 mx-auto mb-4">
                        <FontAwesomeIcon
                          icon={faHorse}
                          className="w-14 h-14 hover:scale-75 transform transition duration-500"
                        />
                      </span>
                      <h4
                        className={`${marcellus.className} text-center text-base mb-6 text-[#222] text-[15px] font-bold! leading-[1.8em]`}
                      >
                        Healthy Horses
                      </h4>
                    </div>
                    <div>
                      <span className="flex justify-center items-center rounded-full bg-white w-24 h-24 mx-auto mb-4">
                        <FontAwesomeIcon
                          icon={faHeart}
                          className="w-14 h-14 text-[#69727d]! hover:scale-75"
                        />
                      </span>
                      <h4
                        className={`${marcellus.className} text-center text-base mb-6 text-[#222] text-[15px] font-bold leading-[1.8em]`}
                      >
                        Nationwide Network
                      </h4>
                    </div>
                    <div>
                      <span className="flex justify-center items-center rounded-full bg-white w-24 h-24 mx-auto mb-4">
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          className="w-14 h-14 hover:scale-75"
                        />
                      </span>
                      <h4
                        className={`${marcellus.className} text-center text-base mb-6 text-[#222] text-[15px] font-bold leading-[1.8em]`}
                      >
                        Healthy Horses
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p
                    className={`${raleway.className} text-base mb-6 leading-[1.8em] text-[#222]`}
                  >
                    Our auctions are not just about buying and selling; they are
                    about building a community of horse lovers. We encourage
                    everyone to participate, whether you’re a seasoned horse
                    owner or someone who’s just starting their equine journey.
                    We also offer a subscription to our newsletter to keep our
                    community updated about upcoming auctions.
                  </p>
                  <p
                    className={`${raleway.className} text-base mb-6 leading-[1.8em] text-[#222]`}
                  >
                    At Classic Horse Auction, we believe in transparency and
                    integrity. Our closed auctions section provides information
                    about horses that have been sold, including the final bid
                    amount. This helps maintain a clear and honest trading
                    environment.
                  </p>
                </div>
                <div className="">
                  <p
                    className={`${raleway.className} text-base mb-6 leading-[1.8em] text-[#222]`}
                  >
                    We understand that buying a horse is a significant decision,
                    and we are here to assist you every step of the way. Our
                    team is always ready to answer any questions you might have
                    about the process. We are more than just an auction site; we
                    are a dedicated partner in your equine journey.
                  </p>
                  <p
                    className={`${raleway.className} text-base font-bold`}
                    style={{ fontStyle: "italic !important" }}
                  >
                    Welcome to Classic Horse Auction, where passion for horses
                    meets the convenience of online trading.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default About;
function json_decode(data: any, arg1: boolean) {
  throw new Error("Function not implemented.");
}
