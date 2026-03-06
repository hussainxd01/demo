"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { getBrands, searchProducts } from "@/lib/api";

export default function SearchModal() {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useShop();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }
      if (searchQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const products = await searchProducts(searchQuery, { limit: 10 });
        setResults(products);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [searchQuery]);

  useEffect(() => {
    const loadBrands = async () => {
      if (!isSearchOpen) return;
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Failed to load brands:", error);
      }
    };
    loadBrands();
  }, [isSearchOpen]);

  const handleClose = () => {
    setSearchQuery("");
    closeSearch();
  };

  return (
    <>
      {/* Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Search Modal */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300 ${
          isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-2xl mx-auto p-4 md:p-6">
          {/* Search Input */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={isSearchOpen}
              className="w-full px-4 py-3 pl-10 text-lg border-b-2 border-gray-300 focus:border-gray-800 outline-none transition-colors"
            />
            <button
              onClick={handleClose}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Close search"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="mt-6 pb-6 md:pb-8">
            {!searchQuery.trim() ? (
              <>
                {/* Popular Brands */}
                <div className="mb-8">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Popular Brands
                  </h3>
                  <div className="space-y-3">
                    {brands.map((brand) => (
                      <Link
                        key={brand}
                        href={`/brand/${encodeURIComponent(brand)}`}
                        className="block text-gray-800 hover:text-gray-600 transition-colors font-medium"
                        onClick={handleClose}
                      >
                        {brand}
                      </Link>
                    ))}
                    <Link
                      href="/products"
                      className="block text-gray-800 hover:text-gray-600 transition-colors font-medium"
                      onClick={handleClose}
                    >
                      All Products
                    </Link>
                  </div>
                </div>

                {/* Info Section */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Info
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href="/contact"
                      className="block text-gray-800 hover:text-gray-600 transition-colors font-medium"
                      onClick={handleClose}
                    >
                      Contact
                    </Link>
                    <Link
                      href="/faq"
                      className="block text-gray-800 hover:text-gray-600 transition-colors font-medium"
                      onClick={handleClose}
                    >
                      FAQ
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Searching...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((product) => (
                      <Link
                        key={product._id}
                        href={`/product/${product._id}`}
                        className="flex items-center gap-4 pb-4 border-b border-gray-200 hover:bg-gray-50 -mx-2 px-2 py-2 rounded transition-colors"
                        onClick={handleClose}
                      >
                        <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                          <img
                            src={product.images?.[0]?.url || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">
                            {product.brand}
                          </p>
                          <p className="font-medium text-gray-800 truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Rs. {Number(product.price || 0).toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No products found for "{searchQuery}"
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
