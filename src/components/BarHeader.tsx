"use client";
import { raleway } from "@/config/fonts";
import { faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faChevronCircleRight,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

export const BarHeader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="hidden topbar md:block w-full bg-golden-light">
      <div className="container mx-auto">
        <div className="grid grid-flow-col">
          <div className="flex social-links items-center">
            <Link
              href="https://www.facebook.com/classichorseauction"
              target="_blank"
              className="flex  mx-1 bg-twilight-navy rounded-1/2 items-center justify-center "
            >
              {!loading && (
                <FontAwesomeIcon
                  icon={faFacebookF}
                  className="flex text-white"
                />
              )}
            </Link>
            <Link
              href="https://www.instagram.com/classichorseauction"
              target="_blank"
              className="flex mx-1 bg-twilight-navy rounded-1/2 items-center justify-center "
            >
              {!loading && (
                <FontAwesomeIcon icon={faInstagram} className=" text-white" />
              )}
            </Link>
            <Link
              href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
              className="flex mx-1 bg-twilight-navy rounded-1/2 items-center justify-center "
            >
              {!loading && (
                <FontAwesomeIcon icon={faEnvelope} className=" text-white" />
              )}
            </Link>
          </div>
          <div className="topbar-right flex items-center gap-8 justify-end">
            <Link href="tel:9312242968">
              <span className="mr-2">
                {/* Phone: {process.env.NEXT_PUBLIC_PHONE}{" "} */}
                Phone: 931-224-2968
              </span>
              {!loading && <FontAwesomeIcon icon={faChevronCircleRight} />}
            </Link>
            <Link href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}>
              <span className="mr-2">
                {/* Email: {process.env.NEXT_PUBLIC_EMAIL} */}
                Email: justin@classichorseauction.com
              </span>
              {!loading && <FontAwesomeIcon icon={faChevronCircleRight} />}
            </Link>
            <Link
              href="/my-account/"
              className={`${raleway.className} join-btn text-sm bg-twilight-navy text-white px-4 py-1`}
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
