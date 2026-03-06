"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { useShop } from "@/context/ShopContext";

export default function ProductGrid({ products, isLoading = false }) {
  const { openCart } = useShop();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded mb-4" />
            <div className="bg-gray-200 h-4 rounded mb-2" />
            <div className="bg-gray-200 h-4 w-24 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
          onAddClick={openCart}
        />
      ))}
    </div>
  );
}
