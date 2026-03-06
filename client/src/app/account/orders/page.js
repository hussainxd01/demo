"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import orderService from "@/lib/services/orderService";
import {
  Clock,
  Check,
  Truck,
  Package,
  Loader,
  AlertCircle,
} from "lucide-react";

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: Check,
  cancelled: AlertCircle,
};

const statusColors = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const response = await orderService.getOrders(page, 10);
        setOrders(response.orders || []);
        setTotalPages(Math.ceil(response.total / 10));
      } catch (err) {
        setError("Failed to load orders");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, [page]);

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-6">My Orders</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600 mb-4">
            Start shopping to see your orders here
          </p>
          <Link
            href="/products"
            className="text-black font-medium hover:text-gray-600"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = statusIcons[order.status] || Clock;
            return (
              <Link key={order._id} href={`/account/orders/${order._id}`}>
                <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 md:p-6 transition-colors cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg ${statusColors[order.status]} border`}
                        >
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Order #</p>
                          <p className="font-semibold text-black">
                            {order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-3 gap-4 text-right">
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium text-black">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-medium text-black">
                          Rs. {order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-medium text-black capitalize">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      {order.items?.length || 0} item
                      {order.items?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
