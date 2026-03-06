import { apiClient } from "@/lib/apiClient";

function unwrap(response) {
  return response?.data ?? response;
}

const productService = {
  async getAllProducts(page = 1, limit = 12, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters,
    });
    const response = await apiClient.get(`/products?${params.toString()}`);
    return {
      products: response?.data ?? [],
      total: response?.pagination?.total ?? 0,
      pagination: response?.pagination ?? { total: 0, page, limit, pages: 1 },
    };
  },

  async getProductById(id) {
    const response = await apiClient.get(`/products/${id}`);
    return unwrap(response);
  },

  async searchProducts(query, page = 1, limit = 12) {
    const response = await apiClient.get(
      `/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
    );
    return {
      products: response?.data ?? [],
      total: response?.pagination?.total ?? 0,
      pagination: response?.pagination ?? { total: 0, page, limit, pages: 1 },
    };
  },

  async getProductsByCategory(category, page = 1, limit = 12) {
    const response = await apiClient.get(
      `/products?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`,
    );
    return {
      products: response?.data ?? [],
      total: response?.pagination?.total ?? 0,
      pagination: response?.pagination ?? { total: 0, page, limit, pages: 1 },
    };
  },

  async getProductsByBrand(brand, page = 1, limit = 12) {
    const response = await apiClient.get(
      `/products?brand=${encodeURIComponent(brand)}&page=${page}&limit=${limit}`,
    );
    return {
      products: response?.data ?? [],
      total: response?.pagination?.total ?? 0,
      pagination: response?.pagination ?? { total: 0, page, limit, pages: 1 },
    };
  },

  // Admin operations
  async createProduct(productData) {
    const response =
      productData instanceof FormData
        ? await apiClient.post("/products", productData, { headers: {} })
        : await apiClient.post("/products", productData);
    return unwrap(response);
  },

  async updateProduct(id, productData) {
    const response =
      productData instanceof FormData
        ? await apiClient.patch(`/products/${id}`, productData, { headers: {} })
        : await apiClient.patch(`/products/${id}`, productData);
    return unwrap(response);
  },

  async deleteProduct(id) {
    const response = await apiClient.delete(`/products/${id}`);
    return unwrap(response);
  },

  async uploadProductImages(files) {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const response = await apiClient.post("/upload/multiple", formData, {
      headers: {},
    });
    return unwrap(response);
  },

  async deleteProductImage(publicId) {
    return apiClient.delete(`/upload/products/${publicId}`);
  },
};

export default productService;
