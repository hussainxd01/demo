'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function JustArrivedSection() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const products = [
    {
      id: 1,
      name: 'Black Puffer Edge',
      price: '€90.00',
      image: 'https://images.unsplash.com/photo-1539533057440-7bf6b1c32e64?w=400&h=500&fit=crop',
      availability: 'Available in 1 title',
    },
    {
      id: 2,
      name: 'Black Blazer Dress',
      price: '€65.95',
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop',
      availability: 'Available in 5 size',
    },
    {
      id: 3,
      name: 'Black High-Waist Jeans',
      price: '€49.95',
      image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=500&fit=crop',
      availability: 'Available in 8 taille',
    },
    {
      id: 4,
      name: 'Black Puffer Jacket',
      price: '€69.95',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=500&fit=crop',
      availability: 'Available in 4 size and 2 color',
    },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      checkScroll();
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
      );
    }
  };

  React.useEffect(() => {
    checkScroll();
    const current = scrollRef.current;
    if (current) {
      current.addEventListener('scroll', checkScroll);
      return () => current.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <section className="w-full bg-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-light mb-8 md:mb-0">Just arrived</h2>
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="text-sm font-semibold uppercase tracking-widest border-b-2 border-black pb-2 hover:opacity-60 transition-opacity"
            >
              View All
            </Link>
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 transition-colors ${
                canScrollLeft ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-30 cursor-not-allowed'
              }`}
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 transition-colors ${
                canScrollRight ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-30 cursor-not-allowed'
              }`}
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Product Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative group">
                  {/* Image Container */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Quick Add Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                    >
                      <div className="bg-black text-white p-3 rounded-full hover:scale-110 transition-transform">
                        <Plus size={24} />
                      </div>
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-lg font-medium text-gray-900 mb-2">{product.price}</p>
                    <p className="text-sm text-gray-600">{product.availability}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
