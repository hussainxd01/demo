"use client";

import React from "react";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export default function ProductCard({ product, onAddClick }) {
  const { addToCart, toggleFavorite, favorites } = useShop();
  const productId = product._id || product.id;
  const isFavorited = favorites.includes(productId);
  const productImage =
    product.images?.[0]?.url || product.image || "/placeholder.jpg";
  const originalPrice = product.originalPrice || product.price * 1.2;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    await addToCart(product, 1);
    if (onAddClick) onAddClick();
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    await toggleFavorite(productId);
  };

  const discount = product.originalPrice
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  return (
    <Link href={`/product/${productId}`}>
      <div className="group cursor-pointer">
        {/* Image Container */}
        <div className="relative bg-gray-200 rounded overflow-hidden aspect-square mb-4">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            crossOrigin="anonymous"
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-yellow-300 text-gray-900 px-2 py-1 rounded text-xs font-bold">
              -{discount}%
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 left-3 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100"
            aria-label={
              isFavorited ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              size={20}
              className={`transition-colors ${
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>

          {/* Zoom Icon */}
          <div className="absolute bottom-3 right-3 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            {product.brand}
          </p>
          <h3 className="font-medium text-gray-800 line-clamp-2 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-600">
                ({product.reviewCount || product.reviews || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="font-semibold text-gray-900">
              Rs. {Number(product.price || 0).toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                Rs. {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full mt-4 bg-white border-2 border-gray-800 text-gray-800 font-semibold py-2 rounded hover:bg-gray-800 hover:text-white transition-colors flex items-center justify-center gap-2 group/btn"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus
              size={18}
              className="group-hover/btn:rotate-90 transition-transform"
            />
            ADD
          </button>
        </div>
      </div>
    </Link>
  );
}
