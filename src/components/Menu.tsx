"use client";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { MenuItemsNode } from "@/interfaces";
import { marcellus, raleway } from "@/config/fonts";
import { usePathname } from "next/navigation";
import { MENUS, MENUSWITHLOGIN } from "@/constants";
import { sanitizeUrl } from "@/utils";
import { useAuth } from "@/app/providers/UserProvider";

interface Props {
  menuTree: MenuItemsNode[];
}

export const Menu = ({ menuTree }: Props) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const threshold = 10;

  const [query, setQuery] = useState("");

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/?search=${encodeURIComponent(query)}`;
    }
  };

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    onScroll();
  }, [onScroll]);

  const renderMenu = (items: MenuItemsNode[], isChildren = false) => (
    <ul
      className={clsx({
        "py-2 text-sm absolute bg-deep-navy": isChildren,
        "flex flex-col p-4 lg:p-0 mt-4 font-medium border border-gray-100 rounded-lg lg:space-x-8 rtl:space-x-reverse lg:flex-row lg:mt-0 lg:border-0":
          !isChildren,
      })}
    >
      {items.map((item) => (
        <li
          key={item.databaseId}
          onMouseLeave={() => !isChildren && setDropdownIsOpen(false)}
        >
          {item.isParent ? (
            <>
              <button
                id="dropdownNavbarLink"
                onMouseEnter={() => setDropdownIsOpen(true)}
                onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
                data-dropdown-toggle="dropdownNavbar"
                className={`flex items-center justify-between w-full py-2 px-3 text-white uppercase ${marcellus.className}`}
              >
                {item.label}{" "}
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                id="dropdownNavbar"
                className={clsx(
                  "z-10 font-normal divide-y divide-gray-100 rounded-lg shadow w-44 absolute",
                  {
                    hidden: !dropdownIsOpen,
                  }
                )}
              >
                <ul className="py-2 text-sm absolute bg-deep-navy">
                  <li>
                    <Link
                      className="block lg:hover:text-golden uppercase __className_9ae19a /all-auctions/ text-white px-4 py-2"
                      href={"/all-auctions"}
                    >
                      All Auctions
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block lg:hover:text-golden uppercase __className_9ae19a /current-auctions/ text-white px-4 py-2"
                      href={"/current-auctions"}
                    >
                      Current Auctions
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block lg:hover:text-golden uppercase __className_9ae19a /closed-auctions/ text-white px-4 py-2"
                      href={"/closed-auctions"}
                    >
                      Closed Auctions
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link
              className={clsx(
                `block lg:hover:text-golden uppercase ${marcellus.className} ${item.path}`,
                {
                  "text-white": sanitizeUrl(item.uri) !== pathname,
                  "text-golden": sanitizeUrl(item.uri) === pathname,
                  "px-4 py-2": isChildren,
                  "py-2 px-3 rounded lg:hover:bg-transparent lg:p-0":
                    !isChildren,
                }
              )}
              href={
                (isAuthenticated ? MENUSWITHLOGIN : MENUS).find(
                  (menu) => menu.route === sanitizeUrl(item.uri)
                )
                  ? item.uri
                  : item.url
              }
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
      {isAuthenticated && (
        <li>
          <button
            onClick={() => {
              Cookies.remove("authToken");
              Cookies.remove("refreshToken");
              Cookies.remove("user");
              Cookies.remove("rememberMe");
              window.location.href = "/my-account";
            }}
            className={`block lg:hover:text-golden uppercase ${marcellus.className} text-white px-4 py-2`}
          >
            Logout
          </button>
        </li>
      )}
      {!isChildren && (
        <li
          className="hidden lg:flex items-center cursor-pointer px-2"
          onClick={() => setSearchIsOpen(true)}
        >
          <svg
            className="text-white w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </li>
      )}
    </ul>
  );

  return (
    <header
      className={clsx("w-full z-99", {
        absolute: pathname === "/",
      })}
    >
      <nav
        className={clsx(
          "flex-no-wrap top-0 z-10 flex w-full items-center justify-center all-menu",
          {
            static: !scrolled,
            fixed: scrolled,
            "home-menu": pathname === "/",
          }
        )}
      >
        <div className="inner-header mx-auto container flex flex-col justify-center">
          <Link href="/" className="flex justify-center logo items-center">
            <Image
              src="/assets/img/logo.png"
              width={1000}
              height={1000}
              className="h-12 mx-3 w-auto"
              alt="Classic Horse Auction"
            />
          </Link>
          <div className="">
            <button
              type="button"
              data-collapse-toggle="navbar-search"
              aria-controls="navbar-search"
              aria-expanded="false"
              className="lg:hidden text-white hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 rounded-lg text-sm p-2.5 me-1"
              onClick={() => setSearchIsOpen(true)}
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
            {!isOpen ? (
              <button
                onClick={() => setIsOpen(true)}
                data-collapse-toggle="navbar-search"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg lg:hidden"
                aria-controls="navbar-search"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg lg:hidden"
                aria-controls="navbar-search"
                aria-expanded="false"
              >
                <span className="sr-only">Close main menu</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <div
            className={clsx(
              "items-center navbar justify-center w-full lg:flex lg:w-auto lg:order-1",
              {
                hidden: !isOpen,
              }
            )}
            id="navbar-search"
          >
            {renderMenu(isAuthenticated ? menuTree : menuTree)}
          </div>
        </div>
      </nav>
      <div
        className={clsx(
          "target:block inset-0 p-10 bg-black/75 overflow-auto z-50",
          {
            hidden: !searchIsOpen,
            fixed: searchIsOpen,
          }
        )}
      >
        <div className="search-modal flex items-center justify-center h-full mx-auto">
          <form className="flex items-center mx-auto" onSubmit={handleSearch}>
            <div className="relative mt-6">
              <input
                type="search"
                name="s"
                id="search"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="peer mt-1 w-full text-center text-[#fff] text-[32px] sm:text-5xl bg-transparent border-b-2 border-[#fff] focus:outline-none focus:border-[#fff] focus:ring-0"
              />
              <label htmlFor="search" className="opacity-0">
                Search
              </label>
            </div>
          </form>
          <div
            className="close_icon px-1 py-0 flex justify-end mr-4 cursor-pointer text-[#515962]"
            onClick={() => setSearchIsOpen(false)}
          >
            <span>X</span>
          </div>
        </div>
      </div>
    </header>
  );
};