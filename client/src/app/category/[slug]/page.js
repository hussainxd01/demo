"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import SubcategoryPills from "@/components/products/SubcategoryPills";
import CategoryToolbar from "@/components/products/CategoryToolbar";
import FilterSidebar from "@/components/products/FilterSidebar";
import { getCategoryBySlug, getProductsWithFilters, getBrands } from "@/lib/api";
import { useShop } from "@/context/ShopContext";
import "./category-page.css";

export default function CategoryPage({ params }) {
  const { slug } = use(params);
  const { openCart } = useShop();
  
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [gridView, setGridView] = useState("large");
  const [sortValue, setSortValue] = useState("name-asc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    brands: [],
  });

  // Load category data
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const data = await getCategoryBySlug(slug);
        setCategory(data);
      } catch (error) {
        console.error("Failed to load category:", error);
      }
    };
    loadCategory();
  }, [slug]);

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

  // Load products when category or filters change
  useEffect(() => {
    const loadProducts = async () => {
      if (!category?._id) return;
      
      setIsLoading(true);
      try {
        const data = await getProductsWithFilters({
          category: category._id,
          brands: filters.brands.length > 0 ? filters.brands : undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          sort: sortValue,
          tags: selectedSubcategory ? [selectedSubcategory] : undefined,
        });
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [category?._id, filters, sortValue, selectedSubcategory]);

  // Filter products by subcategory (using tags)
  const filteredProducts = useMemo(() => {
    if (!selectedSubcategory) return products;
    return products.filter(
      (p) => p.tags && p.tags.some((tag) => 
        tag.toLowerCase() === selectedSubcategory.toLowerCase()
      )
    );
  }, [products, selectedSubcategory]);

  // Get hero image from first product
  const heroImage = products[0]?.images?.[0]?.url || null;

  // Grid products (exclude hero in large view)
  const gridProducts = gridView === "large" && heroImage 
    ? filteredProducts.slice(1) 
    : filteredProducts;

  const categoryName = category?.name || slug.replace(/-/g, " ").toUpperCase();

  return (
    <div className="category-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <div className="breadcrumb-container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span className="current">{categoryName}</span>
          </div>
        </div>
      </div>

      <div className="category-container">
        {/* Category Title */}
        <h1 className="category-title">{categoryName}</h1>

        {/* Subcategory Pills */}
        {category?.subcategories && category.subcategories.length > 0 && (
          <SubcategoryPills
            subcategories={category.subcategories}
            selectedSubcategory={selectedSubcategory}
            onSelect={setSelectedSubcategory}
          />
        )}

        {/* Toolbar */}
        <CategoryToolbar
          itemCount={filteredProducts.length}
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
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>No products found</p>
            {(filters.brands.length > 0 || filters.minPrice || filters.maxPrice) && (
              <button 
                className="clear-filters-btn"
                onClick={() => setFilters({ minPrice: "", maxPrice: "", brands: [] })}
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
          <div className={`products-grid ${gridView === "small" ? "small-grid" : ""}`}>
            {filteredProducts.map((product) => (
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
