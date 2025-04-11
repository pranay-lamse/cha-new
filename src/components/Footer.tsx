import Image from "next/image";
import Link from "next/link";
import { raleway } from "@/config/fonts";
import { Subscribe } from "@/components";
import { FaEnvelope, FaFacebookF, FaInstagram, FaMapMarkerAlt, FaPhone, FaRegEnvelope } from "react-icons/fa";


export const Footer = () => {
  return (
    <div className="footer bg-deep-navy">
      <Subscribe />
      <div className="pt-10 py-10 flex flex-col relative justify-center footer-inner">
        <div className="flex justify-center">
          <Link href="/" className="space-x-3 rtl:space-x-reverse footer-logo">
            <Image
              src="/assets/img/logo.png"
              width={500}
              height={500}
              className="h-24 w-auto"
              alt="Classic Horse Auction"
            />
          </Link>
        </div>
        {
          //TODO refactor nenus
        }
        <div className="footer-social flex justify-center gap-4 my- pt-4 pb-4">
          <Link
            href={"https://www.facebook.com/classichorseauction"}
            target="_blank"
            className="flex items-center justify-center bg-golden-light rounded-1/2 h-8 w-8"
          >
            <FaFacebookF className="text-white w-4 h-4" />
          </Link>
          <Link
            href={"https://www.instagram.com/classichorseauction"}
            className="flex items-center justify-center bg-golden-light rounded-1/2 h-8 w-8"
          >
            <FaInstagram className="text-white w-4 h-4" />
          
          </Link>
          <Link
            href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
            className="flex items-center justify-center bg-golden-light rounded-1/2 h-8 w-8"
          >
            <FaEnvelope className="text-white w-4 h-4" />
          </Link>
        </div>
        <div className="footer-links flex justify-center gap-6 px-4 py-2">
          <Link
            href="/"
            className={`${raleway.className} text-[15px] text-white font-light hover:text-golden-light px-1`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`${raleway.className} text-[15px] text-white font-light hover:text-golden-light px-1`}
          >
            About
          </Link>
          <Link
            href="/all-auctions"
            className={`${raleway.className} text-[15px] text-white font-light hover:text-golden-light px-1`}
          >
            All Auctions
          </Link>
          <Link
            href="/current-auctions"
            className={`${raleway.className} text-[15px] text-white font-light hover:text-golden-light px-1`}
          >
            Current Auctions
          </Link>
          <Link
            href="/closed-auctions"
            className={`${raleway.className} text-[15px] text-white font-light hover:text-golden-light px-1`}
          >
            Closed Auctions
          </Link>
          <Link
            href="/contact"
            className={`${raleway.className} text-[15px] text-white font-light hover:text-golden-light px-1`}
          >
            Contact
          </Link>
        </div>

        <div className="footer-info flex justify-center items-center h-full w-full pt-2">
          <ul className="flex space-x-6 items-center text-white text-[14px]">
            <li className="flex items-center space-x-2 text-[14px] hover:text-golden-light">
            <FaMapMarkerAlt className="text-white w-4 h-4" />
              <span>Lewisburg, TN</span>
            </li>
            <li className="flex items-center space-x-2 text-[14px]">
              <a
                href="tel:9312242968"
                className="flex items-center space-x-2 text-white hover:text-golden-light"
              >
                <FaPhone className="text-white w-4 h-4" />
                <span>931-224-2968</span>
              </a>
            </li>
            <li className="flex items-center space-x-2 text-[14px">
              <a
                href="mailto:justin@classichorseauction.com"
                className="flex items-center space-x-2 text-white hover:text-golden-light"
              >
                <FaRegEnvelope className="text-white w-4 h-4" />
                <span>justin@classichorseauction.com</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
