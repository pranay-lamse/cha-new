import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import axiosClientGeneralTokenCustomApi from "@/api/axiosClientGeneralTokenCustomApi";

export async function POST(req: NextRequest) {
  const { paymentMethodId, userId } = await req.json();

  try {
    const response = await axiosClientGeneralTokenCustomApi.post(
      "/wp-json/custom-api/v1/update-payment-method",
      { paymentMethodId, userId }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error("WordPress API Error:", error);
    return NextResponse.json(
      { error: "Failed to update payment method" },
      { status: 500 }
    );
  }
}
