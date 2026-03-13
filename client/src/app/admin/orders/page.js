"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Loader, Filter, Eye } from "lucide-react";
import orderService from "@/lib/services/orderService";
import DataTable from "@/components/admin/DataTable";
import OrderDetailModal from "@/components/admin/OrderDetailModal";

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrdersAdminPage() {
  const [allOrders, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      
      // Load more orders to allow client-side filtering
      const response = await orderService.getAllOrders(1, 100, filters);
      // Response structure: { data: [...orders], total, page, limit, pages, ... }
      const ordersData = response.data || response;
      setAllOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side filtering for search
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return allOrders;
    
    const searchLower = searchTerm.toLowerCase().trim();
    return allOrders.filter((order) => {
      const orderId = order._id?.toLowerCase() || "";
      const customerName = order.user?.name?.toLowerCase() || "";
      const customerEmail = order.user?.email?.toLowerCase() || "";
      
      return (
        orderId.includes(searchLower) ||
        customerName.includes(searchLower) ||
        customerEmail.includes(searchLower)
      );
    });
  }, [allOrders, searchTerm]);

  // Paginate the filtered orders
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * 10;
    return filteredOrders.slice(start, start + 10);
  }, [filteredOrders, page]);

  const pagination = useMemo(() => ({
    total: filteredOrders.length,
    limit: 10,
    page,
  }), [filteredOrders.length, page]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setAllOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  const handleOpenModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleOrderUpdate = (orderId, updates) => {
    setAllOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, ...updates } : order,
      ),
    );
  };

  const columns = [
    {
      key: "orderId",
      label: "Order ID",
      width: "12%",
      render: (_, row) => (
        <button
          onClick={() => handleOpenModal(row._id)}
          className="text-black font-medium hover:underline"
        >
          #{row._id.slice(-8).toUpperCase()}
        </button>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      width: "18%",
      render: (_, row) => row.user?.name || "-",
    },
    {
      key: "email",
      label: "Email",
      width: "18%",
      render: (_, row) => row.user?.email || "-",
    },
    {
      key: "total",
      label: "Total",
      width: "12%",
      render: (value) => `Rs. ${value?.toFixed(2) || "0.00"}`,
    },
    {
      key: "status",
      label: "Status",
      width: "15%",
      render: (value, row) => (
        <select
          value={value}
          onChange={(e) => {
            e.stopPropagation();
            handleStatusUpdate(row._id, e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
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
    {
      key: "actions",
      label: "Actions",
      width: "10%",
      render: (_, row) => (
        <button
          onClick={() => handleOpenModal(row._id)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-black rounded hover:bg-gray-800 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
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
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
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
            data={paginatedOrders}
            pagination={pagination}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isModalOpen}
        orderId={selectedOrderId}
        onClose={handleCloseModal}
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  );
}
