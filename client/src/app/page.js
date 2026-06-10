"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/products/ProductGrid";
import { getProducts } from "@/lib/api";
import JustArrived from "@/components/just-arrived";
import { playfair } from "@/lib/fonts/font";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[100svh] md:h-screen overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          {/* Mobile */}
          <Image
            src="/hero-mobile-v2.png"
            alt="Charm Villa Jewellery"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center md:hidden"
          />

          {/* Desktop */}
          <Image
            src="/hero-desktop-v2.png"
            alt="Charm Villa Jewellery"
            fill
            priority
            sizes="100vw"
            className="hidden md:block object-cover object-center"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <p className="text-white/70 text-xs uppercase tracking-[0.35em] mb-4">
              ANTI-TARNISH JEWELLERY
            </p>

            <h1
              className={`${playfair.className} text-white text-5xl sm:text-6xl md:text-8xl font-light leading-none mb-6`}
            >
              Find Your Forever Shine.
            </h1>

            <div className="flex flex-wrap justify-center gap-3 text-white/70 text-xs uppercase tracking-[0.2em] mb-8">
              <span>Waterproof</span>
              <span>•</span>
              <span>Hypoallergenic</span>
              <span>•</span>
              <span>Anti-Tarnish</span>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center border border-white/30 px-6 py-3 rounded-full text-white text-xs uppercase tracking-[0.2em] backdrop-blur-sm hover:bg-white hover:text-black transition-all"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section
        id="products"
        className="py-12 md:py-20 px-4 md:px-14 w-full mx-auto"
      >
        <div className="mb-14 flex items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Our Latest{" "}
            <span
              className={`${playfair.className} italic tracking-tight inline-block font-extralight skew-x-[-6deg] text-2xl sm:text-3xl md:text-4xl`}
            >
              Collection
            </span>
          </h2>
          <Link
            href="/products"
            className="text-gray-800 font-medium text-xs sm:text-sm flex gap-2 items-center whitespace-nowrap h-full justify-center"
          >
            <span className="hover:underline underline-offset-4">VIEW ALL</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 sm:size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>

        <ProductGrid products={products} isLoading={isLoading} />

        {/* View All Button */}
      </section>

      <CTASection />
      <section>
        <JustArrived />
      </section>

      {/* Footer */}

      <Footer />
    </>
  );
}
