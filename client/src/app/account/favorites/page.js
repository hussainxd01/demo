"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import cartService from "@/lib/services/cartService";
import { useShop } from "@/context/ShopContext";
import { Heart, Loader, ShoppingCart, Check } from "lucide-react";

export default function FavoritesPage() {
  const { addToCart, openCart } = useShop();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState({});

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await cartService.getFavorites();
      // Response structure: { wishlist: [...products] }
      const wishlist = response.wishlist || response.data || [];
      setFavorites(Array.isArray(wishlist) ? wishlist : []);
    } catch (err) {
      setError("Failed to load favorites");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await cartService.removeFromFavorites(productId);
      setFavorites((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Failed to remove from favorites", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-6">My Favorites</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No favorites yet
          </h2>
          <p className="text-gray-600 mb-4">
            Add products to your favorites to see them here
          </p>
          <Link
            href="/products"
            className="text-black font-medium hover:text-gray-600"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <div key={product._id} className="group animate-fade-in">
              <Link href={`/product/${product._id}`}>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <img
                    src={product.images?.[0]?.url || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(product._id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                </div>
                <h3 className="font-semibold text-black line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-lg font-bold text-black">
                    Rs. {product.price.toFixed(2)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      Rs. {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </Link>
              <button
                onClick={async () => {
                  await addToCart(product, 1);
                  setAddedToCart((prev) => ({ ...prev, [product._id]: true }));
                  openCart();
                  setTimeout(() => {
                    setAddedToCart((prev) => ({
                      ...prev,
                      [product._id]: false,
                    }));
                  }, 2000);
                }}
                disabled={addedToCart[product._id]}
                className={`w-full flex items-center justify-center gap-2 py-2 border rounded-lg transition-colors ${
                  addedToCart[product._id]
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                {addedToCart[product._id] ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
