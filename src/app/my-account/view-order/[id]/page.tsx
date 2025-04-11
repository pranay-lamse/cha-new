"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { lora } from "@/config/fonts";
import MenuPage from "@/components/my-account-menu/page";
import { Mail, Phone } from "lucide-react";
import axiosClientGeneralToken from "@/api/axiosClientGeneralToken";
import { GET_BLOG_POSTS } from "@/graphql/queries";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { GET_ORDER_DETAILS } from "@/graphql/queries/getOrderDetails";
export default function OrdersView() {
  const [data, setData] = useState<{ order: any }>({ order: {} });
  const [loading, setLoading] = useState<boolean>(true);

  const params = useParams();
  const id = params.id; // "id" matches the [id] in the route
  /* const encodedId = btoa(id); */
  const encodedId = btoa(`order:${id}`);
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axiosClientGeneralToken.post("", {
          query: GET_ORDER_DETAILS,
          variables: { id: encodedId }, // Fetch first 20 posts
        });

        setData(response.data.data || []);
        console.log("response.data", response.data.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
  const formatDate = (dateString: string) => {
    const datePart = dateString.split("T")[0]; // Extract only '2022-11-21'
    const date = new Date(datePart); // Create a Date object without time adjustment
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] my-10 sm:my-20 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 myaccount-info">
        <div className="col-span-1">
          <MenuPage />
        </div>
        <div className="col-span-1 md:col-span-3 md:pl-[60px]">
          {loading ? (
            <Loader />
          ) : (
            <>
              <p className="font-[500] font-lora text-[15px] text-[#69727d] leading-[1.8]">
                Order <strong>#{data?.order?.orderNumber}</strong> was placed on{" "}
                <strong>{formatDate(data?.order?.date)}</strong> and is
                currently <strong> {data?.order?.status} .</strong>
              </p>
              <h2 className="text-[24px] sm:text-[42px] font-[500] font-[Marcellus] text-[#000] leading-[1.2] py-6">
                Order details
              </h2>

              <div className="table-wrapper overflow-x-auto">
                <table className="order-table view-order-table w-full min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Product</th>
                      <th className="p-2 border-b">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.order?.lineItems?.nodes.map((item: any) => (
                      <>
                        <tr>
                          {" "}
                          <td className="p-2 border-b">
                            <Link
                              href="/auctions/stormy/"
                              className="text-[#5bc0de] !font-normal"
                            >
                              {item?.product?.node?.name}
                            </Link>{" "}
                            <span className="product-quantity">
                              ×&nbsp; {item?.quantity}
                            </span>
                          </td>
                          <td className="p-2 border-b">
                            <span className="text-[#222] font-normal">
                              ${item?.total}
                            </span>
                          </td>
                        </tr>
                      </>
                    ))}

                    {data?.order?.subtotal ? (
                      <>
                        <tr>
                          <td className="p-2 border-b">Subtotal:</td>
                          <td className="p-2 border-b">
                            {data?.order?.subtotal}
                          </td>
                        </tr>
                      </>
                    ) : null}
                    {data?.order?.feeLines?.nodes.map((item: any) => (
                      <>
                        <tr>
                          <td className="p-2 border-b">{item?.name}:</td>
                          <td className="p-2 border-b"> ${item?.total}</td>
                        </tr>
                      </>
                    ))}
                    {data?.order?.refunds?.nodes.map((item: any) => (
                      <>
                        <tr>
                          <td className="p-2 border-b">{item?.name}:</td>
                          <td className="p-2 border-b"> -${item?.total}</td>
                        </tr>
                      </>
                    ))}
                    {data?.order?.shippingTax ? (
                      <>
                        <tr>
                          <td className="p-2 border-b">Shipping Tax:</td>
                          <td className="p-2 border-b">
                            {data?.order?.shippingTax}
                          </td>
                        </tr>
                      </>
                    ) : null}
                    {data?.order?.shippingTotal ? (
                      <>
                        <tr>
                          <td className="p-2 border-b">Shipping Total:</td>
                          <td className="p-2 border-b">
                            {data?.order?.shippingTotal}
                          </td>
                        </tr>
                      </>
                    ) : null}

                    {data?.order?.paymentMethodTitle ? (
                      <>
                        <tr>
                          <td className="p-2 border-b">Payment method:</td>
                          <td className="p-2 border-b">
                            {data?.order?.paymentMethodTitle}
                          </td>
                        </tr>
                      </>
                    ) : null}

                    {data?.order?.totalTax ? (
                      <>
                        <tr>
                          <td className="p-2 border-b">TotalTax:</td>
                          <td className="p-2 border-b">
                            {data?.order?.totalTax}
                          </td>
                        </tr>
                      </>
                    ) : null}

                    {data?.order?.total ? (
                      <>
                        <tr>
                          <td className="p-2 border-b">Total:</td>
                          <td className="p-2 border-b">{data?.order?.total}</td>
                        </tr>
                      </>
                    ) : null}

                    <tr>
                      <td className="p-2 border-b">Actions:</td>
                      <td className="p-2 border-b flex space-x-3">
                        <Link
                          href={`/checkout/order-pay/${id}`}
                          className="pay-button !text-[16px]"
                        >
                          Pay
                        </Link>
                        <Link
                          href={`/cart/?cancel_order=true&order_id/`}
                          className="pay-button !text-[16px]"
                        >
                          Cancel
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <div>
                  <h2 className="text-[24px] sm:text-[42px] font-[400] font-[Marcellus] text-[#000] leading-[1.2] py-4">
                    Billing Address
                  </h2>

                  <div className="border px-4 sm:px-8 py-4 rounded-md">
                    <address className="text-[14px] font-[500] leading-[1.6em] text-[#69727d] not-italic">
                      {data?.order?.billing?.firstName}{" "}
                      {data?.order?.billing?.lastName}
                      <br />
                      {data?.order?.billing?.address1}
                      <br />
                      {data?.order?.billing?.city},{" "}
                      {data?.order?.billing?.state}{" "}
                      {data?.order?.billing?.postcode}{" "}
                      {/*  {data?.order?.billing?.country} */}
                      <br />
                      <p className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{data?.order?.billing?.phone}</span>
                      </p>
                    </address>

                    <p className="flex items-center space-x-2 text-[15px] font-[500] leading-[1.8em] text-[#69727d] not-italic py-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{data?.order?.billing?.email} </span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
