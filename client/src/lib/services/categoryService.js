import { apiClient } from "@/lib/apiClient";

function unwrap(response) {
  return response?.data ?? response;
}

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await apiClient.get("/categories");
    return response?.data ?? [];
  },

  // Get single category
  getCategoryById: async (id) => {
    const response = await apiClient.get(`/categories/${id}`);
    return unwrap(response);
  },

  // Create new category
  createCategory: async (categoryData) => {
    const response = await apiClient.post("/categories", categoryData);
    return unwrap(response);
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await apiClient.patch(`/categories/${id}`, categoryData);
    return unwrap(response);
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return unwrap(response);
  },

  // Get category statistics
  getCategoryStats: async () => {
    const response = await apiClient.get("/categories/stats");
    return response?.data ?? [];
  },
};

export default categoryService;
