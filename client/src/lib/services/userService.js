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
};

export default userService;
