"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Heart, ShoppingCart, LogOut } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import UserIcon from "@/components/common/UserIcon";

export default function Header() {
  const { isSearchOpen, openSearch, openMenu, openCart, cart, favorites } =
    useShop();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Top Banner */}
      <div className="bg-amber-50 text-center py-2 text-sm font-medium text-gray-800">
        Save up to 20% with code LOVEGIFT
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          {/* Left: Menu Icon */}
          <button
            onClick={openMenu}
            className="flex md:hidden text-gray-800 hover:text-gray-600 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Center/Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <Link href="/" className="text-center">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 flex items-center justify-center">
                <span className="text-white font-bold text-lg">✦</span>
              </div>
              <span className="sr-only">Home</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center text-sm font-medium text-gray-800">
            <Link
              href="/brands"
              className="hover:text-gray-600 transition-colors"
            >
              BRANDS
            </Link>
            <Link
              href="/skincare"
              className="hover:text-gray-600 transition-colors"
            >
              SKINCARE
            </Link>
            <Link
              href="/body-care"
              className="hover:text-gray-600 transition-colors"
            >
              BODY CARE
            </Link>
            <Link
              href="/mens"
              className="hover:text-gray-600 transition-colors"
            >
              MENS
            </Link>
          </nav>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button
              onClick={openSearch}
              className="text-gray-800 hover:text-gray-600 transition-colors"
              aria-label="Open search"
            >
              <Search size={24} />
            </button>

            {/* Favorites Icon */}
            <Link
              href="/account/favorites"
              className="text-gray-800 hover:text-gray-600 transition-colors relative"
              aria-label="View favorites"
            >
              <Heart size={24} />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <button
              onClick={openCart}
              className="text-gray-800 hover:text-gray-600 transition-colors relative"
              aria-label="Open cart"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Login */}
            <div className="relative">
              {!isLoading && (
                <>
                  {isAuthenticated && user ? (
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="text-gray-800 hover:text-gray-600 transition-colors cursor-pointer"
                      aria-label="User account"
                    >
                      <UserIcon size={24} />
                    </button>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="text-gray-800 hover:text-gray-600 transition-colors text-sm font-medium uppercase"
                    >
                      Login
                    </Link>
                  )}

                  {/* Profile Dropdown */}
                  {isAuthenticated && isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fade-in cursor-pointer">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900 truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/account/profile"
                        className="block px-4 py-2 hover:bg-gray-50 text-gray-800 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 hover:bg-gray-50 text-gray-800 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/account/favorites"
                        className="block px-4 py-2 hover:bg-gray-50 text-gray-800 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Favorites
                      </Link>
                      <button
                        onClick={async () => {
                          await logout();
                          setIsProfileOpen(false);
                          router.push("/");
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-800 transition-colors flex items-center gap-2 border-t border-gray-100 mt-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
