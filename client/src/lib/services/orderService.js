import { apiClient } from "@/lib/apiClient";

const orderService = {
  async createOrder(orderData) {
    return apiClient.post("/orders", orderData);
  },

  async getUserOrders(page = 1, limit = 10) {
    const params = new URLSearchParams({ page, limit });
    return apiClient.get(`/orders/my-orders?${params.toString()}`);
  },

  async getOrderById(orderId) {
    return apiClient.get(`/orders/${orderId}`);
  },

  async cancelOrder(orderId) {
    return apiClient.post(`/orders/${orderId}/cancel`, {});
  },

  // Admin operations
  async getAllOrders(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters,
    });
    return apiClient.get(`/orders/admin/all?${params.toString()}`);
  },

  async updateOrderStatus(orderId, status, notes = "") {
    return apiClient.patch(`/orders/${orderId}/status`, { status, notes });
  },

  async updatePaymentStatus(orderId, paymentStatus) {
    return apiClient.patch(`/orders/${orderId}/payment`, { paymentStatus });
  },

  async getOrderAnalytics() {
    return apiClient.get("/orders/admin/analytics");
  },
};

export default orderService;
