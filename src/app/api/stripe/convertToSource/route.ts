import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { paymentMethodId, email } = await req.json();
    let { customerId } = await req.json();

    // ✅ Create new customer if `customerId` is not provided
    if (!customerId) {
      const newCustomer = await stripe.customers.create({
        email: email || `user_${Date.now()}@example.com`, // Fallback email if none provided
        description: "New customer for PaymentMethod setup",
      });

      customerId = newCustomer.id;
    }

    // ✅ Attach the PaymentMethod to the Customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // ✅ Create a SetupIntent
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true,
      usage: "off_session",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    const sourceId = setupIntent.payment_method; // Will return `pm_...`

    return NextResponse.json({
      sourceId,
      customerId,
    });
  } catch (error: any) {
    console.error("Stripe Conversion Error:", error);
    return NextResponse.json(
      {
        error: "Failed to convert PaymentMethod to Source",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
