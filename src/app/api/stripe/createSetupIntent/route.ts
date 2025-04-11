import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const customer = await stripe.customers.create({ email });
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    });
  } catch (error) {
    console.error("Stripe Setup Intent Error:", error);
    return NextResponse.json(
      { error: "Failed to create Setup Intent" },
      { status: 500 }
    );
  }
}
