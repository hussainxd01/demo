"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Loader } from "lucide-react";
import productService from "@/lib/services/productService";
import DataTable from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, limit: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmitForm = async (formData) => {
    try {
      setIsModalLoading(true);
      const preparedData = {
        name: formData.name,
        brand: formData.brand,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        description: formData.description,
      };

      if (editingProduct) {
        // Update product
        await productService.updateProduct(editingProduct._id, preparedData);
        setProducts((prev) =>
          prev.map((p) =>
            p._id === editingProduct._id
              ? { ...p, ...preparedData }
              : p,
          ),
        );
      } else {
        // Create product
        const response = await productService.createProduct(preparedData);
        setProducts((prev) => [response, ...prev]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Failed to save product", error);
      throw error;
    } finally {
      setIsModalLoading(false);
    }
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
    },
    {
      key: "rating",
      label: "Rating",
      width: "10%",
      render: (value) => `${value || 0}/5`,
    },
  ];

  const productFields = [
    {
      name: "name",
      label: "Product Name",
      type: "text",
      placeholder: "Enter product name",
      required: true,
    },
    {
      name: "brand",
      label: "Brand",
      type: "text",
      placeholder: "Enter brand",
      required: true,
    },
    {
      name: "price",
      label: "Price (Rs.)",
      type: "number",
      placeholder: "0.00",
      step: "0.01",
      required: true,
    },
    {
      name: "stock",
      label: "Stock Quantity",
      type: "number",
      placeholder: "0",
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "text",
      placeholder: "Enter category",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter product description",
      rows: 4,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black">Products</h1>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
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
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
              pagination={{ ...pagination, page }}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      <FormModal
        isOpen={isModalOpen}
        title={editingProduct ? "Edit Product" : "Create Product"}
        fields={productFields}
        initialData={
          editingProduct
            ? {
                name: editingProduct.name,
                brand: editingProduct.brand,
                price: editingProduct.price,
                stock: editingProduct.stock,
                category: editingProduct.category,
                description: editingProduct.description,
              }
            : {
                name: "",
                brand: "",
                price: "",
                stock: "",
                category: "",
                description: "",
              }
        }
        onSubmit={handleSubmitForm}
        onClose={handleCloseModal}
        isLoading={isModalLoading}
        submitText={editingProduct ? "Update Product" : "Create Product"}
      />
    </>
  );
}
