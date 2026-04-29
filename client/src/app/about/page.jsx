"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { playfair } from "@/lib/fonts/font";
import Footer from "@/components/footer";

export default function About() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const values = [
    {
      title: "Curated Excellence",
      description:
        "We handpick every product in our collection to ensure the highest standards of quality and authenticity.",
    },
    {
      title: "Sustainable Beauty",
      description:
        "We're committed to supporting brands that prioritize ethical sourcing and environmentally conscious practices.",
    },
    {
      title: "Personal Touch",
      description:
        "Every customer interaction is an opportunity to build lasting relationships and provide exceptional service.",
    },
    {
      title: "Innovation First",
      description:
        "We continuously discover emerging brands and innovative products to bring you the latest in beauty and wellness.",
    },
  ];

  const milestones = [
    { year: "2020", event: "Charmsvilla Founded" },
    { year: "2021", event: "First Collection Launch" },
    { year: "2023", event: "50,000+ Happy Customers" },
    { year: "2024", event: "Expanded to Premium Beauty" },
    { year: "2026", event: "Global Expansion" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-96 md:h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`text-center px-4 transition-all duration-1000 transform ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1
              className={`text-4xl md:text-6xl lg:text-7xl font-light mb-4 text-gray-900`}
            >
              Our{" "}
              <span
                className={`${playfair.className} italic font-extralight skew-x-[-6deg] inline-block`}
              >
                Story
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Redefining luxury beauty, one curated collection at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 px-4 md:px-14 bg-white">
        <div className="max-w-5xl mx-auto">
          <div
            className={`transition-all duration-1000 delay-200 transform ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Content */}
              <div>
                <h2
                  className={`text-3xl md:text-4xl font-light mb-6 text-gray-900`}
                >
                  Who We{" "}
                  <span
                    className={`${playfair.className} italic font-extralight skew-x-[-6deg] inline-block`}
                  >
                    Are
                  </span>
                </h2>
                <p className="text-gray-600 text-base leading-relaxed mb-4">
                  Charmsvilla is more than just a beauty store—it's a curated
                  marketplace for luxury brands that celebrate individuality and
                  self-expression. Founded with the belief that beauty should be
                  accessible, authentic, and inspiring.
                </p>
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  We collaborate with premium brands from around the world to
                  bring you the finest in skincare, cosmetics, and wellness
                  products. Each item is selected not just for its quality, but
                  for the story it tells.
                </p>
                <Link
                  href="/products"
                  className="inline-block px-8 py-3 border border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-all duration-300"
                >
                  EXPLORE COLLECTION
                </Link>
              </div>

              {/* Image */}
              <div
                className={`relative h-96 md:h-full rounded overflow-hidden transition-all duration-1000 delay-300 ${
                  isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
              >
                <Image
                  src="/hola.png"
                  alt="Charmsvilla Collection"
                  fill
                  className="object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 px-4 md:px-14 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2
            className={`text-4xl md:text-5xl font-light text-center mb-16 text-gray-900`}
          >
            Our{" "}
            <span
              className={`${playfair.className} italic font-extralight skew-x-[-6deg] inline-block`}
            >
              Values
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {values.map((value, index) => (
              <div
                key={index}
                className={`p-8 md:p-10 bg-white transition-all duration-700 delay-${index * 100} transform hover:shadow-lg ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: `${400 + index * 100}ms`,
                }}
              >
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
                <div className="mt-4 h-0.5 w-12 bg-gray-300 hover:bg-gray-900 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24 px-4 md:px-14 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-4xl md:text-5xl font-light text-center mb-16 text-gray-900`}
          >
            Our{" "}
            <span
              className={`${playfair.className} italic font-extralight skew-x-[-6deg] inline-block`}
            >
              Journey
            </span>
          </h2>

          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex gap-8 pb-8 border-b border-gray-200 last:border-b-0 transition-all duration-700 transform ${
                  isLoaded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
                style={{
                  transitionDelay: `${500 + index * 100}ms`,
                }}
              >
                <div className="flex-shrink-0 w-32">
                  <span className="text-2xl font-light text-gray-900">
                    {milestone.year}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-700">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-14 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 delay-700 transform ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-5xl font-light mb-6">
              Join Our Community
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover the latest in luxury beauty and wellness. Sign up for
              exclusive access to new collections and special offers.
            </p>
            <Link
              href="/products"
              className="inline-block px-10 py-4 bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              START SHOPPING
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
