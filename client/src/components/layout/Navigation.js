"use client";

import React from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { getBrands } from "@/lib/api";
import { CATEGORIES } from "@/lib/products";

export default function Navigation() {
  const { isMenuOpen, closeMenu } = useShop();
  const [expandedMenu, setExpandedMenu] = React.useState(null);
  const [brands, setBrands] = React.useState([]);

  const handleMenuClick = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  React.useEffect(() => {
    const loadBrands = async () => {
      if (!isMenuOpen) return;
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Failed to load brands:", error);
      }
    };
    loadBrands();
  }, [isMenuOpen]);

  return (
    <>
      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white z-40 md:hidden transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={closeMenu}
              className="text-gray-800 hover:text-gray-600 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Brands Section */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => handleMenuClick("brands")}
                className="w-full flex items-center justify-between px-4 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
              >
                BRANDS
                <ChevronRight
                  size={20}
                  className={`transform transition-transform ${
                    expandedMenu === "brands" ? "rotate-90" : ""
                  }`}
                />
              </button>
              {expandedMenu === "brands" && (
                <div className="bg-gray-50 px-4 py-2 space-y-2">
                  {brands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/brand/${encodeURIComponent(brand)}`}
                      className="block py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      onClick={closeMenu}
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Categories Section */}
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="w-full block px-4 py-4 text-left font-medium text-gray-800 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                onClick={closeMenu}
              >
                {category.name}
              </Link>
            ))}

            {/* Explore Section */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => handleMenuClick("explore")}
                className="w-full flex items-center justify-between px-4 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
              >
                EXPLORE
                <ChevronRight
                  size={20}
                  className={`transform transition-transform ${
                    expandedMenu === "explore" ? "rotate-90" : ""
                  }`}
                />
              </button>
              {expandedMenu === "explore" && (
                <div className="bg-gray-50 px-4 py-2 space-y-2">
                  <Link
                    href="/new-arrivals"
                    className="block py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={closeMenu}
                  >
                    New Arrivals
                  </Link>
                  <Link
                    href="/bestsellers"
                    className="block py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={closeMenu}
                  >
                    Bestsellers
                  </Link>
                  <Link
                    href="/sale"
                    className="block py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={closeMenu}
                  >
                    Sale
                  </Link>
                </div>
              )}
            </div>

            {/* Our Stores Section */}
            <Link
              href="/stores"
              className="w-full block px-4 py-4 text-left font-medium text-gray-800 border-b border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={closeMenu}
            >
              OUR STORES
            </Link>
          </div>

          {/* Footer Section */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            {/* Currency/Country */}
            <div className="flex items-center gap-2 px-2 py-2 text-sm text-gray-600 border border-gray-200 rounded">
              <span>🇮🇳</span>
              <span>INDIA (INR ₹)</span>
            </div>

            {/* Login */}
            <Link
              href="/login"
              className="block px-2 py-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
              onClick={closeMenu}
            >
              Log in
            </Link>

            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                f
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                𝕏
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                📌
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                📷
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
