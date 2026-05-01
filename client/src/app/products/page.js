"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import CategoryToolbar from "@/components/products/CategoryToolbar";
import FilterSidebar from "@/components/products/FilterSidebar";
import { getProductsWithFilters, getCategories, getBrands } from "@/lib/api";
import { useShop } from "@/context/ShopContext";

export default function ProductsPage() {
  const { openCart } = useShop();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortValue, setSortValue] = useState("name-asc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    brands: [],
  });

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

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.minPrice ||
    filters.maxPrice ||
    selectedCategory;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200 py-4">
        <div className="w-full  px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-[13px] text-neutral-500">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">All Products</span>
          </nav>
        </div>
      </div>

      <div className="w-full  px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Title */}
        <h1 className="text-2xl sm:text-[32px] font-normal text-neutral-900 tracking-tight mb-4 sm:mb-6">
          All Products
        </h1>

        {/* Category Pills — horizontal scroll on mobile */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
          <button
            className={`px-4 py-2 sm:px-5 sm:py-2.5 border text-[13px] sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
              !selectedCategory
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-transparent text-neutral-800 border-neutral-800 hover:bg-neutral-100"
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 border text-[13px] sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedCategory === cat._id
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-transparent text-neutral-800 border-neutral-800 hover:bg-neutral-100"
              }`}
              onClick={() => setSelectedCategory(cat._id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <CategoryToolbar
          itemCount={products.length}
          sortValue={sortValue}
          onSortChange={setSortValue}
          onFilterClick={() => setIsFilterOpen(true)}
        />

        {/* Products — mobile-first: 2 cols → 3 (md) → 4 (lg) */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-neutral-100 rounded mb-3" />
                <div className="h-3 bg-neutral-100 rounded mb-2" />
                <div className="h-3 bg-neutral-100 rounded w-3/5" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">
            <p className="mb-4 text-base">No products found</p>
            {hasActiveFilters && (
              <button
                className="px-6 py-2.5 bg-neutral-900 text-white text-sm hover:bg-neutral-700 transition-colors rounded"
                onClick={() => {
                  setFilters({ minPrice: "", maxPrice: "", brands: [] });
                  setSelectedCategory(null);
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
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
