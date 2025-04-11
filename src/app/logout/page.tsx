"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { env } from "@/env";

export default function LogoutPage() {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Remove authentication tokens and user info from cookies
        Cookies.remove("authToken");
        Cookies.remove("refreshToken");
        Cookies.remove("user");

        await fetch(
          `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-login.php?action=logout`,
          {
            method: "GET",
            credentials: "include", // Ensure cookies are sent
          }
        );
        Cookies.remove("rememberMe"); // Optional, if rememberMe was set
        Cookies.remove("wordpress_logged_in_*");
        Cookies.remove("wordpress_sec_*");
        // Redirect to the login page or another desired location
        window.location.href = "/my-account"; // Redirect after logout
      } catch (err) {
        console.error("Error logging out", err);
      }
    };

    handleLogout(); // Call logout when the page loads
  }, []);

  return <div>Logging out...</div>;
}
