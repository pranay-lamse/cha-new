import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { env } from "@/env";

export async function GET(req: NextRequest) {
  const sourceId = req.nextUrl.searchParams.get("sourceId");
  const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;

  if (!sourceId) {
    return NextResponse.json(
      { error: "Source ID is required." },
      { status: 400 }
    );
  }

  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe secret key is missing." },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(
      `https://api.stripe.com/v1/sources/${sourceId}`,
      {
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch card details." },
      { status: error.response?.status || 500 }
    );
  }
}
