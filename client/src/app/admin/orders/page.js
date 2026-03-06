"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader, Filter } from "lucide-react";
import orderService from "@/lib/services/orderService";
import DataTable from "@/components/admin/DataTable";

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, limit: 10 });
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getAllOrders(
        page,
        10,
        statusFilter ? { status: statusFilter } : {},
      );
      setOrders(response.orders || []);
      setPagination({ total: response.total, limit: 10 });
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  const columns = [
    {
      key: "orderId",
      label: "Order ID",
      width: "15%",
      render: (_, row) => row._id.slice(-8).toUpperCase(),
    },
    {
      key: "customer",
      label: "Customer",
      width: "20%",
      render: (_, row) => `${row.userId?.firstName} ${row.userId?.lastName}`,
    },
    {
      key: "email",
      label: "Email",
      width: "20%",
      render: (_, row) => row.userId?.email,
    },
    {
      key: "totalAmount",
      label: "Total",
      width: "15%",
      render: (value) => `Rs. ${value.toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      width: "15%",
      render: (value, row) => (
        <select
          value={value}
          onChange={(e) => handleStatusUpdate(row._id, e.target.value)}
          className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
            value === "delivered"
              ? "bg-green-100 text-green-700"
              : value === "shipped"
                ? "bg-blue-100 text-blue-700"
                : value === "processing"
                  ? "bg-yellow-100 text-yellow-700"
                  : value === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
          }`}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Orders</h1>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="w-5 h-5 text-gray-400 my-auto" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-black" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={orders}
            pagination={{ ...pagination, page }}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
