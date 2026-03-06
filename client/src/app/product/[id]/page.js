"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { Heart, Share2, Truck, Zap } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { getProductById } from "@/lib/api";
import ExpandableSection from "@/components/common/ExpandableSection";

export default function ProductPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart, openCart, toggleFavorite, favorites } = useShop();
  const isFavorited = product && favorites.includes(product.id);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setSelectedImage(0);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      openCart();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">Product not found</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          HOME
        </Link>
        <span>/</span>
        <Link
          href={`/category/${product.category.toLowerCase()}`}
          className="hover:text-gray-900 transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded aspect-square overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Zoom Icon */}
              <button className="absolute bottom-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors">
                <Zap size={20} className="text-gray-600" />
              </button>

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-yellow-300 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded flex-shrink-0 border-2 transition-colors ${
                    selectedImage === index
                      ? "border-gray-800"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {product.brand}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                Rs. {product.price.toLocaleString()}
              </span>
              <span className="text-lg text-gray-500 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
              <span className="text-sm text-green-600 font-semibold">
                Save {discount}%
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed italic">
              {product.fullDescription}
            </p>

            {/* Size */}
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                <strong>Size:</strong> {product.size}
              </p>
            </div>

            {/* Quantity & Actions */}
            <div className="flex gap-4 pt-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-6 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                aria-label={
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  size={20}
                  className={
                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                  }
                />
              </button>

              {/* Share Button */}
              <button
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                aria-label="Share product"
              >
                <Share2 size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 border-2 border-gray-800 text-gray-800 font-bold text-lg rounded hover:bg-gray-800 hover:text-white transition-colors"
            >
              ADD TO CART
            </button>

            {/* Buy It Now Button */}
            <button className="w-full py-4 bg-yellow-300 text-gray-900 font-bold text-lg rounded hover:bg-yellow-400 transition-colors">
              BUY IT NOW
            </button>

            {/* Availability */}
            <p className="text-sm text-gray-600">
              Pickup currently unavailable at German Warehouse
            </p>
            <button className="text-sm text-gray-800 hover:text-gray-600 transition-colors font-medium">
              Check availability at other stores
            </button>

            {/* Shipping Info */}
            <div className="p-4 bg-blue-50 rounded flex gap-3">
              <Truck className="text-blue-600 flex-shrink-0" size={20} />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-blue-900">
                  Free shipping on orders over Rs. 5,000
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Estimated delivery in 2-3 business days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Sections */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <ExpandableSection title="Key Ingredients" defaultOpen={true}>
              {product.keyIngredients}
            </ExpandableSection>

            <ExpandableSection title="How to Use">
              {product.howToUse}
            </ExpandableSection>

            <ExpandableSection title="Ingredients">
              <p className="text-sm text-gray-700">
                Full ingredient list available upon request or on product
                packaging.
              </p>
            </ExpandableSection>
          </div>

          <div>
            <ExpandableSection title="Shipping Information" defaultOpen={false}>
              <div className="space-y-2 text-sm text-gray-700">
                {product.shipping.split(". ").map((item, index) => (
                  <p key={index}>- {item}</p>
                ))}
              </div>
            </ExpandableSection>

            <ExpandableSection title="Return Policy">
              <p className="text-sm text-gray-700">
                Items can be returned within 30 days of purchase for a full
                refund. Products must be unused and in original packaging.
              </p>
            </ExpandableSection>
          </div>
        </div>
      </div>
    </div>
  );
}
