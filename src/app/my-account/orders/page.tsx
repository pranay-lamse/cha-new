"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import MenuPage from "@/components/my-account-menu/page";
import axiosClientGeneralToken from "@/api/axiosClientGeneralToken";
import { GET_AUCTION_ORDERS } from "@/graphql/queries/getOrderList";
import Link from "next/link";
import Loader from "@/components/Loader";

export default function OrdersPage() {
  const router = useRouter();
  const pathname = usePathname();

  // Extract page number from URL
  const pathSegments = pathname?.split("/") || [];
  const pageFromUrl = parseInt(pathSegments[pathSegments.length - 1]) || 1;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split("/");
      const pageFromUrl = parseInt(pathSegments[pathSegments.length - 1]) || 1;
      setCurrentPage(pageFromUrl);
    }
  }, []);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [totalOrders, setTotalOrders] = useState(0);
  const [endCursor, setEndCursor] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);

  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axiosClientGeneralToken.post("", {
          query: GET_AUCTION_ORDERS,
          variables: { first: ordersPerPage, after: null }, // Use `cursorFromUrl` if needed
        });

        const ordersData = response.data?.data?.orders;
        if (ordersData) {
          setData(ordersData.nodes || []);
          setEndCursor(ordersData.pageInfo.endCursor);
          setHasNextPage(ordersData.pageInfo.hasNextPage);
          setTotalOrders(ordersData.totalCount || 0);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]); // re-run if page changes

  const goToPage = (page: number) => {
    router.push(`/my-account/orders/${page}?cursor=${endCursor}`);
  };

  const totalPages = Math.ceil(totalOrders / ordersPerPage);

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
            <div className="table-wrapper overflow-x-auto">
              <table className="order-table w-full min-w-[600px]">
                <thead>
                  <tr>
                    <th className="p-2 border-b">Order</th>
                    <th className="p-2 border-b">Date</th>
                    <th className="p-2 border-b">Status</th>
                    <th className="p-2 border-b">Total</th>
                    <th className="p-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((order) => (
                      <tr key={order.orderNumber} className="hover:bg-gray-100">
                        <td className="p-2 border-b">
                          <Link
                            href={`/my-account/view-order/${order.orderNumber}/`}
                          >
                            #{order.orderNumber}
                          </Link>
                        </td>
                        <td className="p-2 border-b">{order.date}</td>
                        <td className="p-2 border-b">{order.status}</td>
                        <td className="p-2 border-b">
                          <span>{order.total}</span> for {order.items} item
                        </td>
                        <td className="p-2 border-b">
                          {order.status === "Failed" && (
                            <a
                              href={`/checkout/order-pay/${order.databaseId}/`}
                              className="pay-button text-blue-500 ml-1"
                            >
                              Pay
                            </a>
                          )}
                          <a
                            href={`/my-account/view-order/${order.databaseId}/`}
                            className="pay-button text-blue-500 ml-1"
                          >
                            View
                          </a>
                          {order.status === "Failed" && (
                            <a
                              href={`/cart/?cancel_order=true&order_id=${order.databaseId}`}
                              className="pay-button text-blue-500 ml-1"
                            >
                              Cancel
                            </a>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {(currentPage > 1 || hasNextPage) && (
                <div className="pagination mt-4 flex gap-2">
                  {currentPage > 1 && (
                    <button
                      className="nav-page-button"
                      onClick={() => goToPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                  )}
                  {hasNextPage && (
                    <button
                      className="nav-page-button ml-auto"
                      onClick={() => goToPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
