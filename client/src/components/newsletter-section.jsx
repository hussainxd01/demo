"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    setEmail("");
  };

  return (
    <section className="py-16 px-4 md:px-6 bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay in the Loop
        </h2>
        <p className="text-gray-300 mb-8">
          Get exclusive offers and new product launches delivered to your inbox.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-2"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
  );
}
