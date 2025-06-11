"use client";
import { useEffect, useRef, useState } from "react";
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
import { env } from "@/env";
import axios from "axios";
import { useAuth } from "@/app/providers/UserProvider";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CheckoutFormContent = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const userIdRef = useRef<string | null>(null); // ✅ Hold userId from outside

  const handleCardPayment = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const userId = userIdRef.current; // ✅ use dynamic userId
    if (!userId) {
      setError("User ID is missing.");
      setIsLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the terms and conditions.");
      setIsLoading(false);
      return;
    }

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet.");
      setIsLoading(false);
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      setError("Card number input is missing.");
      setIsLoading(false);
      return;
    }

    try {
      const { paymentMethod, error: stripeError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed. Please try again.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post("/api/wordpress/updatePaymentMethod", {
        customerId: user?.stripe_customer_id,
        paymentMethodId: paymentMethod?.id,
        userId: userId,
      });

      /* if (response.status === 200) {
        setSuccess("Payment method updated successfully.");
        setTimeout(() => {
          window.location.href = "/my-account/payment-methods";
        }, 2000);
      } else {
        setError("Server error while updating payment method.");
      } */
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // ✅ Set global functions to be used after registration
    (window as any).triggerStripePayment = (id: string) => {
      userIdRef.current = id;
      handleCardPayment();
    };

    return () => {
      delete (window as any).triggerStripePayment;
    };
  }, [stripe, elements, termsAccepted]);

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
    <div className="space-y-4 pt-2">
      <div>
        <label className="block text-sm font-medium mb-1">Card Number*</label>
        <CardNumberElement options={cardElementOptions} />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Expiration*</label>
          <CardExpiryElement options={cardElementOptions} />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">CVV*</label>
          <CardCvcElement options={cardElementOptions} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
        <span>
          I agree to the{" "}
          <Link
            href="/terms-conditions-buyers"
            className="underline text-blue-600"
          >
            terms and conditions
          </Link>{" "}
          *
        </span>
      </div>

      <button
        type="button"
        disabled={!stripe || isLoading}
        onClick={handleCardPayment}
        style={{
          display: "none !important",
        }}
      >
        Add
      </button>
    </div>
  );
};

const StripePayment = () => (
  <Elements stripe={stripePromise}>
    <CheckoutFormContent />
  </Elements>
);

export default StripePayment;
