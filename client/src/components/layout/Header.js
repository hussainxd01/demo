"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Search, Heart, ShoppingCart, LogOut } from "lucide-react";
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
            <Menu size={24} />
          </button>

          {/* Desktop Navigation */}
          <nav
            className={`hidden md:flex items-center gap-8 justify-center text-sm font-medium transition-colors ${
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
            <button
              onClick={openSearch}
              className={`transition-colors ${
                isTransparent ? "text-white" : "text-gray-800"
              }`}
              aria-label="Open search"
            >
              <Search size={24} />
            </button>

            <Link
              href="/account/favorites"
              className={`transition-colors relative ${
                isTransparent ? "text-white" : "text-gray-800"
              }`}
              aria-label="View favorites"
            >
              <Heart size={24} />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <button
              onClick={openCart}
              className={`transition-colors relative ${
                isTransparent ? "text-white" : "text-gray-800"
              }`}
              aria-label="Open cart"
            >
              <ShoppingCart size={24} />
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
                      className={`text-sm font-medium uppercase transition-colors ${
                        isTransparent ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Login
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
