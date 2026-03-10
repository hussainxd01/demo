"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  MessageSquare,
  LogOut,
  Loader,
  AlertCircle,
  Tags,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const [loggingOut, setLoggingOut] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    } else if (!isLoading && user?.role !== "admin") {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this area
          </p>
          <Link href="/" className="text-black font-medium hover:text-gray-600">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.push("/");
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 w-64 h-screen bg-black text-white border-r border-gray-200 overflow-y-auto z-50">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold">Admin</h2>
          <p className="text-sm text-gray-400 mt-1">
            {user?.firstName} {user?.lastName}
          </p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-900 hover:text-white transition-colors text-sm font-medium"
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
          className="w-full m-4 flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {loggingOut ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </aside>

      <div className="ml-64">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
        </div>
        <main className="p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
