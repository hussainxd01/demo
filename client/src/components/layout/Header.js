"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import UserIcon from "@/components/common/UserIcon";

export default function Header() {
  const { isSearchOpen, openSearch, openMenu, openCart, cart, favorites } =
    useShop();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Only the homepage gets the transparent treatment
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset scroll state on route change so other pages always start solid
  useEffect(() => {
    setIsScrolled(window.scrollY > 10);
  }, [pathname]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Transparent only on homepage before scroll
  const isTransparent = isHomePage && !isScrolled;

  return (
    <>
      <header
        className={`z-40 transition-all duration-300 ${
          isTransparent
            ? "absolute top-0 left-0 w-full bg-transparent border-b border-white/20"
            : "sticky top-0 bg-white border-b border-gray-200 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          {/* Left: Menu Icon */}
          <button
            onClick={openMenu}
            className={`flex md:hidden transition-colors ${
              isTransparent ? "text-white" : "text-gray-800"
            }`}
            aria-label="Open menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Desktop Navigation */}
          <nav
            className={`hidden md:flex items-center gap-8 justify-center text-xs font-semibold font-medium transition-colors ${
              isTransparent ? "text-white" : "text-gray-800"
            }`}
          >
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

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <Link href="/" className="text-center">
              <span
                className={`font-bold text-lg uppercase transition-colors ${
                  isTransparent ? "text-white" : "text-black"
                }`}
              >
                Charmsvilla
              </span>
              <span className="sr-only">Home</span>
            </Link>
          </div>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-4">
            {/* Search - Desktop Only */}
            <button
              onClick={openSearch}
              className={`hidden md:block transition-colors ${
                isTransparent ? "text-white" : "text-gray-800"
              }`}
              aria-label="Open search"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Favorites - Desktop Only */}
            <Link
              href="/account/favorites"
              className={`hidden md:block transition-colors relative ${
                isTransparent ? "text-white" : "text-gray-800"
              }`}
              aria-label="View favorites"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart - Always Visible */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  router.push("/auth/login");
                } else {
                  openCart();
                }
              }}
              className={`transition-colors relative ${
                isTransparent ? "text-white" : "text-gray-800"
              }`}
              aria-label="Open cart"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="relative">
              {!isLoading && (
                <>
                  {isAuthenticated && user ? (
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className={`transition-colors ${
                        isTransparent ? "text-white" : "text-gray-800"
                      }`}
                      aria-label="User account"
                    >
                      <UserIcon size={24} />
                    </button>
                  ) : (
                    <Link
                      href="/auth/login"
                      className={`transition-colors ${
                        isTransparent ? "text-white" : "text-gray-800"
                      }`}
                      aria-label="Login"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </Link>
                  )}

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
