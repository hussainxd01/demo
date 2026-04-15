'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    company: [
      { label: 'Search', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ],
    pages: [
      { label: 'FAQ', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Lookbook', href: '#' },
      { label: 'Collections', href: '#' },
    ],
    shop: [
      { label: 'Tops', href: '/products?category=tops' },
      { label: 'T-shirts', href: '/products?category=tshirts' },
      { label: 'Knitwear', href: '/products?category=knitwear' },
      { label: 'Dresses', href: '/products?category=dresses' },
      { label: 'Bottoms', href: '/products?category=bottoms' },
      { label: 'Jackets & Coats', href: '/products?category=jackets' },
    ],
  };

  const socialLinks = [
    { name: 'Instagram', href: '#', icon: 'i' },
    { name: 'YouTube', href: '#', icon: 'Y' },
    { name: 'TikTok', href: '#', icon: 'T' },
    { name: 'Twitter', href: '#', icon: 'X' },
    { name: 'Vimeo', href: '#', icon: 'V' },
  ];

  const paymentMethods = [
    { name: 'American Express', icon: 'A' },
    { name: 'Diners Club', icon: 'D' },
    { name: 'Discover', icon: 'D' },
    { name: 'Google Pay', icon: 'G' },
    { name: 'Mastercard', icon: 'M' },
    { name: 'PayPal', icon: 'P' },
    { name: 'Shop Pay', icon: 'S' },
    { name: 'Visa', icon: 'V' },
  ];

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          {/* Newsletter Section */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-400">Newsletter</h3>
            <p className="text-sm mb-6 text-gray-300">Sign up to receive 10% off your first order</p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-white text-black placeholder-gray-500 text-sm rounded-l"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded-r hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-green-400 mt-2">Thank you for subscribing!</p>
            )}
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-gray-400">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-gray-400">Pages</h3>
            <ul className="space-y-3">
              {footerLinks.pages.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-gray-400">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-12" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Logo & Description */}
          <div className="flex-1">
            <h2 className="text-3xl font-light mb-4">release</h2>
            <p className="text-xs text-gray-400">
              Release is a premium official Shopify theme designed by DigiFist.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider"
                title={link.name}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-12" />

        {/* Payment Methods & Copyright */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Copyright */}
          <p className="text-xs text-gray-500">
            Copyright © 2026 Release. All rights reserved. Powered by Shopify.
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3 flex-wrap">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-xs font-semibold text-gray-400 border border-gray-700"
                title={method.name}
              >
                {method.icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
