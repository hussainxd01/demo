"use client";

import React from "react";

export default function ReviewSummary({
  reviews,
  averageRating,
  totalReviews,
}) {
  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 = 1 star, Index 4 = 5 stars
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  });

  // Calculate percentage for each rating
  const getPercentage = (count) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 pb-8 border-b border-gray-200">
      {/* Average Rating */}
      <div className="flex flex-col items-center justify-center md:pr-8 md:border-r md:border-gray-200">
        <div className="text-5xl font-bold text-gray-900">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex gap-1 my-2">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-xl ${
                i < Math.round(averageRating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingCounts[star - 1];
          const percentage = getPercentage(count);
          return (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm text-gray-700">{star}</span>
                <span className="text-yellow-400 text-sm">★</span>
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-12 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
