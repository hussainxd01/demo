"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { getProducts } from "@/lib/api";
import { playfair } from "@/lib/fonts/font";
const CARD_WIDTH = 260;
const PRODUCTS_LIMIT = 10;

export default function JustArrived() {
  const { addToCart, openCart } = useShop();
  const scrollRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [addingId, setAddingId] = useState(null);

  // ── Fetch newest products ─────────────────────────────
  useEffect(() => {
    async function fetchNew() {
      try {
        const data = await getProducts({
          limit: PRODUCTS_LIMIT,
          filters: { sort: "-createdAt" },
        });
        setProducts(data || []);
      } catch (err) {
        console.error("JustArrived fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNew();
  }, []);

  // ── Scroll helpers ────────────────────────────────────
  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    updateScrollState();
  }, [products]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * CARD_WIDTH * 2, behavior: "smooth" });
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    const id = product._id || product.id;
    setAddingId(id);
    await addToCart(product, 1);
    openCart();
    setAddingId(null);
  };

  // ── Loading Skeleton ──────────────────────────────────
  if (isLoading) {
    return (
      <section className="py-12 px-4 md:px-10">
        <div className="flex items-end justify-between mb-8">
          <div className="h-8 w-40 bg-gray-100 animate-pulse rounded-sm" />
          <div className="h-4 w-16 bg-gray-100 animate-pulse rounded-sm" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-none w-[260px] animate-pulse">
              <div
                className="w-full bg-gray-100 rounded-sm"
                style={{ aspectRatio: "3/4" }}
              />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full bg-gray-100 rounded-sm" />
                <div className="h-3 w-20 bg-gray-100 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="py-12 px-4 md:px-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
          Just{" "}
          <span
            className={`${playfair.className} italic  tracking-tight inline-block font-extralight skew-x-[-6deg]`}
          >
            Arrived
          </span>
        </h2>

        <div className="flex items-center gap-6">
          <Link
            href="/shop?sort=-createdAt"
            className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-800 underline underline-offset-4 decoration-gray-400 hover:decoration-gray-800 transition-all"
          >
            View all
          </Link>

          {/* Arrows */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              className={`w-8 h-8 flex items-center justify-center border transition-all ${
                canScrollLeft
                  ? "border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
                  : "border-gray-200 text-gray-300 cursor-default"
              }`}
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>

            <button
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              className={`w-8 h-8 flex items-center justify-center border transition-all ${
                canScrollRight
                  ? "border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
                  : "border-gray-200 text-gray-300 cursor-default"
              }`}
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* SCROLL CONTAINER (KEY PART) */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {products.map((product) => {
          const id = product._id || product.id;
          const image =
            product.images?.[0]?.url || product.image || "/placeholder.jpg";
          const isAdding = addingId === id;

          return (
            <Link
              key={id}
              href={`/product/${id}`}
              className="group flex-none w-[50%] md:w-[25%] snap-start"
            >
              {/* Image */}
              <div
                className="relative w-full bg-[#f0eeeb] overflow-hidden"
                style={{ aspectRatio: "3/4" }}
              >
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  sizes="260px"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />

                {/* ORIGINAL BUTTON */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="absolute bottom-3 right-3 w-9 h-9 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-sm hover:bg-gray-900 hover:text-white"
                >
                  {isAdding ? (
                    <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus size={16} strokeWidth={1.5} />
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="mt-3 px-0.5">
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-900 line-clamp-2 leading-snug">
                  {product.name}
                </h3>
                <p className="mt-1 text-[13px] text-gray-700">
                  Rs.{" "}
                  {Number(product.price || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
