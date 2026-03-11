"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, Share2, Truck, Zap, Loader, Star } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { getProductById } from "@/lib/api";
import ExpandableSection from "@/components/common/ExpandableSection";
import { CATEGORIES } from "@/lib/products";
import reviewService from "@/lib/services/reviewService";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewSummary from "@/components/reviews/ReviewSummary";
import ReviewModal from "@/components/reviews/ReviewModal";
import { useAuth } from "@/context/AuthContext";

export default function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Review state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsPagination, setReviewsPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });
  const [canReview, setCanReview] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { addToCart, openCart, toggleFavorite, favorites } = useShop();
  const { user } = useAuth();
  const productId = product?._id;
  const isFavorited = productId && favorites.includes(productId);

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

    if (id) {
      loadProduct();
    }
  }, [id]);

  // Load reviews
  useEffect(() => {
    const loadReviews = async () => {
      if (!id) return;
      setReviewsLoading(true);
      try {
        const response = await reviewService.getProductReviews(id, 1, 10);
        setReviews(response.data || []);
        setReviewsPagination(
          response.pagination || { total: 0, page: 1, pages: 1 },
        );
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [id]);

  // Check review eligibility when user is logged in
  useEffect(() => {
    const checkEligibility = async () => {
      if (!id || !user) {
        setCanReview(false);
        return;
      }
      try {
        const response = await reviewService.checkEligibility(id);
        // Response is wrapped in { success, message, data: { canReview, reason } }
        const eligibilityData = response.data || response;
        setCanReview(eligibilityData.canReview === true);
      } catch (error) {
        console.error("Failed to check review eligibility:", error);
        setCanReview(false);
      }
    };

    checkEligibility();
  }, [id, user]);

  const handleReviewSuccess = async () => {
    // Reload reviews after successful submission
    try {
      const response = await reviewService.getProductReviews(id, 1, 10);
      setReviews(response.data || []);
      setReviewsPagination(
        response.pagination || { total: 0, page: 1, pages: 1 },
      );
      setCanReview(false); // User can no longer review after submitting
    } catch (error) {
      console.error("Failed to reload reviews:", error);
    }
  };

  const loadMoreReviews = async () => {
    if (reviewsPagination.page >= reviewsPagination.pages) return;

    try {
      const nextPage = reviewsPagination.page + 1;
      const response = await reviewService.getProductReviews(id, nextPage, 10);
      setReviews((prev) => [...prev, ...(response.data || [])]);
      setReviewsPagination(response.pagination || reviewsPagination);
    } catch (error) {
      console.error("Failed to load more reviews:", error);
    }
  };

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

  const imageUrls = (product.images || []).map((img) => img.url);

  const categoryName =
    typeof product.category === "object"
      ? product.category.name
      : product.category;
  const categorySlug =
    typeof product.category === "object"
      ? product.category.slug
      : CATEGORIES.find((c) => c.name === categoryName)?.slug ||
        categoryName.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "");

  const ingredients = product.specifications?.ingredients || [];

  const instructions = product.instructions
    ? product.instructions
        .split(/\r?\n|•|- /)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          HOME
        </Link>
        <span>/</span>

        <Link
          href={`/category/${categorySlug}`}
          className="hover:text-gray-900 transition-colors"
        >
          {categoryName}
        </Link>

        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded aspect-square overflow-hidden">
              <img
                src={imageUrls[selectedImage] || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              <button className="absolute bottom-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors">
                <Zap size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {imageUrls.map((image, index) => (
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

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {product.brand}
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>
            </div>

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

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                Rs. {Number(product.price || 0).toLocaleString()}
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed italic">
              {product.description}
            </p>

            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                <strong>Size:</strong>{" "}
                {product.specifications?.size ||
                  product.specifications?.volume ||
                  product.specifications?.weight ||
                  "—"}
              </p>
            </div>

            {/* Quantity + Buttons */}
            <div className="flex gap-4 pt-4">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  −
                </button>

                <span className="px-6 py-2 font-medium">{quantity}</span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => toggleFavorite(productId)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                <Heart
                  size={20}
                  className={
                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                  }
                />
              </button>

              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <Share2 size={20} className="text-gray-600" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 border-2 border-gray-800 text-gray-800 font-bold text-lg rounded hover:bg-gray-800 hover:text-white"
            >
              ADD TO CART
            </button>

            <button className="w-full py-4 bg-yellow-300 text-gray-900 font-bold text-lg rounded hover:bg-yellow-400">
              BUY IT NOW
            </button>

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

        {/* Expandable Sections */}

        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <ExpandableSection title="Key Ingredients" defaultOpen>
              {ingredients.length > 0
                ? ingredients
                : ["No ingredients listed."]}
            </ExpandableSection>

            <ExpandableSection title="How to Use">
              {instructions.length > 0
                ? instructions
                : ["No instructions provided."]}
            </ExpandableSection>
          </div>

          <div>
            <ExpandableSection title="Return Policy">
              <p className="text-sm text-gray-700">
                Items can be returned within 30 days of purchase for a full
                refund. Products must be unused and in original packaging.
              </p>
            </ExpandableSection>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 md:mt-20 border-t border-gray-200 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            {canReview && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-6 py-2 bg-yellow-300 text-gray-900 font-semibold rounded hover:bg-yellow-400 transition-colors flex items-center gap-2"
              >
                <Star size={18} />
                Write a Review
              </button>
            )}
          </div>

          {reviewsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-8">
              {/* Summary */}
              <ReviewSummary
                reviews={reviews}
                averageRating={product?.rating || 0}
                totalReviews={reviewsPagination.total}
              />

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>

              {/* Load More */}
              {reviewsPagination.page < reviewsPagination.pages && (
                <div className="text-center pt-4">
                  <button
                    onClick={loadMoreReviews}
                    className="px-6 py-2 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Load More Reviews
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">No reviews yet</p>
              <p className="text-sm text-gray-500">
                {canReview
                  ? "Be the first to review this product!"
                  : "Purchase this product to leave a review."}
              </p>
              {canReview && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="mt-4 px-6 py-2 bg-yellow-300 text-gray-900 font-semibold rounded hover:bg-yellow-400 transition-colors"
                >
                  Write a Review
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && product && (
        <ReviewModal
          product={product}
          onClose={() => setShowReviewModal(false)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}
