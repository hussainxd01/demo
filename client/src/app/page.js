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
      <section className="relative w-full h-dvh md:h-screen  overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hola.png"
            alt="Beyond Horizon Showcase"
            fill
            sizes="100vw"
            priority
            className="object-cover object-[center_top] md:object-[center_20%]"
          />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm md:text-base text-white uppercase tracking-widest mb-4">
              UPNEXT 2026
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight">
              <span className="text-white">
                On the{" "}
                <span
                  className={`${playfair.className} italic  tracking-tight inline-block font-extralight skew-x-[-6deg]`}
                >
                  Horizon
                </span>
              </span>
            </h1>
            <Link
              href="/products"
              className="inline-block px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-transparent border-white border text-white font-semibold rounded-full hover:bg-gray-100 hover:text-gray-900 transition-colors text-xs sm:text-sm"
            >
              VIEW COLLECTION
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
