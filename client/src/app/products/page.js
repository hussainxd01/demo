"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductGrid from "@/components/products/ProductGrid";
import { getProducts, getProductsByCategory } from "@/lib/api";
import { CATEGORIES } from "@/lib/products";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        let data;
        if (selectedCategory) {
          data = await getProductsByCategory(selectedCategory);
        } else {
          data = await getProducts();
        }
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 md:px-6 py-8 md:py-12 border-b border-gray-200">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          All Products
        </h1>
        <p className="text-gray-600">
          Discover our full range of luxury skincare and beauty products.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === null
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.slug}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.name
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </div>
  );
}
