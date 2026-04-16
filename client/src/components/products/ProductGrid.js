"use client";
import React from "react";
import ProductCard from "./ProductCard";
import { useShop } from "@/context/ShopContext";

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      {/* Matches the 3:4 aspect ratio of the real card */}
      <div className="w-full bg-[#ece9e4]" style={{ aspectRatio: "3/4" }} />
      <div className="mt-3 px-0.5 space-y-2">
        <div className="h-2.5 w-14 bg-[#ece9e4] rounded-sm" />
        <div className="h-3 w-full bg-[#ece9e4] rounded-sm" />
        <div className="h-3 w-20 bg-[#ece9e4] rounded-sm" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, isLoading = false }) {
  const { openCart } = useShop();

  const gridClass =
    "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10";

  if (isLoading) {
    return (
      <div className={gridClass}>
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-[11px] tracking-[0.2em] uppercase text-gray-400">
          No products found
        </p>
      </div>
    );
  }

  return (
    <div className={gridClass}>
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
