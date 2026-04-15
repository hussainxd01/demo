'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="w-full h-screen flex items-stretch overflow-hidden">
      {/* Left Side - Dark Hero */}
      <div className="hidden md:flex w-1/2 bg-gray-900 items-center justify-center relative overflow-hidden group">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1539533057440-7bf6b1c32e64?w=800&h=1000&fit=crop"
            alt="Tailored Motion"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-8 max-w-sm">
          <h2 className="text-5xl md:text-6xl font-light mb-8 leading-tight">
            Tailored Motion: Style That Moves with You
          </h2>
          <Link
            href="/products"
            className="inline-block border-2 border-white text-white px-8 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
          >
            Discover Now
          </Link>
        </div>
      </div>

      {/* Right Side - Light Hero (or Full width on mobile) */}
      <div className="w-full md:w-1/2 bg-gray-50 items-center justify-center relative overflow-hidden group flex">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=1000&fit=crop"
            alt="Fashion Collection"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
          {/* Light overlay */}
          <div className="absolute inset-0 bg-white/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-8 max-w-sm">
          <p className="text-sm text-gray-600 uppercase tracking-widest mb-4">New Collection</p>
          <h2 className="text-5xl md:text-6xl font-light mb-8 leading-tight text-black">
            Elevate Your Wardrobe
          </h2>
          <Link
            href="/products"
            className="inline-block border-2 border-black text-black px-8 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
