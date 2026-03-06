import { apiClient } from "@/lib/apiClient";

const authService = {
  async register(userData) {
    const response = await apiClient.post("/auth/register", userData);
    const data = response?.data ?? response;
    if (data.accessToken && data.refreshToken) {
      await apiClient.setTokens(data.accessToken, data.refreshToken);
    }
    return data;
  },

  async login(email, password) {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    const data = response?.data ?? response;
    if (data.accessToken && data.refreshToken) {
      await apiClient.setTokens(data.accessToken, data.refreshToken);
    }
    return data;
  },

  async logout() {
    try {
      await apiClient.post("/auth/logout", {});
    } catch (error) {
      console.log("[v0] Logout error:", error.message);
    }
    await apiClient.clearTokens();
  },

  async forgotPassword(email) {
    return apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(token, password) {
    return apiClient.post("/auth/reset-password", { token, password });
  },

  async getCurrentUser() {
    try {
      return await apiClient.get("/auth/me");
    } catch (error) {
      await apiClient.clearTokens();
      throw error;
    }
  },

  async updateProfile(userData) {
    return apiClient.put("/users/profile", userData);
  },

  async changePassword(currentPassword, newPassword) {
    return apiClient.post("/users/change-password", {
      currentPassword,
      newPassword,
    });
  },

  async deleteAccount(password) {
    return apiClient.post("/users/delete-account", { password });
  },

  async isAuthenticated() {
    const { accessToken } = await apiClient.getTokens();
    return !!accessToken;
  },
};

export default authService;
