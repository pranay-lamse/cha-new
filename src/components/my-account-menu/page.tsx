"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Correct import for App Router
import { lora } from "@/config/fonts";
import Cookies from "js-cookie";

export default function MenuPage() {
  const pathname = usePathname(); // ✅ Correct function for getting the current route

  const handleLogout = () => {
    try {
      // Remove authentication tokens and user info from cookies
      Cookies.remove("authToken");
      Cookies.remove("refreshToken");
      Cookies.remove("user");
      Cookies.remove("rememberMe"); // Optional, if rememberMe was set
      window.location.href = "/my-account";
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  const menuItems = [
    { href: "/my-account", label: "Dashboard" },
    { href: "/my-account/orders", label: "Orders" },
    { href: "/my-account/downloads", label: "Downloads" },
    { href: "/my-account/edit-address", label: "Addresses" },
    { href: "/my-account/payment-methods", label: "Payment Methods" },
    { href: "/my-account/edit-account", label: "Account Details" },
    { href: "/my-account/uwa-auctions", label: "Auctions" },
    { href: "/logout", label: "Logout", onClick: handleLogout },
  ];

  // Special cases where child routes should activate a different menu item
  const specialCases = [
    { path: "/my-account/view-order", activeItem: "/my-account/orders" },
   
  ];

  return (
    <nav className="rounded-md myaccount-navigation">
      <ul className="space-y-2">
        {menuItems.map((item) => {
          let isActive = pathname === item.href || pathname.startsWith(item.href);

          // Special case handling
          const specialCase = specialCases.find((caseItem) =>
            pathname.startsWith(caseItem.path)
          );
          if (specialCase && specialCase.activeItem === item.href) {
            isActive = true;
          }

          if (item.href === "/my-account" && pathname !== "/my-account") {
            isActive = false;
          }

          return (
            <li key={item.href} className={`${lora.className} ${isActive ? "is-active" : ""}`}>
              {item.onClick ? (
                <button onClick={item.onClick} className="text-left w-full">
                  {item.label}
                </button>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
