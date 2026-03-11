"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import productService from "@/lib/services/productService";
import DataTable from "@/components/admin/DataTable";

export default function ProductsAdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, limit: 10 });

  useEffect(() => {
    loadProducts();
  }, [page, searchTerm]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productService.getAllProducts(
        page,
        10,
        searchTerm ? { search: searchTerm } : {},
      );
      setProducts(response.products || []);
      setPagination({ total: response.total, limit: 10 });
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditPage = (productId) => {
    router.push(`/admin/products/edit/${productId}`);
  };

  const handleDelete = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Product Name",
      width: "25%",
    },
    {
      key: "brand",
      label: "Brand",
      width: "15%",
    },
    {
      key: "price",
      label: "Price",
      width: "12%",
      render: (value) => `Rs. ${value.toFixed(2)}`,
    },
    {
      key: "stock",
      label: "Stock",
      width: "10%",
    },
    {
      key: "category",
      label: "Category",
      width: "15%",
      render: (value) => {
        if (typeof value === "object" && value?.name) {
          return value.name;
        }
        return value || "N/A";
      },
    },
    {
      key: "rating",
      label: "Rating",
      width: "10%",
      render: (value) => `${value || 0}/5`,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black">Products</h1>
          <Link
            href="/admin/products/create"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
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
              data={products}
              onEdit={handleOpenEditPage}
              onDelete={handleDelete}
              pagination={{ ...pagination, page }}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
