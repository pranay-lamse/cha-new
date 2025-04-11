import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { customerId, paymentMethodId } = await req.json();

    // ✅ Attach Payment Method to Customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // ✅ Set Payment Method as Default
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Stripe Payment Method Attachment Error:", error);
    return NextResponse.json(
      { error: "Failed to attach payment method" },
      { status: 500 }
    );
  }
}
