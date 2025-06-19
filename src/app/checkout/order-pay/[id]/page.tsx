"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import MenuPage from "@/components/my-account-menu/page";
import Loader from "@/components/Loader";
import { fetchHtmlData } from "@/lib/fetchHtmlData";
import { env } from "@/env";
import { filterHTMLContent } from "@/utils/htmlHelper";
import { getToken } from "@/utils/storage";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
export default function EditAccountPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bidStatus, setBidStatus] = useState<string>("active"); // State to store bidStatus
  const token = getToken();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params?.id;
  const queryString = searchParams?.toString(); // like _wca_initiator=action

  const url = `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/checkout/order-pay/17160/?pay_for_order=true&key=wc_order_Lrbm77fguRRdx&_wca_initiator=action`;

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchHtmlData(url); // ✅ Pass URL dynamically
      setHtmlContent(data);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      setHtmlContent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="woocommerce-checkout woocommerce-page woocommerce-order-pay">
      {loading ? (
        <Loader />
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: filterHTMLContent(htmlContent || "", ["site-main"]),
          }}
          className=""
        ></div>
      )}
    </div>
  );
}
