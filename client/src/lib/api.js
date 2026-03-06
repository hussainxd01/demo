import { apiClient } from "@/lib/apiClient";

function buildSearchParams(params) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    sp.set(key, String(value));
  });
  return sp;
}

function unwrapData(response, fallback) {
  return response?.data ?? fallback;
}

/**
 * Get all products
 */
export async function getProducts({ page = 1, limit = 24, filters = {} } = {}) {
  const params = buildSearchParams({ page, limit, ...filters });
  const res = await apiClient.get(`/products?${params.toString()}`);
  return unwrapData(res, []);
}

/**
 * Get single product by ID
 */
export async function getProductById(id) {
  const res = await apiClient.get(`/products/${id}`);
  return unwrapData(res, null);
}

/**
 * Search products by query
 */
export async function searchProducts(query, { page = 1, limit = 12 } = {}) {
  if (!query?.trim()) return [];
  const params = buildSearchParams({ query: query.trim(), page, limit });
  const res = await apiClient.get(`/products/search?${params.toString()}`);
  return unwrapData(res, []);
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category) {
  return getProducts({ filters: { category } });
}

/**
 * Get products by brand
 */
export async function getProductsByBrand(brand) {
  return getProducts({ filters: { brand } });
}

/**
 * Get featured/popular products
 */
export async function getFeaturedProducts() {
  const res = await apiClient.get("/products/featured");
  return unwrapData(res, []);
}

/**
 * Get related products (same category or brand)
 */
export async function getRelatedProducts(productId, limit = 4) {
  const product = await getProductById(productId);
  if (!product) return [];

  const candidates = await getProducts({
    limit: Math.max(limit + 2, 8),
    filters: { category: product.category },
  });

  return candidates.filter((p) => p._id !== productId).slice(0, limit);
}

/**
 * Get all brands
 */
export async function getBrands() {
  const res = await apiClient.get("/products/brands");
  return unwrapData(res, { brands: [] })?.brands || [];
}
