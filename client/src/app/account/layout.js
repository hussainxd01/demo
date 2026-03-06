"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Loader,
} from "lucide-react";

export default function AccountLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const [loggingOut, setLoggingOut] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.push("/");
  };

  const navItems = [
    { href: "/account/profile", label: "Profile", icon: User },
    { href: "/account/orders", label: "Orders", icon: ShoppingBag },
    { href: "/account/favorites", label: "Favorites", icon: Heart },
    { href: "/account/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h2 className="font-semibold text-black mb-1">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-white hover:text-black transition-colors text-sm"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full mt-6 pt-6 border-t border-gray-200 flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-white transition-colors text-sm disabled:opacity-50"
              >
                {loggingOut ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3 animate-fade-in">{children}</main>
        </div>
      </div>
    </div>
  );
}
