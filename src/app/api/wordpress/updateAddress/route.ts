import { updateAddress } from "@/lib/updateAddress";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { url, data } = await request.json(); // Assume you're sending 'url' and 'data' as JSON in the request body

  if (!url || !data) {
    return NextResponse.json({ error: "Missing url or data" }, { status: 400 });
  }

  try {
    const result = await updateAddress(url, data);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}
