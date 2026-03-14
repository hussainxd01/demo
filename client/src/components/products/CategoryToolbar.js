"use client";

import "./CategoryToolbar.css";
import SortDropdown from "./SortDropdown";

export default function CategoryToolbar({
  itemCount,
  gridView,
  onGridViewChange,
  sortValue,
  onSortChange,
  onFilterClick,
}) {
  return (
    <div className="category-toolbar">
      <div className="toolbar-left">
        <span className="item-count">Items: {itemCount}</span>
      </div>

      <div className="toolbar-right">
        {/* Grid View Toggle */}
        <div className="view-toggle">
          <button
            className={`view-btn ${gridView === "large" ? "active" : ""}`}
            onClick={() => onGridViewChange("large")}
            aria-label="Large grid view"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="18" rx="1" />
              <rect x="14" y="3" width="7" height="18" rx="1" />
            </svg>
          </button>
          <button
            className={`view-btn ${gridView === "small" ? "active" : ""}`}
            onClick={() => onGridViewChange("small")}
            aria-label="Small grid view"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="5" height="5" rx="1" />
              <rect x="10" y="3" width="5" height="5" rx="1" />
              <rect x="17" y="3" width="4" height="5" rx="1" />
              <rect x="3" y="10" width="5" height="5" rx="1" />
              <rect x="10" y="10" width="5" height="5" rx="1" />
              <rect x="17" y="10" width="4" height="5" rx="1" />
              <rect x="3" y="17" width="5" height="4" rx="1" />
              <rect x="10" y="17" width="5" height="4" rx="1" />
              <rect x="17" y="17" width="4" height="4" rx="1" />
            </svg>
          </button>
        </div>

        {/* Filter Button */}
        <button className="filter-btn" onClick={onFilterClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <span>Filter</span>
        </button>

        {/* Sort Dropdown */}
        <SortDropdown value={sortValue} onChange={onSortChange} />
      </div>
    </div>
  );
}
