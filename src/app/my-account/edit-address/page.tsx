"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import MenuPage from "@/components/my-account-menu/page";
import { GET_ADDRESS_DETAILS } from "@/graphql/queries/getAddress";
import axiosClientGeneralToken from "@/api/axiosClientGeneralToken";
import Loader from "@/components/Loader";
import axiosClient from "@/api/axiosClient";
import { marcellus, raleway, lora } from "@/config/fonts";

export default function EditAddress() {
  const [billing, setBilling] = useState<any>(null);
  const [shipping, setShipping] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.post("", {
          query: GET_ADDRESS_DETAILS,
        });

        const customerData = response.data?.data?.customer;
        setBilling(customerData?.billing || null);
        setShipping(customerData?.shipping || null);
      } catch (error) {
        console.error("Error fetching address:", error);
        setBilling(null);
        setShipping(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] px-3 md:px-0">
      <div className="e-my-account-tab e-my-account-tab__dashboard">
        <div className=" myaccount-info">
          <div className="woocommerce-MyAccount-navigation col-span-1">
            <MenuPage />
          </div>
          <div className="woocommerce-MyAccount-content-outer col-span-1 md:col-span-3 md:pl-[60px]">
            {loading ? (
              <Loader />
            ) : (
              <div className="myaccount-content">
                <p
                  className={`${lora.className} text-[14px] text-[#69727d] leading-[1.8]`}
                >
                  The following addresses will be used on the checkout page by
                  default.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {/* Billing Address */}
                  <div>
                    <h2 className="text-[24px] sm:text-[45px] font-[400] font-[Marcellus] text-[#000] leading-[1.2] py-0 sm:py-6">
                      Billing Address
                    </h2>
                    <div className="border p-4 rounded-md">
                      <Link
                        href="/my-account/edit-address/billing"
                        className="text-[#5bc0de] text-[14px] font-[400]"
                      >
                        Edit Billing Address
                      </Link>
                      {billing ? (
                        <address
                          className={`${lora.className} mt-3 text-[14px] font-[500] text-[#69727d]`}
                        >
                          {billing.firstName} {billing.lastName}
                          <br />
                          {billing.address1}
                          {billing.address2 && <br />}
                          {billing.address2}
                          <br />
                          {billing.city}, {billing.state} {billing.postcode}
                          <br />
                          {billing.country}
                        </address>
                      ) : (
                        <p className="text-[14px] text-gray-500">
                          No billing address available.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h2 className="text-[24px] sm:text-[45px] font-[500] font-[Marcellus] text-[#000] leading-[1.2] py-0 sm:py-6">
                      Shipping Address
                    </h2>
                    <div className="border p-4 rounded-md">
                      <Link
                        href="/my-account/edit-address/shipping"
                        className="text-[#5bc0de] text-[14px] font-[400]"
                      >
                        Edit Shipping Address
                      </Link>
                      {shipping ? (
                        <address
                          className={`${lora.className} mt-3 text-[14px] font-[500] text-[#69727d]`}
                        >
                          {shipping.firstName} {shipping.lastName}
                          <br />
                          {shipping.address1}
                          {shipping.address2 && <br />}
                          {shipping.address2}
                          <br />
                          {shipping.city}, {shipping.state} {shipping.postcode}
                          <br />
                          {shipping.country}
                        </address>
                      ) : (
                        <p className="text-[14px] text-gray-500">
                          No shipping address available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
