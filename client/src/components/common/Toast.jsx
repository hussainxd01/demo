"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const toastStore = {
  listeners: [],
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },
  emit(toast) {
    this.listeners.forEach((listener) => listener(toast));
  },
};

export const showToast = (message, type = "info", duration = 3000) => {
  const id = Math.random().toString(36).substr(2, 9);
  toastStore.emit({ id, message, type, duration });
  return id;
};

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(
      ({ id, message, type, duration }) => {
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration) {
          setTimeout(() => {
            removeToast(id);
          }, duration);
        }
      },
    );

    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "info":
        return "text-blue-800";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${getBgColor(toast.type)} ${getTextColor(toast.type)} shadow-lg animate-fade-in pointer-events-auto`}
        >
          {getIcon(toast.type)}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="mt-0.5 hover:opacity-70 transition-opacity flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
