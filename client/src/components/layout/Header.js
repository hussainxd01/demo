"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { openMenu, openCart, openSearch, cart } = useShop();

  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const router = useRouter();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="relative flex items-center justify-between px-6 md:px-10 py-5">
        {/* Left Side */}
        <div className="w-1/3 flex items-center">
          {/* Mobile Menu */}
          <button
            onClick={openMenu}
            className="flex md:hidden text-gray-800"
            aria-label="Open menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-[0.15em] text-gray-800">
            <Link href="/" className="hover:opacity-70 transition">
              HOME
            </Link>

            <Link href="/category/men" className="hover:opacity-70 transition">
              MEN
            </Link>

            <Link
              href="/category/women"
              className="hover:opacity-70 transition"
            >
              WOMEN
            </Link>

            <Link
              href="/category/bestseller"
              className="hover:opacity-70 transition"
            >
              BEST SELLER
            </Link>
          </nav>
        </div>

        {/* Center Logo - ALWAYS CENTERED */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="block text-center">
            <span className="font-bold text-lg uppercase tracking-[0.3em] text-black whitespace-nowrap">
              CHARMS VILLA
            </span>
          </Link>
        </div>

        {/* Right Side */}
        <div className="w-1/3 flex justify-end items-center gap-6 text-xs font-semibold tracking-[0.15em] text-gray-800">
          {/* Search */}
          <button onClick={openSearch} className="hover:opacity-70 transition">
            SEARCH
          </button>

          {/* Cart */}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                router.push("/auth/login");
              } else {
                openCart();
              }
            }}
            className="hover:opacity-70 transition"
          >
            CART ({cartCount})
          </button>

          {/* Login / Account */}
          <div className="relative">
            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  <>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="hover:opacity-70 transition"
                    >
                      ACCOUNT
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-medium text-gray-900 truncate normal-case tracking-normal">
                            {user?.name || "User"}
                          </p>

                          <p className="text-sm text-gray-500 truncate normal-case tracking-normal">
                            {user?.email}
                          </p>
                        </div>

                        <Link
                          href="/account/profile"
                          className="block px-4 py-3 hover:bg-gray-50 transition normal-case tracking-normal"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          My Profile
                        </Link>

                        <Link
                          href="/account/orders"
                          className="block px-4 py-3 hover:bg-gray-50 transition normal-case tracking-normal"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          My Orders
                        </Link>

                        <button
                          onClick={async () => {
                            await logout();
                            setIsProfileOpen(false);
                            router.push("/");
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-2 border-t border-gray-100 normal-case tracking-normal"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="hover:opacity-70 transition"
                  >
                    LOGIN
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
