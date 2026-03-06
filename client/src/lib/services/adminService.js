import apiClient from "@/lib/apiClient";

const adminService = {
  // Product Admin Operations
  async createProduct(productData) {
    return apiClient.post("/products", productData);
  },

  async updateProduct(productId, productData) {
    return apiClient.patch(`/products/${productId}`, productData);
  },

  async deleteProduct(productId) {
    return apiClient.delete(`/products/${productId}`);
  },

  async getProductsAdmin(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    return apiClient.get(`/products?${params.toString()}`);
  },

  // User Admin Operations
  async getAllUsers(page = 1, limit = 10) {
    const params = new URLSearchParams({ page, limit });
    return apiClient.get(`/users?${params.toString()}`);
  },

  async getUserById(userId) {
    return apiClient.get(`/users/${userId}`);
  },

  async updateUser(userId, userData) {
    return apiClient.patch(`/users/${userId}`, userData);
  },

  async toggleUserStatus(userId, isActive) {
    return apiClient.patch(`/users/${userId}/status`, { isActive });
  },

  async deleteUser(userId) {
    return apiClient.delete(`/users/${userId}`);
  },

  // Order Admin Operations
  async getAllOrders(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    return apiClient.get(`/orders/admin/all?${params.toString()}`);
  },

  async getOrderById(orderId) {
    return apiClient.get(`/orders/${orderId}`);
  },

  async updateOrderStatus(orderId, status, notes = "") {
    return apiClient.patch(`/orders/${orderId}/status`, { status, notes });
  },

  async updatePaymentStatus(orderId, paymentStatus) {
    return apiClient.patch(`/orders/${orderId}/payment`, { paymentStatus });
  },

  // Review Admin Operations
  async getPendingReviews(page = 1, limit = 10) {
    const params = new URLSearchParams({ page, limit });
    return apiClient.get(`/reviews/admin/pending?${params.toString()}`);
  },

  async approveReview(reviewId) {
    return apiClient.patch(`/reviews/admin/${reviewId}/approve`, {});
  },

  async rejectReview(reviewId, reason = "") {
    return apiClient.patch(`/reviews/admin/${reviewId}/reject`, { reason });
  },

  // Analytics
  async getDashboardStats() {
    return apiClient.get("/admin/stats");
  },

  async getProductAnalytics() {
    return apiClient.get("/products/admin/analytics");
  },

  async getOrderAnalytics() {
    return apiClient.get("/orders/admin/analytics");
  },

  async getUserAnalytics() {
    return apiClient.get("/users/admin/analytics");
  },
};

export default adminService;
