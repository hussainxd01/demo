'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Search, Heart, ShoppingCart, LogOut, ChevronDown, X } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { useAuth } from '@/context/AuthContext';
import UserIcon from '@/components/common/UserIcon';

export default function Navbar() {
  const { openSearch, cart, favorites } = useShop();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'HOME', href: '/' },
    { label: 'SHOP', href: '/products', submenu: [{ label: 'All Products', href: '/products' }] },
    { label: 'PAGES', href: '#', submenu: [{ label: 'About', href: '#' }, { label: 'Contact', href: '#' }] },
    { label: 'PRODUCT FEATURES', href: '#', submenu: [] },
    { label: 'CONTACT', href: '#' },
  ];

  const toggleMobileSubmenu = (menu) => {
    setExpandedMobileMenu(expandedMobileMenu === menu ? null : menu);
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="hidden md:block bg-black text-white text-center py-2 text-xs font-medium tracking-wider">
        NEW PRODUCTS • ENDS IN 16D | 05H | 45M | 43S
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-black text-white shadow-lg'
            : 'bg-transparent text-gray-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Left Section - Mobile Menu & Desktop Nav */}
          <div className="flex items-center gap-8">
            {/* Mobile Menu Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  <Link
                    href={item.href}
                    className={`text-xs font-medium tracking-wider transition-colors ${
                      isScrolled ? 'hover:text-gray-300' : 'hover:text-gray-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Center - Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <div
              className={`text-2xl font-bold tracking-wider transition-colors ${
                isScrolled ? 'text-white' : 'text-black'
              }`}
            >
              release
            </div>
          </Link>

          {/* Right Section - Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Country Selector */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-medium tracking-wider">
              <span>🇺🇸</span>
              <span>UNITED STATES</span>
              <ChevronDown size={16} />
            </div>

            {/* Search Icon */}
            <button
              onClick={openSearch}
              className={`transition-colors ${isScrolled ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* User Account / Login */}
            <div className="relative">
              {!isLoading && (
                <>
                  {isAuthenticated && user ? (
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className={`transition-colors ${isScrolled ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
                      aria-label="Account"
                    >
                      <UserIcon size={20} />
                    </button>
                  ) : (
                    <Link
                      href="/auth/login"
                      className={`text-xs font-medium tracking-wider transition-colors ${
                        isScrolled ? 'hover:text-gray-300' : 'hover:text-gray-600'
                      }`}
                    >
                      LOGIN
                    </Link>
                  )}

                  {/* Profile Dropdown */}
                  {isAuthenticated && isProfileOpen && (
                    <div className="absolute right-0 mt-4 w-48 bg-white text-black rounded shadow-lg z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b">
                        <p className="font-medium truncate">{user?.name || 'User'}</p>
                        <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/account/profile"
                        className="block px-4 py-2 hover:bg-gray-50 text-sm transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 hover:bg-gray-50 text-sm transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/account/favorites"
                        className="block px-4 py-2 hover:bg-gray-50 text-sm transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Favorites
                      </Link>
                      <button
                        onClick={async () => {
                          await logout();
                          setIsProfileOpen(false);
                          router.push('/');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2 border-t mt-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className={`relative transition-colors ${isScrolled ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className={`absolute -top-3 -right-3 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                  isScrolled ? 'bg-white text-black' : 'bg-black text-white'
                }`}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-gray-700 py-4 px-4 space-y-2 animate-slide-in-down">
            {navItems.map((item) => (
              <div key={item.label}>
                <button
                  onClick={() => toggleMobileSubmenu(item.label)}
                  className="w-full flex items-center justify-between py-3 text-white text-sm font-medium border-b border-gray-700"
                >
                  <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                  {item.submenu && item.submenu.length > 0 && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${expandedMobileMenu === item.label ? 'rotate-180' : ''}`}
                    />
                  )}
                </button>
                {expandedMobileMenu === item.label && item.submenu && (
                  <div className="bg-gray-900 py-2">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.label}
                        href={subitem.href}
                        className="block px-4 py-2 text-gray-400 text-xs hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
