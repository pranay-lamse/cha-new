import { env } from "@/env";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { paymentMethodId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // Example: $50.00 USD
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true, // Automatically confirm the payment
    });

    res.status(200).json({ success: true, paymentIntent });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}
