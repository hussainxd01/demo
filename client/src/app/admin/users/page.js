"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader, Toggle2 } from "lucide-react";
import userService from "@/lib/services/userService";
import DataTable from "@/components/admin/DataTable";

export default function UsersAdminPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsers();
  }, [page, searchTerm]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAllUsers(
        page,
        10,
        searchTerm ? { search: searchTerm } : {},
      );
      setUsers(response.users || []);
      setPagination({ total: response.total, limit: 10 });
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await userService.toggleUserStatus(userId, !currentStatus);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isActive: !currentStatus } : user,
        ),
      );
    } catch (error) {
      console.error("Failed to update user status", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const columns = [
    {
      key: "firstName",
      label: "Name",
      width: "20%",
      render: (_, row) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: "email",
      label: "Email",
      width: "25%",
    },
    {
      key: "phone",
      label: "Phone",
      width: "15%",
      render: (value) => value || "-",
    },
    {
      key: "createdAt",
      label: "Joined",
      width: "15%",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "isActive",
      label: "Status",
      width: "10%",
      render: (value, row) => (
        <button
          onClick={() => handleToggleStatus(row._id, value)}
          className={`px-3 py-1 rounded text-xs font-medium ${
            value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Users</h1>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-black" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            onDelete={handleDelete}
            pagination={{ ...pagination, page }}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
