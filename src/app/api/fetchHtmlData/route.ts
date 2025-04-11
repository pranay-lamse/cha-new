import { NextRequest, NextResponse } from "next/server";
import { fetchHtmlData } from "@/lib/fetchHtmlData";

export async function POST(request: NextRequest) {
  const { url } = await request.json();
  try {
    const html = await fetchHtmlData(url);
    return NextResponse.json({ html });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch HTML content." },
      { status: 500 }
    );
  }
}
