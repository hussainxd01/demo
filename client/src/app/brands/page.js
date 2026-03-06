"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getBrands } from "@/lib/api";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Failed to load brands:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrands();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 md:px-6 py-8 md:py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Our Brands
          </h1>
          <p className="text-gray-600 mt-4">
            Explore our curated selection of luxury skincare and beauty brands.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand}
                href={`/brand/${brand}`}
                className="p-6 md:p-8 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-center h-24 md:h-32 group"
              >
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors text-sm md:text-base break-words">
                    {brand}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
