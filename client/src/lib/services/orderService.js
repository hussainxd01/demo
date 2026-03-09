import { apiClient } from "@/lib/apiClient";

const orderService = {
  async createOrder(orderData) {
    const response = await apiClient.post("/orders", orderData);
    return response.data || response;
  },

  async getUserOrders(page = 1, limit = 10) {
    const params = new URLSearchParams({ page, limit });
    const response = await apiClient.get(
      `/orders/my-orders?${params.toString()}`,
    );
    return response.data || response;
  },

  async getOrderById(orderId) {
    const response = await apiClient.get(`/orders/${orderId}`);
    // Extract the data field if it exists, otherwise return the response as-is
    return response.data || response;
  },

  async cancelOrder(orderId) {
    const response = await apiClient.post(`/orders/${orderId}/cancel`, {});
    return response.data || response;
  },

  // Admin operations
  async getAllOrders(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters,
    });
    const response = await apiClient.get(
      `/orders/admin/all?${params.toString()}`,
    );
    return response.data || response;
  },

  async updateOrderStatus(orderId, status, notes = "") {
    const response = await apiClient.patch(`/orders/${orderId}/status`, {
      status,
      notes,
    });
    return response.data || response;
  },

  async updatePaymentStatus(orderId, paymentStatus) {
    const response = await apiClient.patch(`/orders/${orderId}/payment`, {
      paymentStatus,
    });
    return response.data || response;
  },

  async getOrderAnalytics() {
    const response = await apiClient.get("/orders/admin/analytics");
    return response.data || response;
  },
};

export default orderService;
