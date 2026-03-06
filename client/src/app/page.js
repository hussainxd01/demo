"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductGrid from "@/components/products/ProductGrid";
import { getProducts } from "@/lib/api";

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
      <section className="relative w-full h-96 md:h-screen bg-gradient-to-b from-gray-100 to-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&h=800&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-2xl">
            <p className="text-sm md:text-base text-gray-600 uppercase tracking-widest mb-4">
              UPNEXT
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                On the Horizon
              </span>
            </h1>
            <Link
              href="#products"
              className="inline-block px-8 py-3 md:py-4 bg-white text-gray-800 font-semibold rounded hover:bg-gray-100 transition-colors"
            >
              VIEW COLLECTION
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Why Be Yours?
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {/* Feature Cards */}
          {[
            {
              icon: "🍃",
              title: "Clean Skincare",
              desc: "Clean and natural skincare with safe and transparent ingredients",
            },
            {
              icon: "🌍",
              title: "European Made",
              desc: "Fast delivery options, tracking your order and more.",
            },
            {
              icon: "✓",
              title: "Luxury Quality",
              desc: "Premium formulations crafted with the finest ingredients.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 md:p-8 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <p className="text-3xl mb-3">{feature.icon}</p>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
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

      {/* Newsletter Section */}
      <section className="py-16 px-4 md:px-6 bg-gray-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-gray-300 mb-8">
            Get exclusive offers and new product launches delivered to your
            inbox.
          </p>
          <form className="flex flex-col md:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded text-gray-900 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-yellow-300 text-gray-900 font-semibold rounded hover:bg-yellow-400 transition-colors"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
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
