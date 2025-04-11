"use client";
import React, { useState } from "react";
import { marcellus } from "@/config/fonts";

export default function PayOrderPage() {
  const [selectedPayment, setSelectedPayment] = useState("invoice");
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1000px] my-10 sm:my-20 about px-2">
      <div>
        <h1 className={`text-[26px] md:text-[42px] font-bold text-gray-800 relative ${marcellus.className}`}>
          Pay for order
        </h1>
        <form className="w-full max-w-lg ml-auto">
          <div className="overflow-x-auto pt-4">
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Product</th>
                  <th className="border p-2 text-left">Totals</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border">
                  <td className="border p-2">Kody</td>
                  <td className="border p-2">$5000</td>
                </tr>
                <tr className="border">
                  <td className="border p-2">Stormy - 𝙉𝙚𝙬 𝙑𝙞𝙙𝙚𝙤</td>
                  <td className="border p-2">$6500</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border font-semibold">
                  <th className="border p-2 text-left">Subtotal:</th>
                  <td className="border p-2 text-left">$11500</td>
                </tr>
                <tr className="border font-semibold">
                  <th className="border p-2 text-left">Payment method:</th>
                  <td className="border p-2 text-left">{selectedPayment === "invoice" ? "Invoice Payment" : "Credit Card"}</td>
                </tr>
                <tr className="border font-semibold">
                  <th className="border p-2 text-left">Refund:</th>
                  <td className="border p-2 text-left">- $11500<br /><small>Testing</small></td>
                </tr>
                <tr className="border font-semibold">
                  <th className="border p-2 text-left">Total:</th>
                  <td className="border p-2 text-left">
                    <del className="text-red-500">$11500</del> <ins className="text-green-500">$0</ins>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="bg-[#edebf1] mt-8 border">
            <div className="bg-[#edebf1] p-8">
              <input
                type="radio"
                id="payment_invoice"
                name="payment"
                value="invoice"
                checked={selectedPayment === "invoice"}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="mr-4"
              />
            <label
            htmlFor="payment_invoice"
            className="font-[500] align-middle leading-none text-[16px] cursor-pointer text-[#000]"
          >
            Invoice Payment
          </label>

              {selectedPayment === "invoice" && (
                <div className="mt-2 p-4 bg-[#dcd7e3]">
                  <p>Classic Horse Auction Will Contact You In Order To Complete The Sale.</p>
                </div>
              )}
            </div>

            <div className="mb-4 bg-[#edebf1] px-8">
              <input
                type="radio"
                id="payment_credit_card"
                name="payment"
                value="credit_card"
                checked={selectedPayment === "credit_card"}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="mr-4"
              />
              <label htmlFor="payment_credit_card" className="font-[500] align-middle leading-none text-[16px] cursor-pointer text-[#000]">
              Credit Card
              <span className="required" aria-hidden="true">*</span>
              </label>
              {selectedPayment === "credit_card" && (
                <div className="mt-2 p-6 bg-[#dcd7e3] rounded-md mb-2">
                  <p>Pay with your credit card.</p>
                  <div className="mt-4">
                    <label htmlFor="card-number" className="block text-[15px]">Card Number  <span className="required" aria-hidden="true">*</span></label>
                    <input
                      type="text"
                      id="card-number"
                      placeholder="1234 1234 1234 1234"
                      className="w-full p-2 border mt-1"
                    />
                  </div>
                  <div className="mt-6 flex gap-2">
                    <div className="w-1/2">
                      <label htmlFor="expiry-date" className="block text-[15px]">
                      Expiry Date <span className="required" aria-hidden="true">*</span></label>
                      <input
                        type="text"
                        id="expiry-date"
                        placeholder="MM/YY"
                        className="w-full p-2 border mt-1"
                      />
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="cvc" className="block text-[15px]">Card Code (CVC)</label>
                      <input
                        type="text"
                        id="cvc"
                        placeholder="123"
                        className="w-full p-2 border mt-1"
                      />
                    </div>
                  </div>
                  <p className="flex items-center space-x-2 p-3 border border-black mt-5">
                <input
                  id="wc-stripe-new-payment-method"
                  name="wc-stripe-new-payment-method"
                  type="checkbox"
                  value="true"
                  className="w-auto"
                />
                <label htmlFor="wc-stripe-new-payment-method" className="inline text-[15px] text-[#000] leading-[1.6em]">
                Save payment information to my account for future purchases.
                </label>
              </p>
                </div>
              )}
             
            </div>

            <div className="space-y-4 border-t border-gray-300 py-6">

            <div className="px-8">
            
              <p className="text-[16px] text-[#000] leading-[1.6em]">
              Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our.{" "}
                <a
                  href="/privacy-policy/"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy policy
                </a>
                .
              </p>
            </div>

      
          <div className="flex items-center space-x-2 px-8">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-3 h-3"
            />
            <label htmlFor="terms" className="text-[16px] text-[#000] leading-[1.6em]">
            I have read and agree to the website{" "}
              <a
                href="/terms-conditions-buyers/"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
               Terms and conditions
              </a> <span className="required" aria-hidden="true">*</span>
            </label>
          </div>

       
          <div className="text-right px-8">
            <button
              type="submit"
              className="text-[15px] font-bold bg-[#dac172] border border-[#dac172] text-white px-8 py-3 hover:bg-[#fff] transition hover:text-[#dac172] hover:border hover:border-[#dac172]"
              
            >
              Pay for order
            </button>
          </div>

      

        </div>
          </div>
        </form>
      </div>
    </div>
  );
}
