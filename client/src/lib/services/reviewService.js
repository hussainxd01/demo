import { apiClient } from "@/lib/apiClient";

const reviewService = {
  async getProductReviews(productId, page = 1, limit = 10) {
    return apiClient.get(
      `/reviews/product/${productId}?page=${page}&limit=${limit}`,
    );
  },

  async createReview(productId, reviewData) {
    return apiClient.post(`/reviews/product/${productId}`, reviewData);
  },

  async updateReview(reviewId, reviewData) {
    return apiClient.patch(`/reviews/${reviewId}`, reviewData);
  },

  async deleteReview(reviewId) {
    return apiClient.delete(`/reviews/${reviewId}`);
  },

  async markHelpful(reviewId) {
    return apiClient.post(`/reviews/${reviewId}/helpful`, {});
  },

  async markUnhelpful(reviewId) {
    return apiClient.post(`/reviews/${reviewId}/unhelpful`, {});
  },

  // Admin operations
  async getPendingReviews(page = 1, limit = 10) {
    const params = new URLSearchParams({ page, limit });
    return apiClient.get(`/reviews/admin/pending?${params.toString()}`);
  },

  async approveReview(reviewId) {
    return apiClient.patch(`/reviews/admin/${reviewId}/approve`, {});
  },

  async getAllReviews(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters,
    });
    return apiClient.get(`/reviews/admin/all?${params.toString()}`);
  },

  async rejectReview(reviewId, reason) {
    return apiClient.patch(`/reviews/admin/${reviewId}/reject`, { reason });
  },

  async deleteReviewAdmin(reviewId) {
    return apiClient.delete(`/reviews/admin/${reviewId}/delete`);
  },
};

export default reviewService;
