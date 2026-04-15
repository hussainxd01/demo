'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function ProductsGrid({ products = [], totalProducts = 0 }) {
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    size: [],
    color: [],
    price: [],
  });

  const displayCount = Math.min(21, products.length);

  const handleFilterChange = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Navy', 'Cream', 'Gray'];
  const priceRanges = ['Under €50', '€50 - €100', '€100 - €200', 'Over €200'];

  // Mock products with discount badges
  const mockProducts = [
    {
      id: 1,
      name: 'White Cropped Gillet',
      price: '€54.95',
      image: 'https://images.unsplash.com/photo-1490481651971-dede28d63d7d?w=400&h=500&fit=crop',
      availability: 'Available in 5 size',
      discount: null,
    },
    {
      id: 2,
      name: 'Natural High Neck Top',
      price: '€47.95',
      image: 'https://images.unsplash.com/photo-1562183241-bd70a9c20923?w=400&h=500&fit=crop',
      availability: 'Available in 5 size',
      discount: null,
    },
    {
      id: 3,
      name: 'Ecru Polo Shirt with Zipper',
      price: '€44.95',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
      availability: 'Available in 5 size',
      discount: null,
    },
    {
      id: 4,
      name: 'White Satin Enchantment Bow Blouse',
      price: '€9.99',
      originalPrice: '€22.95',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop',
      availability: 'Available in 4 size',
      discount: '56% OFF',
    },
    ...products.slice(0, displayCount - 4),
  ];

  return (
    <section className="w-full bg-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          {/* Filters */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider hover:opacity-60 transition-opacity"
            >
              Filters
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Product Count */}
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{displayCount}</span> of{' '}
            <span className="font-semibold">{totalProducts || mockProducts.length}</span> products
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider hover:opacity-60 transition-opacity"
            >
              {sortBy === 'featured' ? 'Featured' : sortBy === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}
              <ChevronDown size={16} />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 animate-fade-in">
                <button
                  onClick={() => {
                    setSortBy('featured');
                    setIsSortOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm transition-colors border-b"
                >
                  Featured
                </button>
                <button
                  onClick={() => {
                    setSortBy('price-low');
                    setIsSortOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm transition-colors border-b"
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => {
                    setSortBy('price-high');
                    setIsSortOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm transition-colors"
                >
                  Price: High to Low
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Filters & Products */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`md:col-span-1 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="space-y-6">
              {/* Size Filter */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Size</h3>
                <div className="space-y-2">
                  {sizes.map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.size.includes(size)}
                        onChange={() => handleFilterChange('size', size)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Color</h3>
                <div className="space-y-2">
                  {colors.map((color) => (
                    <label key={color} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.color.includes(color)}
                        onChange={() => handleFilterChange('color', color)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Price</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.price.includes(range)}
                        onChange={() => handleFilterChange('price', range)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{range}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockProducts.slice(0, displayCount).map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div className="group cursor-pointer">
                    {/* Product Image */}
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Discount Badge */}
                      {product.discount && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-xs font-bold">
                          {product.discount}
                        </div>
                      )}
                      {/* Hover Overlay with Label */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>

                    {/* Product Info */}
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base font-semibold text-gray-900">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                      )}
                    </div>

                    {/* Availability */}
                    <p className="text-xs text-gray-600">{product.availability}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
