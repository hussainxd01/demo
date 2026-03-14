"use client";

import "./SubcategoryPills.css";

export default function SubcategoryPills({
  subcategories = [],
  selectedSubcategory,
  onSelect,
}) {
  const allPills = ["All Products", ...subcategories];

  return (
    <div className="subcategory-pills">
      {allPills.map((sub) => (
        <button
          key={sub}
          className={`pill ${
            (sub === "All Products" && !selectedSubcategory) ||
            sub === selectedSubcategory
              ? "active"
              : ""
          }`}
          onClick={() => onSelect(sub === "All Products" ? null : sub)}
        >
          {sub}
        </button>
      ))}
    </div>
  );
}
