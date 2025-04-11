import { raleway } from "@/config/fonts";
import Link from "next/link";

export const BarFooter = () => {
  const date = new Date();

  return (
    <div className="footer-bar grid md:grid-cols-2 grid-cols bg-golden-light p-2">
      <ul className="footer-bar-copyright flex flex-wrap sm:place-content-center place-content-start">
        <li
          className={`${raleway.className} text-sm font-semibold after:content-[''] after:mx-4 after:h-1/2 after:border-r-2 after:border-solid after:border-deep-navy`}
        >
          © {date.getFullYear()} Classic Horse Auction., All rights reserved.
        </li>
        <li className={`${raleway.className} text-sm font-semibold`}>
          <Link href="https://getjanhost.com" target="_blank">
            Janhost
          </Link>
        </li>
      </ul>
      <ul className="footer-bar-links flex flex-wrap place-content-center">
        <li
          className={`${raleway.className} text-sm font-semibold after:content-[''] after:mx-4 after:h-1/2 after:border-r-2 after:border-solid after:border-deep-navy`}
        >
          <Link href="/terms-conditions-buyers">Buyer&lsquo;s Terms</Link>
        </li>
        <li
          className={`${raleway.className} text-sm font-semibold after:content-[''] after:mx-4 after:h-1/2 after:border-r-2 after:border-solid after:border-deep-navy`}
        >
          <Link href="/seller-terms-conditions">Seller&lsquo;s Terms</Link>
        </li>
        <li
          className={`${raleway.className} text-sm font-semibold after:content-[''] after:mx-4 after:h-1/2 after:border-r-2 after:border-solid after:border-deep-navy`}
        >
          <Link href="/privacy-policy">Privacy Policy</Link>
        </li>
        <li className={`${raleway.className} text-sm font-semibold`}>
          <Link href="/cookie-policy">Cookie Policy</Link>
        </li>
      </ul>
    </div>
  );
};
