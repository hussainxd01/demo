import { apiClient } from "@/lib/apiClient";

const productService = {
  async getAllProducts(page = 1, limit = 12, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters,
    });
    return apiClient.get(`/products?${params.toString()}`);
  },

  async getProductById(id) {
    return apiClient.get(`/products/${id}`);
  },

  async searchProducts(query, page = 1, limit = 12) {
    return apiClient.get(
      `/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
    );
  },

  async getProductsByCategory(category, page = 1, limit = 12) {
    return apiClient.get(
      `/products?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`,
    );
  },

  async getProductsByBrand(brand, page = 1, limit = 12) {
    return apiClient.get(
      `/products?brand=${encodeURIComponent(brand)}&page=${page}&limit=${limit}`,
    );
  },

  // Admin operations
  async createProduct(productData) {
    return apiClient.post("/products", productData);
  },

  async updateProduct(id, productData) {
    return apiClient.put(`/products/${id}`, productData);
  },

  async deleteProduct(id) {
    return apiClient.delete(`/products/${id}`);
  },

  async uploadProductImages(files) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return apiClient.post("/upload/products", formData, { headers: {} });
  },

  async deleteProductImage(publicId) {
    return apiClient.delete(`/upload/products/${publicId}`);
  },
};

export default productService;
