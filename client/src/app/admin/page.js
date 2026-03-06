"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  Loader,
} from "lucide-react";
import orderService from "@/lib/services/orderService";
import userService from "@/lib/services/userService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const [orderAnalytics, userAnalytics] = await Promise.all([
          orderService.getOrderAnalytics(),
          userService.getUserAnalytics(),
        ]);

        setStats({
          totalOrders: orderAnalytics.totalOrders || 0,
          totalRevenue: orderAnalytics.totalRevenue || 0,
          totalUsers: userAnalytics.totalUsers || 0,
          totalProducts: userAnalytics.totalProducts || 0,
          recentOrders: orderAnalytics.recentOrders || [],
        });
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
      trend: "+12% this month",
    },
    {
      title: "Total Revenue",
      value: `Rs. ${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-green-50 text-green-600",
      trend: "+8% this month",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-purple-50 text-purple-600",
      trend: "+5% this month",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-amber-50 text-amber-600",
      trend: "+2 new products",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  {card.trend}
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium">{card.title}</p>
              <p className="text-3xl font-bold text-black mt-2">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/products?action=create"
            className="p-4 border border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-colors text-center"
          >
            <Package className="w-6 h-6 mx-auto mb-2 text-black" />
            <p className="font-medium text-black">Add Product</p>
            <p className="text-sm text-gray-600">Create a new product</p>
          </Link>
          <Link
            href="/admin/orders"
            className="p-4 border border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-colors text-center"
          >
            <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-black" />
            <p className="font-medium text-black">View Orders</p>
            <p className="text-sm text-gray-600">Manage customer orders</p>
          </Link>
          <Link
            href="/admin/users"
            className="p-4 border border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-colors text-center"
          >
            <Users className="w-6 h-6 mx-auto mb-2 text-black" />
            <p className="font-medium text-black">Manage Users</p>
            <p className="text-sm text-gray-600">View all customers</p>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-black">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-black hover:text-gray-600 font-medium text-sm"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Total
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.slice(0, 5).map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    {order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="py-3 px-4">
                    {order.userId?.firstName} {order.userId?.lastName}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    Rs. {order.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
