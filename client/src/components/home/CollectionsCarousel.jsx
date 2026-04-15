'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CollectionsCarousel() {
  const scrollRef = useRef(null);

  const collections = [
    {
      id: 1,
      name: 'Tops',
      count: 10,
      image: 'https://images.unsplash.com/photo-1508315849307-c2b37b611aff?w=600&h=700&fit=crop',
    },
    {
      id: 2,
      name: 'Accessories',
      count: 22,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=700&fit=crop',
    },
    {
      id: 3,
      name: 'Bottoms',
      count: 15,
      image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=600&h=700&fit=crop',
    },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full bg-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-light mb-8 md:mb-0">
            Our <span className="italic">special collections</span>
          </h2>
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="text-sm font-semibold uppercase tracking-widest border-b-2 border-black pb-2 hover:opacity-60 transition-opacity"
            >
              Explore All
            </Link>
            <button
              onClick={() => scroll('left')}
              className="p-2 hover:bg-gray-100 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 hover:bg-gray-100 transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Collections Grid */}
        <div
          ref={scrollRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-x-auto scrollbar-hide md:overflow-visible"
          style={{
            scrollBehavior: 'smooth',
          }}
        >
          {collections.map((collection) => (
            <Link key={collection.id} href={`/products?category=${collection.name.toLowerCase()}`}>
              <div className="flex-shrink-0 w-full cursor-pointer group">
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl md:text-3xl font-light">
                    {collection.name}
                    <span className="text-lg text-gray-600 ml-2">{collection.count}</span>
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
