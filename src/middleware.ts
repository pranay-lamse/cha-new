import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware triggered:", req.nextUrl.pathname);

  const token = req.cookies.get("refreshToken")?.value;

  if (!token) {
    console.log("No token found. Redirecting...");
    return NextResponse.redirect(new URL("/my-account", req.url));
  }

  console.log("Token found. Access granted.");
  return NextResponse.next();
}

export const config = {
  matcher: ["/my-account/:path((?!lost-password).*)"], // Matches only subpaths like `/my-account/*`
};
