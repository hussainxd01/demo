import { apiClient } from "../apiClient";

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const paymentService = {
  // Get Razorpay public key
  getConfig: async () => {
    const response = await apiClient.get("/payments/config");
    return response.data;
  },

  // Create a payment order
  createOrder: async (orderData) => {
    const response = await apiClient.post("/payments/create-order", orderData);
    return response.data;
  },

  // Verify payment after completion
  verifyPayment: async (paymentData) => {
    const response = await apiClient.post("/payments/verify", paymentData);
    return response.data;
  },

  // Handle payment failure
  handleFailure: async (failureData) => {
    const response = await apiClient.post("/payments/failure", failureData);
    return response.data;
  },

  // Initialize and open Razorpay checkout
  initiatePayment: async ({
    orderData,
    onSuccess,
    onFailure,
    onDismiss,
    userInfo,
  }) => {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error("Failed to load Razorpay SDK. Please check your internet connection.");
    }

    // Create order on backend
    const paymentOrder = await paymentService.createOrder(orderData);
    const { orderId, razorpayOrderId, amount, currency, keyId } = paymentOrder;

    // Configure Razorpay options
    const options = {
      key: keyId,
      amount: amount,
      currency: currency,
      name: "Ayurveda Store",
      description: "Order Payment",
      order_id: razorpayOrderId,
      prefill: {
        name: userInfo?.name || "",
        email: userInfo?.email || "",
        contact: userInfo?.phone || "",
      },
      theme: {
        color: "#16a34a", // Green theme matching the store
      },
      handler: async function (response) {
        try {
          // Verify payment on backend
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderId,
          };

          const result = await paymentService.verifyPayment(verificationData);
          if (onSuccess) onSuccess(result);
        } catch (error) {
          // Handle verification failure
          await paymentService.handleFailure({
            orderId: orderId,
            error: { description: "Payment verification failed" },
          });
          if (onFailure) onFailure(error);
        }
      },
      modal: {
        ondismiss: async function () {
          // User closed the payment modal without completing
          if (onDismiss) onDismiss();
        },
        escape: true,
        animation: true,
      },
    };

    // Open Razorpay checkout
    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", async function (response) {
      await paymentService.handleFailure({
        orderId: orderId,
        error: {
          code: response.error.code,
          description: response.error.description,
          reason: response.error.reason,
        },
      });
      if (onFailure) {
        onFailure(new Error(response.error.description || "Payment failed"));
      }
    });

    razorpay.open();

    return { orderId, razorpayOrderId };
  },
};

export default paymentService;
