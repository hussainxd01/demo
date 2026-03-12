"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader, Filter } from "lucide-react";
import reviewService from "@/lib/services/reviewService";
import DataTable from "@/components/admin/DataTable";

const statusOptions = ["pending", "approved", "rejected"];

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, limit: 10 });
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadReviews();
  }, [page, statusFilter]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const response = await reviewService.getAllReviews(
        page,
        10,
        statusFilter ? { status: statusFilter } : {},
      );
      // API returns { success, message, data: [...reviews], pagination: { total, page, limit, pages } }
      setReviews(response.data || []);
      setPagination({ total: response.pagination?.total || 0, limit: 10 });
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await reviewService.approveReview(reviewId);
      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId ? { ...review, status: "approved" } : review,
        ),
      );
    } catch (error) {
      console.error("Failed to approve review", error);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      const reason = prompt("Enter rejection reason:");
      if (reason) {
        await reviewService.rejectReview(reviewId, reason);
        setReviews((prev) =>
          prev.map((review) =>
            review._id === reviewId
              ? { ...review, status: "rejected" }
              : review,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to reject review", error);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await reviewService.deleteReviewAdmin(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (error) {
      console.error("Failed to delete review", error);
    }
  };

  const columns = [
    {
      key: "userName",
      label: "Reviewer",
      width: "15%",
      render: (_, row) => row.user?.name || row.user?.email || "Anonymous",
    },
    {
      key: "productName",
      label: "Product",
      width: "20%",
      render: (_, row) => row.product?.name || "Unknown",
    },
    {
      key: "rating",
      label: "Rating",
      width: "10%",
      render: (value) => `${value}/5 ⭐`,
    },
    {
      key: "comment",
      label: "Comment",
      width: "25%",
      render: (value) =>
        value.substring(0, 50) + (value.length > 50 ? "..." : ""),
    },
    {
      key: "status",
      label: "Status",
      width: "12%",
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            value === "approved"
              ? "bg-green-100 text-green-700"
              : value === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Reviews</h1>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="w-5 h-5 text-gray-400 my-auto" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-black" />
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No reviews found
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div>
                          <p className="font-semibold text-black">
                            {review.user?.name || review.user?.email || "Anonymous"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {review.product?.name || "Unknown Product"}
                          </p>
                          <p className="text-sm font-medium text-yellow-600 mt-1">
                            {"⭐".repeat(review.rating)}
                          </p>
                          <p className="text-sm text-gray-700 mt-2">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {review.status !== "approved" && (
                        <button
                          onClick={() => handleApprove(review._id)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {review.status !== "rejected" && (
                        <button
                          onClick={() => handleReject(review._id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm("Delete this review?"))
                            handleDelete(review._id);
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
