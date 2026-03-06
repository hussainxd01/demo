import { apiClient } from "@/lib/apiClient";

const userService = {
  async getProfile() {
    return apiClient.get("/users/profile");
  },

  async updateProfile(userData) {
    return apiClient.patch("/users/profile", userData);
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiClient.patch("/users/avatar", formData, { headers: {} });
  },

  // Favorites (called wishlist in cart service)
  async addToFavorites(productId) {
    return apiClient.post("/users/favorites", { productId });
  },

  async removeFromFavorites(productId) {
    return apiClient.delete(`/users/favorites/${productId}`);
  },

  async getFavorites() {
    return apiClient.get("/users/favorites");
  },

  async getUserOrders() {
    return apiClient.get("/users/orders");
  },

  // Admin operations
  async getAllUsers(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters,
    });
    return apiClient.get(`/users/admin/all?${params.toString()}`);
  },

  async toggleUserStatus(userId, isActive) {
    return apiClient.patch(`/users/${userId}/status`, { isActive });
  },

  async deleteUser(userId) {
    return apiClient.delete(`/users/${userId}`);
  },

  async getUserAnalytics() {
    return apiClient.get("/users/admin/analytics");
  },
};

export default userService;
