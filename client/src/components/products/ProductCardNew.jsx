'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Plus } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function ProductCardNew({ product, showQuickAdd = false }) {
  const { addToCart, addToFavorites, favorites } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const isFavorited = favorites.some((fav) => fav._id === product._id);
  const discountPercentage = product.discount ? Math.round((product.discount / product.price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToFavorites(product);
  };

  return (
    <Link href={`/product/${product._id}`}>
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image Container */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-4">
          {/* Main Image */}
          <Image
            src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Dark Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-xs font-bold z-10">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Quick Add Button - Show on hover */}
          {showQuickAdd && (
            <button
              onClick={handleAddToCart}
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 ${
                isAddedToCart ? 'scale-110' : ''
              }`}
            >
              <div className="bg-black text-white p-3 rounded-full hover:scale-110 transition-transform flex items-center justify-center">
                {isAddedToCart ? (
                  <span className="text-xs font-bold">✓</span>
                ) : (
                  <Plus size={24} />
                )}
              </div>
            </button>
          )}

          {/* Action Buttons - Top Right on Hover */}
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center gap-2">
            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full transition-all duration-300 ${
                isFavorited
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
              aria-label="Add to favorites"
            >
              <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div>
          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:opacity-80 transition-opacity">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-semibold text-gray-900">
              ${product.discount || product.price}
            </span>
            {product.discount && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price}
              </span>
            )}
          </div>

          {/* Rating/Availability */}
          {product.availability && (
            <p className="text-xs text-gray-600">{product.availability}</p>
          )}

          {product.rating && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              {product.reviewCount && (
                <span className="text-xs text-gray-600">({product.reviewCount})</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
