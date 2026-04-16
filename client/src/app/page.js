"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/products/ProductGrid";
import { getProducts } from "@/lib/api";
import JustArrived from "@/components/just-arrived";
import { playfair } from "@/lib/fonts/font";

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
            alt="Charmsvilla Horizon Showcase"
            fill
            sizes="100vw"
            priority
            className="object-cover object-[center_top] md:object-[center_20%]"
          />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-2xl">
            <p className="text-sm md:text-base text-white uppercase tracking-widest mb-4">
              UPNEXT 2026
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight">
              <span className="text-white">
                On the{" "}
                <span
                  className={`${playfair.className} italic lowercase tracking-tight inline-block font-extralight skew-x-[-6deg]`}
                >
                  horizon
                </span>
              </span>
            </h1>
            <Link
              href="/products"
              className="inline-block px-8 py-3 md:py-4 bg-transparent border-white border  text-white font-semibold rounded-full hover:bg-gray-100 hover:text-gray-900 transition-colors text-sm"
            >
              VIEW COLLECTION
            </Link>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section
        id="products"
        className="py-12 md:py-20 px-4 md:px-6 max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Glow With Confidence
          </h2>
          <p className="text-gray-600 mt-2 text-lg">Nourish Naturally</p>
        </div>

        <ProductGrid products={products} isLoading={isLoading} />

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block px-8 py-3 border-2 border-gray-800 text-gray-800 font-semibold rounded hover:bg-gray-800 hover:text-white transition-colors"
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </section>
      <section>
        <JustArrived />
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">SHOP</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/skincare"
                  className="hover:text-gray-900 transition-colors"
                >
                  Skincare
                </Link>
              </li>
              <li>
                <Link
                  href="/body-care"
                  className="hover:text-gray-900 transition-colors"
                >
                  Body Care
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="hover:text-gray-900 transition-colors"
                >
                  All Brands
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">HELP</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-gray-900 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-gray-900 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-gray-900 transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">ABOUT</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/about"
                  className="hover:text-gray-900 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="hover:text-gray-900 transition-colors"
                >
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">FOLLOW</h4>
            <div className="flex gap-4 text-sm">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pinterest
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 Luxury Beauty Store. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
