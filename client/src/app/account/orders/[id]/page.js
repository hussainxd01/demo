"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  Package,
} from "lucide-react";
import orderService from "@/lib/services/orderService";

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: AlertCircle,
};

const statusColors = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isNewOrder, setIsNewOrder] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    // Check if this is a fresh order from checkout
    if (searchParams.get("new") === "true") {
      setIsNewOrder(true);
    }

    const loadOrder = async () => {
      try {
        console.log(
          "[v0] Loading order with ID:",
          orderId,
          "Type:",
          typeof orderId,
          "Length:",
          orderId?.length,
        );
        setIsLoading(true);
        const response = await orderService.getOrderById(orderId);
        console.log("[v0] Order loaded successfully:", response);
        setOrder(response);
        setError("");
      } catch (err) {
        console.log("[v0] Error loading order:", err.message);
        setError(
          err.message || "Failed to load order details. Please try again.",
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId, searchParams]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setIsCancelling(true);
    try {
      const response = await orderService.cancelOrder(orderId);
      setOrder(response);
      setCancelSuccess(true);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to cancel order. Please try again.");
      console.error("Error cancelling order:", err);
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-red-900">Error</h2>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="text-center py-12">
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[order.status] || Clock;

  return (
    <div>
      <button
        onClick={() => router.push("/account/orders")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Orders
      </button>

      {/* Success Message for New Order */}
      {isNewOrder && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-green-900">
              Order Placed Successfully!
            </h2>
            <p className="text-green-800 text-sm">
              Thank you for your order. We'll process it shortly.
            </p>
          </div>
        </div>
      )}

      {/* Cancellation Success Message */}
      {cancelSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-green-900">
              Order Cancelled Successfully
            </h2>
            <p className="text-green-800 text-sm">
              Your order has been cancelled and product stock has been restored.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-gray-600 text-sm">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${statusColors[order.status]} border`}
              >
                <StatusIcon className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Status</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {order.status}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={
                          item.product?.images?.[0]?.url ||
                          item.product?.image ||
                          "/placeholder.jpg"
                        }
                        alt={item.product?.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.product?.name || "Product"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.product?.brand || ""}
                      </p>
                      <div className="mt-2 flex justify-between items-end">
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-semibold text-gray-900">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No items in this order</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Shipping Address
            </h2>
            {order.shippingAddress ? (
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2 text-sm">
                  Phone: {order.shippingAddress.phone}
                </p>
                <p className="text-sm">Email: {order.shippingAddress.email}</p>
              </div>
            ) : (
              <p className="text-gray-600">No shipping address</p>
            )}
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Notes
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-6">
            <h3 className="font-bold text-gray-900">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  Rs. {order.subtotal?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {order.shipping === 0
                    ? "Free"
                    : `Rs. ${order.shipping?.toFixed(2) || "0.00"}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">
                  Rs. {order.tax?.toFixed(2) || "0.00"}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">
                    -Rs. {order.discount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>Rs. {order.total?.toFixed(2) || "0.00"}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-900 mb-2">
                Payment Method
              </p>
              <p className="text-gray-700 capitalize">
                {order.paymentMethod || "N/A"}
              </p>
            </div>

            {order.paymentStatus && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Payment Status
                </p>
                <p className="text-gray-700 capitalize">
                  {order.paymentStatus}
                </p>
              </div>
            )}

            {order.status !== "cancelled" &&
              order.status !== "delivered" &&
              order.status !== "shipped" && (
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="w-full px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              )}

            <Link
              href="/account/orders"
              className="block text-center w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
