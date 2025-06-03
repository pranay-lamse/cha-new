"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
/* import apiClient from "./apiClient"; // Axios instance */
import { env } from "@/env";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false); // Checkbox state

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!termsAccepted) {
      setError("Please accept the terms and conditions.");
      setIsLoading(false);
      return;
    }

    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement!,
      });

      if (error) {
        setError(error.message || "Payment failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Send payment method ID to your backend
      /* const response = await apiClient.post("/api/payment", {
        paymentMethodId: paymentMethod?.id,
      });

      if (response.data.success) {
        setSuccess("Payment successful! Stripe User ID saved successfully.");
      } else {
        setError("Payment failed. Please try again.");
      } */
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": { color: "#aab7c4" },
      },
      invalid: { color: "#9e2146" },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div>
        <label className="block text-sm font-medium mb-1">Card Number*</label>
        <CardNumberElement options={cardElementOptions} />
      </div>{" "}
      <br />
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Expiration*</label>
          <CardExpiryElement options={cardElementOptions} />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">CVV*</label>
          <CardCvcElement options={cardElementOptions} />
        </div>
      </div>{" "}
      <br />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
        <span>I have read and agree to the website <Link href="/terms-conditions-buyers"> terms and conditions</Link> *</span>
      </div>{" "}
      <br />
      {/* <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button> */}
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {success && (
        <div className="mt-2 p-2 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
    </form>
  );
};

const StripePayment = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default StripePayment;
