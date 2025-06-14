"use client";

import React, { useEffect, useState } from "react";
import MenuPage from "@/components/my-account-menu/page";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { env } from "@/env";
import axiosClientGeneralTokenCustomApi from "@/api/axiosClientGeneralTokenCustomApi";
import { useAuth } from "@/app/providers/UserProvider";
import axiosClient from "@/api/axiosClient";
import axiosClientwithApi from "@/api/axiosClientwithApi";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

const CheckoutForm = () => {
  const {
    user,
    loading: authLoading,
    isAuthenticated,
  } = useAuth() as {
    user: { userId?: string; name?: string; email?: string } | null;
    loading: boolean;
    isAuthenticated: boolean;
  }; // ✅ Access user data
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<{ credit_card?: string } | null>(null);
  const [customerId, setCustomerId] = useState<string | null>("");

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClientGeneralTokenCustomApi.get(
        `/wp-json/custom-api/v1/user-data/${user?.userId}` // ✅ Dynamically use user ID
      );

      setData(data || {});
      setCustomerId(data.stripe_customer_id);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!isAuthenticated || authLoading) return; // ✅ Wait for auth data to load

    fetchPaymentMethods();
  }, [user, isAuthenticated, authLoading]); // ✅ Dependency array includes auth state

  const stripe = useStripe();
  const elements = useElements();

  // ✅ Example for existing customer ID

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: user?.name || "Unknown", // Replace with actual field
          email: user?.email || "no-email@example.com", // Replace with actual field
        },
      });

      if (error) {
        console.error("Stripe PaymentMethod Error:", error.message);
        return;
      }

      if (paymentMethod?.id) {
        await axiosClientwithApi.post(
          "/wp-json/custom-api/v1/update-payment-method",
          {
            customerId: customerId,
            paymentMethodId: paymentMethod?.id,
            userId: user?.userId,
            fingerprint: "MIWqR4mqZ3SOrQyf",
            card_type: paymentMethod?.card?.brand,
            expiry_month: paymentMethod?.card?.exp_month,
            expiry_year: paymentMethod?.card?.exp_year,
            last4: paymentMethod?.card?.last4,
          },
          {
            headers: {
              "Content-Type": "application/json", // ✅ Required for WP to parse JSON
            },
          }
        );

        /* window.location.href = "/my-account/payment-methods"; */
      } else {
        console.error("Source conversion failed.");
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        options={{
          hidePostalCode: true,
        }}
        className="p-2 border"
      />

      <div className="flex justify-end border-t border-[#000] mt-4">
        <button
          type="submit"
          disabled={loading}
          className={`border border-[#dac172] px-6 py-3.5 bg-[#dac172] text-[#fff] text-[15px] font-bold hover:bg-[#fff] hover:text-[#dac172] hover:no-underline hover:border hover:border-[#dac172] mt-4 ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
        >
          {loading ? "Processing..." : "Add payment method"}
        </button>
      </div>
    </form>
  );
};

export default function PaymentMethodPage() {
  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px]">
      <div className="e-my-account-tab e-my-account-tab__dashboard">
        <div className="woocommerce myaccount-info">
          <div className="woocommerce-MyAccount-navigation">
            <MenuPage />
          </div>
          <div className="woocommerce-MyAccount-content-outer">
            <div className="table-wrapper">
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
