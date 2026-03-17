"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import categoryService from "@/lib/services/categoryService";
import CategoryModal from "@/components/admin/CategoryModal";
import "../../../styles/admin/categories.css";

export default function CategoriesPage() {
  const { user, token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit" | "view"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch categories and stats
  useEffect(() => {
    fetchCategoriesAndStats();
  }, []);

  const fetchCategoriesAndStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [categoriesData, statsData] = await Promise.all([
        categoryService.getAllCategories(),
        categoryService.getCategoryStats(),
      ]);

      setCategories(categoriesData);
      setCategoryStats(statsData);
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedCategory(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleView = (category) => {
    setSelectedCategory(category);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSwitchToEdit = (category) => {
    setModalMode("edit");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setModalMode("create");
  };

  const handleModalSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (selectedCategory) {
        // Update existing category
        await categoryService.updateCategory(selectedCategory._id, formData);
        setSuccess("Category updated successfully");
      } else {
        // Create new category
        await categoryService.createCategory(formData);
        setSuccess("Category created successfully");
      }

      handleModalClose();
      await fetchCategoriesAndStats();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (e, category) => {
    e.stopPropagation(); // Prevent row click from triggering
    const stats = categoryStats.find((s) => s._id === category._id);
    if (stats && stats.productCount > 0) {
      setError(
        `Cannot delete "${category.name}" - it has ${stats.productCount} product(s) assigned. Please reassign or delete those products first.`,
      );
    } else {
      setDeleteConfirm(category);
    }
  };

  const handleEditClick = (e, category) => {
    e.stopPropagation(); // Prevent row click from triggering
    handleEdit(category);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      await categoryService.deleteCategory(deleteConfirm._id);
      setSuccess("Category deleted successfully");

      setDeleteConfirm(null);
      await fetchCategoriesAndStats();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getProductCount = (categoryId) => {
    const stats = categoryStats.find((s) => s._id === categoryId);
    return stats ? stats.productCount : 0;
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="categories-container">
        <div className="access-denied">
          <h1>Access Denied</h1>
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <div>
          <h1>Product Categories</h1>
          <p>Manage product categories for your store</p>
        </div>
        <button className="btn-create" onClick={handleCreateNew}>
          + Create Category
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="categories-filters">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="categories-content">
        {isLoading ? (
          <div className="loading-state">
            <p>Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="empty-state">
            <h2>No categories found</h2>
            <p>
              {searchTerm
                ? "No categories match your search. Try adjusting your filter."
                : "Create your first category to get started."}
            </p>
            {!searchTerm && (
              <button className="btn-create" onClick={handleCreateNew}>
                Create First Category
              </button>
            )}
          </div>
        ) : (
          <div className="categories-table-wrapper">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subcategories</th>
                  <th>Slug</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr
                    key={category._id}
                    onClick={() => handleView(category)}
                    className="clickable-row"
                  >
                    <td className="category-name">
                      <strong>{category.name}</strong>
                    </td>
                    <td className="category-subcategories">
                      {category.subcategories &&
                      category.subcategories.length > 0 ? (
                        <span className="subcategory-count">
                          {category.subcategories.length} subcategories
                        </span>
                      ) : (
                        <span className="no-subcategories-text">None</span>
                      )}
                    </td>
                    <td className="category-slug">{category.slug}</td>
                    <td className="category-count">
                      {getProductCount(category._id)}
                    </td>
                    <td className="category-status">
                      <span
                        className={`status-badge ${category.isActive ? "active" : "inactive"}`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="category-date">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="category-actions">
                      <button
                        className="btn-action btn-edit"
                        onClick={(e) => handleEditClick(e, category)}
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={(e) => handleDeleteClick(e, category)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Category</h2>
              <button
                className="modal-close"
                onClick={() => setDeleteConfirm(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete{" "}
                <strong>{deleteConfirm.name}</strong>?
              </p>
              {deleteConfirm.subcategories &&
                deleteConfirm.subcategories.length > 0 && (
                  <p className="subcategories-warning">
                    This category has {deleteConfirm.subcategories.length}{" "}
                    subcategories that will also be removed.
                  </p>
                )}
              <p className="warning">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setDeleteConfirm(null)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={selectedCategory}
        isLoading={isSubmitting}
        mode={modalMode}
        onEdit={handleSwitchToEdit}
      />
    </div>
  );
}
