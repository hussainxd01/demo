import { apiClient } from "@/lib/apiClient";

const cartService = {
  async getCart() {
    try {
      return await apiClient.get("/cart");
    } catch (error) {
      return { items: [], subtotal: 0, total: 0 };
    }
  },

  async addToCart(productId, quantity = 1) {
    return apiClient.post("/cart/add", { productId, quantity });
  },

  async updateCartItem(productId, quantity) {
    return apiClient.patch("/cart/update", { productId, quantity });
  },

  async removeFromCart(productId) {
    return apiClient.post("/cart/remove", { productId });
  },

  async clearCart() {
    return apiClient.delete("/cart/clear");
  },

  async updateCart(cartData) {
    return apiClient.patch("/cart", cartData);
  },

  // Favorites
  async getFavorites() {
    try {
      return await apiClient.get("/users/favorites");
    } catch (error) {
      return { products: [] };
    }
  },

  async addToFavorites(productId) {
    return apiClient.post("/users/favorites", { productId });
  },

  async removeFromFavorites(productId) {
    return apiClient.delete(`/users/favorites/${productId}`);
  },

  async isFavorite(productId) {
    try {
      const response = await apiClient.get(`/users/favorites/${productId}`);
      return response.isFavorite;
    } catch (error) {
      return false;
    }
  },
};

export default cartService;
