"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, User } from "lucide-react";
import reviewService from "@/lib/services/reviewService";

export default function ReviewCard({ review }) {
  const [helpful, setHelpful] = useState(review.helpful || 0);
  const [unhelpful, setUnhelpful] = useState(review.unhelpful || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = async () => {
    if (hasVoted) return;
    try {
      await reviewService.markHelpful(review._id);
      setHelpful((prev) => prev + 1);
      setHasVoted(true);
    } catch (error) {
      console.error("Failed to mark helpful:", error);
    }
  };

  const handleUnhelpful = async () => {
    if (hasVoted) return;
    try {
      await reviewService.markUnhelpful(review._id);
      setUnhelpful((prev) => prev + 1);
      setHasVoted(true);
    } catch (error) {
      console.error("Failed to mark unhelpful:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      {/* Header: User + Rating + Date */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {review.user?.avatar ? (
              <img
                src={review.user.avatar}
                alt={review.user?.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={20} className="text-gray-400" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {review.user?.name || "Anonymous"}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Title */}
      {review.title && (
        <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
      )}

      {/* Review Comment */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        {review.comment}
      </p>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {review.images.map((image, index) => (
            <div
              key={index}
              className="w-20 h-20 flex-shrink-0 rounded overflow-hidden border border-gray-200"
            >
              <img
                src={image.url}
                alt={`Review image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Helpful Section */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-500">Was this helpful?</span>
        <button
          onClick={handleHelpful}
          disabled={hasVoted}
          className={`flex items-center gap-1.5 px-3 py-1 rounded border transition-colors ${
            hasVoted
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800"
          }`}
        >
          <ThumbsUp size={14} />
          <span>{helpful}</span>
        </button>
        <button
          onClick={handleUnhelpful}
          disabled={hasVoted}
          className={`flex items-center gap-1.5 px-3 py-1 rounded border transition-colors ${
            hasVoted
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800"
          }`}
        >
          <ThumbsDown size={14} />
          <span>{unhelpful}</span>
        </button>
      </div>
    </div>
  );
}
