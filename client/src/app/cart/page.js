"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  LogIn,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateCartQuantity } = useShop();
  const { isAuthenticated } = useAuth();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = subtotal > 5000 ? 0 : 100;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Continue Shopping
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600 mb-8">
          {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
        </p>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Looks like you haven't added anything to your cart yet. Start
              shopping and discover our amazing products.
            </p>
            <Link
              href="/"
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Table Header - Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Cart Items */}
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-gray-200 items-center"
                >
                  {/* Product Info */}
                  <div className="md:col-span-6 flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.id}`}
                        className="font-semibold text-gray-900 hover:text-gray-600 transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      {item.brand && (
                        <p className="text-sm text-gray-500 mt-1">
                          {item.brand}
                        </p>
                      )}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 mt-2 md:hidden transition-colors"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 text-center">
                    <span className="md:hidden text-sm text-gray-500 mr-2">
                      Price:
                    </span>
                    <span className="text-gray-900">
                      Rs. {item.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 flex justify-center">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                    <span className="font-semibold text-gray-900">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="hidden md:block text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Remove from cart"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `Rs. ${shippingCost}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium text-gray-900">
                      Rs. {tax.toLocaleString()}
                    </span>
                  </div>

                  {subtotal < 5000 && (
                    <div className="text-xs text-gray-500 bg-amber-50 p-3 rounded-lg">
                      Add Rs. {(5000 - subtotal).toLocaleString()} more for free
                      shipping!
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-base font-bold text-gray-900">
                        Rs. {total.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Including all taxes
                    </p>
                  </div>
                </div>

                {/* Checkout Button */}
                {isAuthenticated ? (
                  <Link
                    href="/checkout"
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <Link
                    href="/auth/login?redirect=/checkout"
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    <LogIn size={18} />
                    Login to Checkout
                  </Link>
                )}

                {/* Continue Shopping */}
                <Link
                  href="/"
                  className="mt-3 w-full flex items-center justify-center text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck size={18} className="text-gray-400" />
                    <span>Free shipping on orders over Rs. 5,000</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <ShieldCheck size={18} className="text-gray-400" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
