"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader, X } from "lucide-react";
import userService from "@/lib/services/userService";
import DataTable from "@/components/admin/DataTable";

export default function UsersAdminPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

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
    <>
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
              onEdit={setSelectedUser}
              onDelete={handleDelete}
              pagination={{ ...pagination, page }}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-gray-300 w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-black">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="mt-1 text-gray-900">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone
                </label>
                <p className="mt-1 text-gray-900">
                  {selectedUser.phone || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Joined
                </label>
                <p className="mt-1 text-gray-900">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <p className="mt-1">
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      selectedUser.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedUser.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleToggleStatus(selectedUser._id, selectedUser.isActive);
                  setSelectedUser(null);
                }}
                className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Toggle Status
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
