"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

export default function DataTable({
  columns,
  data,
  isLoading,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
}) {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: null,
  });

  const handleDeleteClick = (row) => {
    const displayName =
      row.name || row.email || row._id?.slice(-8).toUpperCase() || "this item";
    setDeleteModal({ isOpen: true, itemId: row._id, itemName: displayName });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.itemId && onDelete) {
      onDelete(deleteModal.itemId);
    }
    setDeleteModal({ isOpen: false, itemId: null, itemName: null });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, itemId: null, itemName: null });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                    style={{ width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={row._id || rowIndex}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={`row-${row._id}-col-${colIndex}`}
                        className="px-6 py-4 text-sm text-gray-700"
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key]}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td
                        key={`actions-${row._id}`}
                        className="px-6 py-4 text-sm flex gap-2"
                      >
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row._id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => handleDeleteClick(row)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {data.length > 0 ? 1 : 0} to {data.length} of{" "}
              {pagination.total}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="px-3 py-2 text-sm">
                Page {pagination.page} of{" "}
                {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={
                  pagination.page >=
                  Math.ceil(pagination.total / pagination.limit)
                }
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-gray-300 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Confirm Delete
                </h2>
              </div>
              <button
                onClick={handleCancelDelete}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{deleteModal.itemName}</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
