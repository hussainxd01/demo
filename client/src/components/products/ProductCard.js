"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
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
    <Link href={`/product/${productId}`} className="group block">
      {/* Fixed-ratio image container — always 3:4 portrait, like H&M/Zara */}
      <div
        className="relative w-full overflow-hidden bg-[#f0eeeb]"
        style={{ aspectRatio: "3/4" }}
      >
        <Image
          src={productImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-103"
        />

        {/* Discount Badge — top left, editorial style */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#c8102e] text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5">
            -{discount}%
          </span>
        )}

        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 z-10"
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Heart
            size={18}
            strokeWidth={1.5}
            className={`transition-all duration-200 ${
              isFavorited
                ? "fill-black text-black"
                : "text-black/40 hover:text-black"
            }`}
          />
        </button>

        {/* Quick Add — slides up on hover, Zara-style */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 bg-white/95 text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
          aria-label={`Add ${product.name} to cart`}
        >
          Quick Add
        </button>
      </div>

      {/* Product Info — tight, editorial */}
      <div className="mt-3 space-y-0.5 px-0.5">
        {product.brand && (
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
            {product.brand}
          </p>
        )}
        <h3 className="text-[13px] font-medium text-gray-900 leading-snug line-clamp-1">
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[13px] font-semibold text-gray-900">
            Rs.{" "}
            {Number(product.price || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[12px] text-gray-400 line-through">
              Rs.{" "}
              {product.originalPrice.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          )}
        </div>

        {/* Rating — tiny, minimal */}
        {product.rating && (
          <div className="flex items-center gap-1 pt-0.5">
            <div className="flex gap-px">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-[10px] leading-none ${
                    i < Math.floor(product.rating)
                      ? "text-gray-800"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] text-gray-400">
              ({product.reviewCount || product.reviews || 0})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
