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
      <section className="relative w-full h-dvh md:h-screen overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          {/* Mobile */}
          <Image
            src="/hero-mobile.png"
            alt="Charm Villa Jewellery"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center md:hidden"
          />

          {/* Desktop */}
          <Image
            src="/hero-desktop.png"
            alt="Charm Villa Jewellery"
            fill
            priority
            sizes="100vw"
            className="hidden md:block object-cover object-center"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/35" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center md:items-center justify-center md:justify-start px-6 md:px-20 pt-16 md:pt-0">
          <div className="max-w-2xl text-center md:text-left">
            <p className="text-xs sm:text-sm md:text-base text-[#D6A37A] uppercase tracking-[0.3em] mb-4">
              ANTI-TARNISH JEWELLERY
            </p>

            <h1 className="leading-tight mb-6">
              <span className="block text-white text-4xl sm:text-5xl md:text-7xl font-medium">
                Timeless Shine.
              </span>

              <span
                className={`${playfair.className} italic font-light text-[#D6A37A] text-4xl sm:text-5xl md:text-7xl`}
              >
                Every Moment.
              </span>
            </h1>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-5 mb-8 text-white/80 uppercase text-xs tracking-wider">
              <span>Anti-Tarnish</span>
              <span>|</span>
              <span>Waterproof</span>
              <span>|</span>
              <span>Hypoallergenic</span>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#D6A37A] text-black font-medium rounded-full hover:scale-105 transition-all duration-300"
            >
              SHOP THE COLLECTION
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
