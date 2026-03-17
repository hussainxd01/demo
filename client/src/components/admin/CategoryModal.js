"use client";

import { useState, useEffect } from "react";
import "./CategoryModal.css";

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  mode = "edit", // "view" | "edit" | "create"
  onEdit, // callback to switch to edit mode from view mode
}) {
  const [formData, setFormData] = useState({
    name: "",
    subcategories: [],
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [subcategoryInput, setSubcategoryInput] = useState("");

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          subcategories: initialData.subcategories || [],
          isActive: initialData.isActive !== false,
        });
      } else {
        setFormData({
          name: "",
          subcategories: [],
          isActive: true,
        });
      }
      setSubcategoryInput("");
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubcategoryKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSubcategory();
    }
  };

  const addSubcategory = () => {
    const trimmed = subcategoryInput.trim();
    if (trimmed && !formData.subcategories.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        subcategories: [...prev.subcategories, trimmed],
      }));
      setSubcategoryInput("");
    }
  };

  const removeSubcategory = (index) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleReset = () => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        subcategories: initialData.subcategories || [],
        isActive: initialData.isActive !== false,
      });
    } else {
      setFormData({
        name: "",
        subcategories: [],
        isActive: true,
      });
    }
    setSubcategoryInput("");
    setErrors({});
  };

  if (!isOpen) return null;

  const isViewMode = mode === "view";
  const title = isViewMode
    ? "Category Details"
    : initialData
      ? "Edit Category"
      : "Create New Category";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {isViewMode ? (
          // View Mode
          <div className="modal-body-view">
            <div className="category-info-section">
              <div className="info-row">
                <span className="info-label">Name</span>
                <span className="info-value">{initialData?.name}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Slug</span>
                <span className="info-value slug">{initialData?.slug}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Status</span>
                <span
                  className={`status-badge ${initialData?.isActive ? "active" : "inactive"}`}
                >
                  {initialData?.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Created</span>
                <span className="info-value">
                  {initialData?.createdAt
                    ? new Date(initialData.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "-"}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Updated</span>
                <span className="info-value">
                  {initialData?.updatedAt
                    ? new Date(initialData.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "-"}
                </span>
              </div>
            </div>

            <div className="subcategories-section">
              <span className="info-label">Subcategories</span>
              {initialData?.subcategories &&
              initialData.subcategories.length > 0 ? (
                <div className="subcategory-chips view-mode">
                  {initialData.subcategories.map((sub, index) => (
                    <span key={index} className="subcategory-chip view">
                      {sub}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="no-subcategories">No subcategories defined</p>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              {onEdit && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => onEdit(initialData)}
                >
                  Edit Category
                </button>
              )}
            </div>
          </div>
        ) : (
          // Edit/Create Mode
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Category Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                disabled={isLoading}
                className={errors.name ? "error" : ""}
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="subcategories">Subcategories</label>
              <div className="subcategories-container">
                <div className="subcategory-chips">
                  {formData.subcategories.map((sub, index) => (
                    <span key={index} className="subcategory-chip">
                      {sub}
                      <button
                        type="button"
                        className="chip-remove"
                        onClick={() => removeSubcategory(index)}
                        disabled={isLoading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="subcategory-input-wrapper">
                  <input
                    type="text"
                    id="subcategories"
                    value={subcategoryInput}
                    onChange={(e) => setSubcategoryInput(e.target.value)}
                    onKeyDown={handleSubcategoryKeyDown}
                    placeholder="Type and press Enter to add"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="btn-add-subcategory"
                    onClick={addSubcategory}
                    disabled={isLoading || !subcategoryInput.trim()}
                  >
                    Add
                  </button>
                </div>
                <span className="help-text">
                  Press Enter or comma to add subcategories (e.g., Shirts,
                  Pants, Shoes)
                </span>
              </div>
            </div>

            {initialData && (
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <span>Active (visible in store)</span>
                </label>
              </div>
            )}

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset
              </button>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : initialData
                    ? "Update Category"
                    : "Create Category"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
