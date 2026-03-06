"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import ProductGrid from "@/components/products/ProductGrid";
import { getProductsByCategory } from "@/lib/api";
import { CATEGORIES } from "@/lib/products";

export default function CategoryPage({ params }) {
  const { slug } = use(params);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Find category name from slug
  const category = CATEGORIES.find((c) => c.slug === slug);
  const categoryName = category?.name || slug.toUpperCase().replace("-", " ");

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProductsByCategory(categoryName);
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 md:px-6 py-8 md:py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{categoryName}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {categoryName}
          </h1>
          <p className="text-gray-600 mt-4">
            Explore our collection of premium {categoryName.toLowerCase()}{" "}
            products.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Product Count */}
        <p className="text-sm text-gray-600 mb-8">
          {products.length} {products.length === 1 ? "product" : "products"}{" "}
          found
        </p>

        {/* Products Grid */}
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </div>
  );
}
