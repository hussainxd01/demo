'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import CollectionsCarousel from '@/components/home/CollectionsCarousel';
import JustArrivedSection from '@/components/home/JustArrivedSection';
import ProductsGrid from '@/components/home/ProductsGrid';
import { getProducts } from '@/lib/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Collections Carousel */}
      <CollectionsCarousel />

      {/* Just Arrived Section */}
      <JustArrivedSection />

      {/* Featured Products Grid */}
      <ProductsGrid products={products} totalProducts={products.length} />
    </>
  );
}
