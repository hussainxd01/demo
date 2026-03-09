"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader, AlertCircle, CheckCircle } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import orderService from "@/lib/services/orderService";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useShop();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [orderData, setOrderData] = useState({
    shippingAddress: {},
    paymentMethod: "cod", // Cash on Delivery
    giftWrap: false,
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [step, setStep] = useState(1); // 1: Cart Review, 2: Shipping, 3: Payment, 4: Success Confirmation

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/checkout");
    }
    if (isAuthenticated && cart.length === 0 && !orderSuccess) {
      router.push("/");
    }
  }, [isAuthenticated, cart.length, router, orderSuccess]);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = subtotal > 5000 ? 0 : 100;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shippingCost + tax;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setOrderData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateShipping = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.address.trim()) return "Address is required";
    if (!formData.city.trim()) return "City is required";
    if (!formData.state.trim()) return "State is required";
    if (!formData.postalCode.trim()) return "Postal code is required";
    if (!formData.country.trim()) return "Country is required";
    if (!formData.phone.trim()) return "Phone number is required";
    return "";
  };

  const handleSubmitOrder = async () => {
    const shippingError = validateShipping();
    if (shippingError) {
      setError(shippingError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const orderPayload = {
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
        },

        paymentMethod: orderData.paymentMethod,

        notes: orderData.notes || "",
      };

      const response = await orderService.createOrder(orderPayload);

      setOrderSuccess(response);
      clearCart();
      setStep(4);

      // Redirect to order detail page after 2 seconds
      setTimeout(() => {
        router.push(`/account/orders/${response._id}?new=true`);
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <button
          onClick={() => (step === 1 ? router.back() : setStep(step - 1))}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="flex justify-between mb-12">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      s <= step
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        s < step ? "bg-black" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Step 1: Cart Review */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Review
                </h2>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item._id || item.id}
                      className="flex gap-4 pb-4 border-b border-gray-200"
                    >
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={
                            item.images?.[0]?.url ||
                            item.image ||
                            "/placeholder.jpg"
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">{item.brand}</p>
                        <div className="mt-2 flex justify-between items-end">
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                          <p className="font-semibold text-gray-900">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Continue to Shipping
                </button>
              </div>
            )}

            {/* Step 2: Shipping Information */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Shipping Information
                </h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                  </div>
                </form>
                <button
                  onClick={() => setStep(3)}
                  className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 4: Order Success Confirmation */}
            {step === 4 && orderSuccess && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Order Placed Successfully!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for your order. We're processing it now.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-semibold text-gray-900">
                        {orderSuccess._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold text-gray-900">
                        Rs. {orderSuccess.total?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-yellow-600 capitalize">
                        {orderSuccess.status || "Pending"}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-6">
                    You will be redirected to your order details shortly...
                  </p>

                  <button
                    onClick={() =>
                      router.push(`/account/orders/${orderSuccess._id}?new=true`)
                    }
                    className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    View Order Details
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment & Final Confirmation */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Payment & Final Review
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center p-4 border-2 border-black rounded-lg cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={orderData.paymentMethod === "cod"}
                          onChange={handleChange}
                          className="mr-3"
                        />
                        <span className="font-medium text-gray-900">
                          Cash on Delivery (COD)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="giftWrap"
                        checked={orderData.giftWrap}
                        onChange={handleChange}
                        className="w-4 h-4 border border-gray-300 rounded"
                      />
                      <span className="text-gray-900">
                        Gift wrap this order (+Rs. 100)
                      </span>
                    </label>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={orderData.notes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Add any special instructions..."
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-amber-400 text-gray-900 rounded-lg hover:bg-amber-500 transition-colors font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                  {isLoading ? "Creating Order..." : "Place Order"}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24 space-y-6">
              <h3 className="font-bold text-gray-900">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0
                      ? "Free"
                      : `Rs. ${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">Rs. {tax.toFixed(2)}</span>
                </div>
                {orderData.giftWrap && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gift Wrap</span>
                    <span className="font-medium">Rs. 100.00</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>
                    Rs. {(total + (orderData.giftWrap ? 100 : 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p>Free shipping on orders above Rs. 5000</p>
                <p>All prices are inclusive of taxes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
