"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut, Search, ShoppingBag, User } from "lucide-react";
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
      <div className="relative flex items-center justify-between px-4 md:px-10 py-4 md:py-5">
        {/* Left Side */}
        <div className="flex items-center w-1/4 md:w-1/3">
          {/* Mobile: hamburger only */}
          <button
            onClick={openMenu}
            className="flex md:hidden text-gray-800"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          {/* Desktop nav */}
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

        {/* Center Logo — always absolutely centered */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="block text-center">
            <span className="font-bold text-sm md:text-lg uppercase tracking-[0.3em] text-black whitespace-nowrap">
              CHARMS VILLA
            </span>
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex justify-end items-center w-1/4 md:w-1/3 gap-4 md:gap-6">
          {/* Search — icon on mobile, text on desktop */}
          <button
            onClick={openSearch}
            className="hover:opacity-70 transition"
            aria-label="Search"
          >
            <Search size={20} strokeWidth={1.5} className="flex md:hidden" />
            <span className="hidden md:flex text-xs font-semibold tracking-[0.15em] text-gray-800">
              SEARCH
            </span>
          </button>

          {/* Cart — icon + count badge on mobile, text on desktop */}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                router.push("/auth/login");
              } else {
                openCart();
              }
            }}
            className="hover:opacity-70 transition relative"
            aria-label="Cart"
          >
            {/* Mobile */}
            <span className="flex md:hidden relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </span>
            {/* Desktop */}
            <span className="hidden md:flex text-xs font-semibold tracking-[0.15em] text-gray-800">
              CART ({cartCount})
            </span>
          </button>

          {/* Account — icon on mobile, text dropdown on desktop */}
          {!isLoading && (
            <div className="relative">
              {isAuthenticated && user ? (
                <>
                  {/* Mobile: user icon */}
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex md:hidden hover:opacity-70 transition"
                    aria-label="Account"
                  >
                    <User size={20} strokeWidth={1.5} />
                  </button>
                  {/* Desktop: ACCOUNT text */}
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="hidden md:flex hover:opacity-70 transition text-xs font-semibold tracking-[0.15em] text-gray-800"
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
                        className="block px-4 py-3 hover:bg-gray-50 transition normal-case tracking-normal text-sm"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-3 hover:bg-gray-50 transition normal-case tracking-normal text-sm"
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
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-2 border-t border-gray-100 normal-case tracking-normal text-sm"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Mobile: user icon → login */}
                  <Link
                    href="/auth/login"
                    className="flex md:hidden hover:opacity-70 transition"
                    aria-label="Login"
                  >
                    <User size={20} strokeWidth={1.5} />
                  </Link>
                  {/* Desktop: LOGIN text */}
                  <Link
                    href="/auth/login"
                    className="hidden md:flex hover:opacity-70 transition text-xs font-semibold tracking-[0.15em] text-gray-800"
                  >
                    LOGIN
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
