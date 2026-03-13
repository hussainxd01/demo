"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Loader,
  Package,
  Truck,
  User,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Gift,
} from "lucide-react";
import orderService from "@/lib/services/orderService";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const paymentStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  shipped: "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const paymentStatusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

export default function OrderDetailModal({
  isOpen,
  orderId,
  onClose,
  onOrderUpdate,
}) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    if (isOpen && orderId) {
      loadOrder();
    }
  }, [isOpen, orderId]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await orderService.getOrderById(orderId);
      setOrder(response);
      setTrackingNumber(response.trackingNumber || "");
    } catch (err) {
      setError(err.message || "Failed to load order details");
      console.error("Error loading order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsUpdating(true);
      await orderService.updateOrderStatus(orderId, newStatus, trackingNumber);
      setOrder((prev) => ({ ...prev, status: newStatus }));
      onOrderUpdate?.(orderId, { status: newStatus });
    } catch (err) {
      setError(err.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusUpdate = async (newPaymentStatus) => {
    try {
      setIsUpdating(true);
      await orderService.updatePaymentStatus(orderId, newPaymentStatus);
      setOrder((prev) => ({ ...prev, paymentStatus: newPaymentStatus }));
      onOrderUpdate?.(orderId, { paymentStatus: newPaymentStatus });
    } catch (err) {
      setError(err.message || "Failed to update payment status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-black">Order Details</h2>
            {order && (
              <p className="text-sm text-gray-500 mt-1">
                Order #{order._id?.slice(-8).toUpperCase()} |{" "}
                {order.orderNumber || "N/A"}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-black" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          ) : order ? (
            <div className="space-y-6">
              {/* Status Management Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Order Management
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Order Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Status
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                      disabled={isUpdating}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 ${statusColors[order.status] || "border-gray-300"}`}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Status
                    </label>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) =>
                        handlePaymentStatusUpdate(e.target.value)
                      }
                      disabled={isUpdating}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 ${paymentStatusColors[order.paymentStatus] || "border-gray-300"}`}
                    >
                      {paymentStatusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tracking Number */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">
                        {order.user?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">
                        {order.user?.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium">
                        {order.user?.phone || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Method:</span>
                      <span className="font-medium capitalize">
                        {order.paymentMethod || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${paymentStatusColors[order.paymentStatus] || "bg-gray-100"}`}
                      >
                        {order.paymentStatus || "N/A"}
                      </span>
                    </div>
                    {order.razorpayPaymentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payment ID:</span>
                        <span className="font-medium font-mono text-xs">
                          {order.razorpayPaymentId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping and Billing Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Address
                  </h3>
                  {order.shippingAddress || order.shippingInfo ? (
                    <div className="text-sm space-y-1">
                      <p className="font-medium">
                        {order.shippingAddress?.name ||
                          order.shippingInfo?.name ||
                          "N/A"}
                      </p>
                      <p className="text-gray-600">
                        {order.shippingAddress?.address ||
                          order.shippingInfo?.address}
                      </p>
                      <p className="text-gray-600">
                        {order.shippingAddress?.city ||
                          order.shippingInfo?.city}
                        ,{" "}
                        {order.shippingAddress?.state ||
                          order.shippingInfo?.state}{" "}
                        {order.shippingAddress?.postalCode ||
                          order.shippingInfo?.postalCode}
                      </p>
                      <p className="text-gray-600">
                        {order.shippingAddress?.country ||
                          order.shippingInfo?.country}
                      </p>
                      <div className="pt-2 border-t border-gray-100 mt-2">
                        <p className="text-gray-600">
                          Phone:{" "}
                          {order.shippingAddress?.phone ||
                            order.shippingInfo?.phone ||
                            "N/A"}
                        </p>
                        <p className="text-gray-600">
                          Email:{" "}
                          {order.shippingAddress?.email ||
                            order.shippingInfo?.email ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No shipping address provided
                    </p>
                  )}
                </div>

                {/* Billing Address */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Billing Address
                  </h3>
                  {order.billingInfo ? (
                    <div className="text-sm space-y-1">
                      <p className="font-medium">
                        {order.billingInfo.name || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        {order.billingInfo.address}
                      </p>
                      <p className="text-gray-600">
                        {order.billingInfo.city}, {order.billingInfo.state}{" "}
                        {order.billingInfo.postalCode}
                      </p>
                      <p className="text-gray-600">
                        {order.billingInfo.country}
                      </p>
                      <div className="pt-2 border-t border-gray-100 mt-2">
                        <p className="text-gray-600">
                          Phone: {order.billingInfo.phone || "N/A"}
                        </p>
                        <p className="text-gray-600">
                          Email: {order.billingInfo.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Same as shipping address
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items ({order.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
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
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.product?.name || "Product"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.product?.brand || ""}
                          </p>
                          <div className="mt-1 flex justify-between items-end">
                            <span className="text-sm text-gray-600">
                              Qty: {item.quantity} x Rs. {item.price?.toFixed(2)}
                            </span>
                            <span className="font-semibold text-gray-900">
                              Rs. {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No items in order</p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Order Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      Rs. {order.subtotal?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">
                      {(order.shipping || order.shippingCost || 0) === 0
                        ? "Free"
                        : `Rs. ${(order.shipping || order.shippingCost)?.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">
                      Rs. {order.tax?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span className="font-medium">
                        -Rs. {order.discount?.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {order.giftWrap && (
                    <div className="flex justify-between items-center text-purple-600">
                      <span className="flex items-center gap-1">
                        <Gift className="w-4 h-4" />
                        Gift Wrap:
                      </span>
                      <span className="font-medium">Yes</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>Rs. {order.total?.toFixed(2) || "0.00"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Order Notes
                  </h3>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">
                    {order.notes}
                  </p>
                </div>
              )}

              {/* Timeline */}
              {order.timeline && order.timeline.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Order Timeline
                  </h3>
                  <div className="space-y-3">
                    {order.timeline.map((event, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${index === order.timeline.length - 1 ? "bg-black" : "bg-gray-300"}`}
                          />
                          {index < order.timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-3">
                          <p className="font-medium text-gray-900 capitalize">
                            {event.status}
                          </p>
                          <p className="text-sm text-gray-500">
                            {event.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Metadata */}
              <div className="text-xs text-gray-400 pt-4 border-t border-gray-200">
                <p>
                  Created: {new Date(order.createdAt).toLocaleString()} | Last
                  Updated: {new Date(order.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
