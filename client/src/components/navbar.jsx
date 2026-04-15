"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white text-black border-b border-gray-200"
          : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-bold">
          release
        </Link>

        {/* Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            href="/"
            className="text-sm font-medium hover:opacity-80 transition-opacity"
          >
            HOME
          </Link>
          <Link
            href="/shop"
            className="text-sm font-medium hover:opacity-80 transition-opacity"
          >
            SHOP
          </Link>
          <Link
            href="/pages"
            className="text-sm font-medium hover:opacity-80 transition-opacity"
          >
            PAGES
          </Link>
          <Link
            href="/features"
            className="text-sm font-medium hover:opacity-80 transition-opacity"
          >
            PRODUCT FEATURES
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:opacity-80 transition-opacity"
          >
            CONTACT
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-sm hover:opacity-80 transition-opacity">
            🌐 UNITED STATES
          </button>
          <button className="text-lg hover:opacity-80 transition-opacity">
            🔍
          </button>
          <button className="text-lg hover:opacity-80 transition-opacity">
            👤
          </button>
          <button className="text-lg hover:opacity-80 transition-opacity">
            🛍️
          </button>
        </div>
      </div>
    </nav>
  );
}
