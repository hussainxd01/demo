"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import CategoryToolbar from "@/components/products/CategoryToolbar";
import FilterSidebar from "@/components/products/FilterSidebar";
import { getProductsWithFilters, getCategories, getBrands } from "@/lib/api";
import { useShop } from "@/context/ShopContext";
import "./products-page.css";

export default function ProductsPage() {
  const { openCart } = useShop();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gridView, setGridView] = useState("large");
  const [sortValue, setSortValue] = useState("name-asc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    brands: [],
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Load brands
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brands = await getBrands();
        setAllBrands(brands);
      } catch (error) {
        console.error("Failed to load brands:", error);
      }
    };
    loadBrands();
  }, []);

  // Load products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProductsWithFilters({
          category: selectedCategory || undefined,
          brands: filters.brands.length > 0 ? filters.brands : undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          sort: sortValue,
        });
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, filters, sortValue]);

  // Get hero image from first product
  const heroImage = products[0]?.images?.[0]?.url || null;

  // Grid products (exclude hero in large view)
  const gridProducts = gridView === "large" && heroImage 
    ? products.slice(1) 
    : products;

  return (
    <div className="products-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <div className="breadcrumb-container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span className="current">All Products</span>
          </div>
        </div>
      </div>

      <div className="products-container">
        {/* Page Title */}
        <h1 className="page-title">All Products</h1>

        {/* Category Pills */}
        <div className="category-pills">
          <button
            className={`pill ${!selectedCategory ? "active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`pill ${selectedCategory === cat._id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat._id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <CategoryToolbar
          itemCount={products.length}
          gridView={gridView}
          onGridViewChange={setGridView}
          sortValue={sortValue}
          onSortChange={setSortValue}
          onFilterClick={() => setIsFilterOpen(true)}
        />

        {/* Products */}
        {isLoading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="loading-card">
                <div className="loading-image" />
                <div className="loading-text" />
                <div className="loading-text short" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products found</p>
            {(filters.brands.length > 0 || filters.minPrice || filters.maxPrice || selectedCategory) && (
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setFilters({ minPrice: "", maxPrice: "", brands: [] });
                  setSelectedCategory(null);
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : gridView === "large" && heroImage ? (
          <div className="featured-layout">
            {/* Hero Image - First Product */}
            <div className="hero-product">
              <Link href={`/product/${products[0]._id || products[0].id}`}>
                <img
                  src={heroImage}
                  alt={products[0]?.name || "Featured product"}
                  crossOrigin="anonymous"
                />
              </Link>
            </div>
            {/* Rest of Products */}
            <div className="featured-grid">
              {gridProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onAddClick={openCart}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className={`all-products-grid ${gridView === "small" ? "small-grid" : ""}`}>
            {products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onAddClick={openCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        brands={allBrands}
      />
    </div>
  );
}
