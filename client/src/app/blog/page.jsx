"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { playfair } from "@/lib/fonts/font";
import { Calendar, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Art of Skincare: Finding Your Perfect Routine",
    excerpt:
      "Discover how to build a skincare routine tailored to your skin type and concerns. We break down the essentials every beauty lover should know.",
    date: "Apr 15, 2026",
    category: "Skincare",
    readTime: "5 min read",
    slug: "skincare-routine-guide",
    image: "/hola.png",
  },
  {
    id: 2,
    title: "Sustainable Beauty: Brands Making a Difference",
    excerpt:
      "Explore the premium brands leading the charge in sustainable beauty practices. Learn how conscious choices can elevate your beauty collection.",
    date: "Apr 10, 2026",
    category: "Sustainability",
    readTime: "7 min read",
    slug: "sustainable-beauty-brands",
    image: "/hola.png",
  },
  {
    id: 3,
    title: "Luxury Beauty Trends for 2026",
    excerpt:
      "Stay ahead of the curve with the latest trends in luxury cosmetics and skincare. From minimalist aesthetics to innovative formulations.",
    date: "Apr 5, 2026",
    category: "Trends",
    readTime: "6 min read",
    slug: "luxury-beauty-trends-2026",
    image: "/hola.png",
  },
  {
    id: 4,
    title: "How to Layer Skincare Products Like a Pro",
    excerpt:
      "Master the art of product layering to maximize efficacy. We guide you through the science behind proper skincare sequencing.",
    date: "Mar 28, 2026",
    category: "Skincare",
    readTime: "5 min read",
    slug: "skincare-layering-guide",
    image: "/hola.png",
  },
  {
    id: 5,
    title: "The Psychology of Fragrance: Choose Your Signature Scent",
    excerpt:
      "Understand how fragrance influences mood and perception. Find your perfect signature scent with our comprehensive guide.",
    date: "Mar 20, 2026",
    category: "Fragrance",
    readTime: "6 min read",
    slug: "signature-fragrance-guide",
    image: "/hola.png",
  },
  {
    id: 6,
    title: "Minimalist Beauty: Less is More",
    excerpt:
      "Embrace the minimalist approach to beauty. We show you how to achieve a radiant look with fewer, high-quality products.",
    date: "Mar 15, 2026",
    category: "Lifestyle",
    readTime: "4 min read",
    slug: "minimalist-beauty",
    image: "/hola.png",
  },
];

export default function Blog() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(
        blogPosts.filter((post) => post.category === selectedCategory),
      );
    }
  }, [selectedCategory]);

  const categories = [
    "All",
    ...new Set(blogPosts.map((post) => post.category)),
  ];

  return (
    <section className="py-16 md:py-24 px-4 md:px-14 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className={`mb-12 md:mb-16 transition-all duration-1000 transform ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className={`text-4xl md:text-5xl font-light text-gray-900 mb-4`}>
            Charmsvilla{" "}
            <span
              className={`${playfair.className} italic font-extralight skew-x-[-6deg] inline-block`}
            >
              Journal
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Explore insights, trends, and expert tips on luxury beauty, skincare
            routines, and sustainable practices that inspire us daily.
          </p>
        </div>

        {/* Category Filter */}
        <div
          className={`mb-12 flex flex-wrap gap-3 transition-all duration-1000 delay-100 transform ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 text-sm font-medium transition-all duration-300 border ${
                selectedCategory === category
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-800 border-gray-200 hover:border-gray-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredPosts.map((post, index) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article
                className={`group cursor-pointer transition-all duration-700 transform hover:-translate-y-2 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: `${200 + index * 50}ms`,
                }}
              >
                {/* Image */}
                <div className="mb-6 overflow-hidden bg-gray-100 rounded h-64 md:h-72">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Category & Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {post.date}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`text-xl md:text-2xl font-light text-gray-900 mb-3 group-hover:text-gray-600 transition-colors duration-300 leading-snug`}
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                  <ArrowRight
                    size={16}
                    className="text-gray-800 group-hover:translate-x-1 transition-transform duration-300"
                  />
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No articles found in this category.
            </p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div
          className={`mt-16 md:mt-20 p-8 md:p-12 bg-gray-50 rounded transition-all duration-1000 delay-300 transform ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-gray-600 mb-6">
              Get the latest articles, tips, and exclusive offers delivered to
              your inbox.
            </p>
            <form className="flex flex-col md:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-900 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors duration-300"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
