// API utility functions - Replace with actual API calls
// This layer makes it easy to swap mock data for real backend

import { PRODUCTS, BRANDS } from "./products";

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all products
 * Replace with: const res = await fetch(`${API_URL}/products`);
 */
export async function getProducts() {
  await delay(300);
  return PRODUCTS;
}

/**
 * Get single product by ID
 * Replace with: const res = await fetch(`${API_URL}/products/${id}`);
 */
export async function getProductById(id) {
  await delay(200);
  return PRODUCTS.find((p) => p.id === parseInt(id));
}

/**
 * Search products by query
 * Replace with: const res = await fetch(`${API_URL}/products/search?q=${query}`);
 */
export async function searchProducts(query) {
  await delay(250);
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get products by category
 * Replace with: const res = await fetch(`${API_URL}/products/category/${category}`);
 */
export async function getProductsByCategory(category) {
  await delay(200);
  return PRODUCTS.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase(),
  );
}

/**
 * Get products by brand
 * Replace with: const res = await fetch(`${API_URL}/products/brand/${brand}`);
 */
export async function getProductsByBrand(brand) {
  await delay(200);
  return PRODUCTS.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
}

/**
 * Get featured/popular products
 * Replace with: const res = await fetch(`${API_URL}/products/featured`);
 */
export async function getFeaturedProducts(limit = 6) {
  await delay(300);
  return PRODUCTS.slice(0, limit);
}

/**
 * Get related products (same category or brand)
 * Replace with: const res = await fetch(`${API_URL}/products/${id}/related`);
 */
export async function getRelatedProducts(productId, limit = 4) {
  await delay(200);
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return [];

  return PRODUCTS.filter(
    (p) =>
      p.id !== productId &&
      (p.category === product.category || p.brand === product.brand),
  ).slice(0, limit);
}

/**
 * Get all brands
 * Replace with: const res = await fetch(`${API_URL}/brands`);
 */
export async function getBrands() {
  await delay(150);
  return BRANDS;
}

// These are placeholder functions for future implementation
// Uncomment and update when you have a real backend

/*
export async function addToCart(productId, quantity) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  });
  return res.json();
}

export async function createOrder(cartItems) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cartItems }),
  });
  return res.json();
}
*/
