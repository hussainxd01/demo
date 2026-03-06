"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Trash2,
  Minus,
  Plus,
  FileText,
  Truck,
  Gift,
  LogIn,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";

export default function Cart() {
  const router = useRouter();
  const { isCartOpen, closeCart, cart, removeFromCart, updateCartQuantity } =
    useShop();
  const { isAuthenticated, user } = useAuth();
  const [expandedNote, setExpandedNote] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const wrapPrice = 1100;
  const cartCount = cart.length;

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Cart Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white z-40 transform transition-transform duration-300 overflow-y-auto ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-lg font-semibold text-gray-800">CART</h2>
            <button
              onClick={closeCart}
              className="text-gray-800 hover:text-gray-600 transition-colors"
              aria-label="Close cart"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                <p className="text-gray-600 text-center">Your cart is empty</p>
                <Link
                  href="/"
                  className="mt-4 px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                  onClick={closeCart}
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="p-4 space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b border-gray-200"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.id}`}
                          className="block font-medium text-gray-800 hover:text-gray-600 transition-colors truncate"
                          onClick={closeCart}
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-600">
                          Rs. {item.price.toLocaleString()}
                          <span className="text-xs">.00</span>
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2 border border-gray-300 w-fit rounded">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-gray-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-600 hover:text-red-600 transition-colors flex-shrink-0"
                        aria-label="Remove from cart"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* You May Also Like */}
                <div className="p-4 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    You May Also Like
                  </h3>
                  <div className="flex gap-3">
                    {/* Related product placeholder */}
                    <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-800">
                        Sun Drops
                      </p>
                      <p className="text-sm text-gray-600">Rs. 13,700</p>
                      <button className="mt-2 p-1 text-gray-600 hover:text-gray-800 transition-colors">
                        🛒
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gift Wrap Option */}
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => setExpandedNote(!expandedNote)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="text-sm text-gray-800 font-medium">
                      For Rs. 1,100
                      <span className="text-xs">.00</span> please wrap the
                      products in this order.
                    </span>
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300"
                      onChange={() => setExpandedNote(!expandedNote)}
                    />
                  </button>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-gray-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-700 hover:text-gray-900 cursor-pointer transition-colors">
                    <FileText size={16} />
                    <span>NOTE</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 hover:text-gray-900 cursor-pointer transition-colors">
                    <Truck size={16} />
                    <span>SHIPPING</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 hover:text-gray-900 cursor-pointer transition-colors">
                    <Gift size={16} />
                    <span>DISCOUNT</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
              {/* Subtotal */}
              <div className="flex justify-between items-baseline mb-4">
                <span className="text-gray-700">Subtotal</span>
                <span className="text-lg font-semibold text-gray-800">
                  Rs. {subtotal.toLocaleString()}
                  <span className="text-xs">.00 INR</span>
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Taxes, discounts and shipping calculated at checkout.
              </p>

              {/* Checkout Button */}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    closeCart();
                    router.push("/checkout");
                  }}
                  className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 rounded mb-3 transition-colors"
                >
                  CHECK OUT
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded mb-3 transition-colors"
                  onClick={closeCart}
                >
                  <LogIn size={18} />
                  LOGIN TO CHECKOUT
                </Link>
              )}

              {/* View Cart Link */}
              <Link
                href="/cart"
                className="block text-center text-gray-800 hover:text-gray-600 transition-colors text-sm font-medium"
                onClick={closeCart}
              >
                View cart
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
