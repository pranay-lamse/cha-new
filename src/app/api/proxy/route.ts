import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import Cookies from "js-cookie";

function getWordPressLoginCookie() {
  // Get all cookies
  const allCookies = Cookies.get(); // This returns an object of all cookies

  // Find the WordPress login cookie using regex pattern
  for (const cookieName in allCookies) {
    if (cookieName.startsWith("wordpress_logged_in_")) {
      return allCookies[cookieName]; // Return the value of the matching cookie
    }
  }

  return null; // Return null if not found
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Get request body

    const wordpressCookie = getWordPressLoginCookie();
    // Adjust the cookie name if needed

    const response = await axios.post(
      "https://classichorseauction.com/stage/wp-admin/admin-ajax.php?post_id=16953&uwa-ajax=watchlist",
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensures cookies are sent
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
