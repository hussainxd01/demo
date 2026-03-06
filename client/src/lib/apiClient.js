function normalizeApiBaseUrl(url) {
  if (!url) return "http://localhost:5000/api/v1";
  const trimmed = url.replace(/\/+$/, "");

  // If user provided full prefix already, keep it.
  if (/\/api\/v1($|\/)/.test(trimmed)) return trimmed;

  // Common misconfig from docs: ".../api" instead of ".../api/v1"
  if (/\/api$/.test(trimmed)) return `${trimmed}/v1`;

  // If they provided just host (or anything without /api), assume /api/v1.
  if (!/\/api(\/|$)/.test(trimmed)) return `${trimmed}/api/v1`;

  // If it includes /api but not /api/v1 (custom setups), leave it as-is.
  return trimmed;
}

const API_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

class APIClient {
  constructor() {
    this.baseURL = API_URL;
    this.timeout = 30000;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  async getTokens() {
    if (typeof window === "undefined")
      return { accessToken: null, refreshToken: null };
    return {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  }

  async setTokens(accessToken, refreshToken) {
    if (typeof window === "undefined") return;
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  }

  async clearTokens() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  async refreshAccessToken() {
    const { refreshToken } = await this.getTokens();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      await this.clearTokens();
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    await this.setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  }

  async request(endpoint, options = {}) {
    const {
      method = "GET",
      body,
      headers: customHeaders = {},
      retry = true,
    } = options;

    const { accessToken } = await this.getTokens();

    const headers = {
      "Content-Type": "application/json",
      ...customHeaders,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };

    const config = {
      method,
      headers,
      timeout: this.timeout,
    };

    if (body) {
      config.body = body instanceof FormData ? body : JSON.stringify(body);
      if (body instanceof FormData) delete config.headers["Content-Type"];
    }

    let lastError;
    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const response = await Promise.race([
          fetch(`${this.baseURL}${endpoint}`, config),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Request timeout")),
              this.timeout,
            ),
          ),
        ]);

        if (response.status === 401 && retry && accessToken) {
          try {
            const newToken = await this.refreshAccessToken();
            headers.Authorization = `Bearer ${newToken}`;
            return this.request(endpoint, { ...options, retry: false });
          } catch (error) {
            throw new Error("Authentication failed");
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new APIError(
            errorData.message || `HTTP ${response.status}`,
            response.status,
            errorData,
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error;
        if (
          error instanceof APIError &&
          error.status < 500 &&
          error.status !== 408
        ) {
          throw error;
        }
        if (attempt < this.retryAttempts - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.retryDelay * Math.pow(2, attempt)),
          );
        }
      }
    }

    throw lastError;
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "POST", body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "PUT", body });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "PATCH", body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

class APIError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "APIError";
  }
}

export const apiClient = new APIClient();
export { APIError };
