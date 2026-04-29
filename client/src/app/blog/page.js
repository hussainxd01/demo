import React from "react";
import Blog from "@/components/blog";
import Footer from "@/components/footer";

export const metadata = {
  title: "Charmsvilla Journal | Beauty Tips, Skincare & Trends",
  description:
    "Explore expert articles on luxury beauty, skincare routines, sustainable practices, and the latest trends in the beauty industry.",
  keywords:
    "luxury beauty, skincare tips, beauty trends, sustainable beauty, fragrance guide, cosmetics",
  openGraph: {
    title: "Charmsvilla Journal | Beauty Tips & Expert Insights",
    description:
      "Discover in-depth articles on beauty, wellness, and luxury skincare trends from the Charmsvilla team.",
    type: "website",
    url: "https://charmsvilla.com/blog",
    siteName: "Charmsvilla",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPage() {
  return (
    <>
      <Blog />
      <Footer />
    </>
  );
}
