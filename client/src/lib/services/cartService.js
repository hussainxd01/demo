import { apiClient } from "@/lib/apiClient";

function unwrap(response) {
  return response?.data ?? response;
}

const cartService = {
  async getCart() {
    try {
      const response = await apiClient.get("/cart");
      return unwrap(response);
    } catch (error) {
      return { items: [] };
    }
  },

  async addToCart(productId, quantity = 1) {
    const response = await apiClient.post("/cart/add", { productId, quantity });
    return unwrap(response);
  },

  async updateCartItem(productId, quantity) {
    const response = await apiClient.patch("/cart/update", {
      productId,
      quantity,
    });
    return unwrap(response);
  },

  async removeFromCart(productId) {
    const response = await apiClient.post("/cart/remove", { productId });
    return unwrap(response);
  },

  async clearCart() {
    const response = await apiClient.delete("/cart/clear");
    return unwrap(response);
  },

  async updateCart(cartData) {
    const response = await apiClient.patch("/cart", cartData);
    return unwrap(response);
  },

  // Wishlist (Favorites)
  async getFavorites() {
    try {
      const response = await apiClient.get("/users/wishlist");
      return unwrap(response);
    } catch (error) {
      return { wishlist: [] };
    }
  },

  async addToFavorites(productId) {
    const response = await apiClient.post("/users/wishlist/add", { productId });
    return unwrap(response);
  },

  async removeFromFavorites(productId) {
    const response = await apiClient.post("/users/wishlist/remove", {
      productId,
    });
    return unwrap(response);
  },

  async isFavorite(productId) {
    try {
      const response = await this.getFavorites();
      const wishlist = response?.wishlist || [];
      return wishlist.some((p) => p?._id === productId);
    } catch (error) {
      return false;
    }
  },
};

export default cartService;
