"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ExpandableSection({
  title,
  children,
  defaultOpen = false,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-0 text-left font-medium text-gray-800 hover:text-gray-600 transition-colors group"
      >
        <span className="uppercase text-sm tracking-wide">{title}</span>
        <ChevronDown
          size={20}
          className={`transition-transform duration-300 group-hover:text-gray-600 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="pb-4 text-gray-700 space-y-2 animate-in fade-in duration-200">
          {Array.isArray(children) ? (
            <ul className="space-y-2">
              {children.map((item, index) => (
                <li key={index} className="text-sm">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
}
