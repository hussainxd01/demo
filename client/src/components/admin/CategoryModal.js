"use client";

import { useState } from "react";
import "./CategoryModal.css";

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      subcategories: [],
    },
  );
  const [errors, setErrors] = useState({});
  const [subcategoryInput, setSubcategoryInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    setFormData(
      initialData || {
        name: "",
        subcategories: [],
      },
    );
    setSubcategoryInput("");
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? "Edit Category" : "Create New Category"}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

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
                Press Enter or comma to add subcategories (e.g., Shirts, Pants,
                Shoes)
              </span>
            </div>
          </div>

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
                ? "Loading..."
                : initialData
                  ? "Update Category"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
