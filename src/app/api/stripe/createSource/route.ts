import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { email, customerId, paymentMethodId } = await req.json();

    // Step 1: Check if customer exists
    let customer = null;
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId);
    }

    if (!customer) {
      // Step 2: Create a new customer if customerId isn't provided
      customer = await stripe.customers.create({ email });
    }

    // Step 3: Attach Payment Method to Customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // Step 4: Set the Payment Method as Default
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return NextResponse.json({
      paymentMethodId,
      customerId: customer.id,
    });
  } catch (error: any) {
    console.error("Stripe Payment Method Error:", error);
    return NextResponse.json(
      { error: "Failed to add payment method", details: error?.message },
      { status: 500 }
    );
  }
}
