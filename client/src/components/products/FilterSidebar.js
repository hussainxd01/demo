"use client";

import { useState, useEffect } from "react";
import "./FilterSidebar.css";

export default function FilterSidebar({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  brands = [],
  priceRange = { min: 0, max: 1000 },
}) {
  const [localFilters, setLocalFilters] = useState({
    minPrice: filters.minPrice || "",
    maxPrice: filters.maxPrice || "",
    brands: filters.brands || [],
  });

  useEffect(() => {
    setLocalFilters({
      minPrice: filters.minPrice || "",
      maxPrice: filters.maxPrice || "",
      brands: filters.brands || [],
    });
  }, [filters]);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBrandToggle = (brand) => {
    setLocalFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      minPrice: "",
      maxPrice: "",
      brands: [],
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    localFilters.minPrice ||
    localFilters.maxPrice ||
    localFilters.brands.length > 0;

  return (
    <>
      {/* Overlay */}
      <div
        className={`filter-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`filter-sidebar ${isOpen ? "open" : ""}`}>
        <div className="filter-header">
          <h2>Filters</h2>
          <button
            className="filter-close"
            onClick={onClose}
            aria-label="Close filters"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="filter-content">
          {/* Price Range */}
          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <div className="price-input-group">
                <label htmlFor="minPrice">Min</label>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  placeholder={`$${priceRange.min}`}
                  value={localFilters.minPrice}
                  onChange={handlePriceChange}
                  min={0}
                />
              </div>
              <span className="price-separator">-</span>
              <div className="price-input-group">
                <label htmlFor="maxPrice">Max</label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  placeholder={`$${priceRange.max}`}
                  value={localFilters.maxPrice}
                  onChange={handlePriceChange}
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* Brands */}
          {brands.length > 0 && (
            <div className="filter-section">
              <h3>Brands</h3>
              <div className="brand-list">
                {brands.map((brand) => (
                  <label key={brand} className="brand-checkbox">
                    <input
                      type="checkbox"
                      checked={localFilters.brands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                    />
                    <span className="checkmark" />
                    <span className="brand-name">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="filter-footer">
          {hasActiveFilters && (
            <button className="filter-clear" onClick={handleClear}>
              Clear All
            </button>
          )}
          <button className="filter-apply" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
