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

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

const CheckoutForm = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth(); // ✅ Access user data
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<{ credit_card?: string } | null>(null);
  const [customerId, setCustomerId] = useState<string | null>("");
  useEffect(() => {
    if (!isAuthenticated || authLoading) return; // ✅ Wait for auth data to load

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
      });

      if (error) {
        console.error("Stripe PaymentMethod Error:", error.message);
        return;
      }

      if (paymentMethod?.id) {
        await axios.post("/api/wordpress/updatePaymentMethod", {
          customerId: customerId,
          paymentMethodId: paymentMethod?.id,
          userId: user?.userId,
        });

        alert("Payment method added successfully!");
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
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] my-10 sm:my-20 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 myaccount-info">
        <div className="col-span-1">
          <MenuPage />
        </div>
        <div className="col-span-1 md:col-span-3 md:pl-[60px]">
          <div className="table-wrapper">
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}
