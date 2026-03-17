"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader,
  Trash2,
  Upload,
  X,
  ChevronDown,
} from "lucide-react";
import productService from "@/lib/services/productService";
import categoryService from "@/lib/services/categoryService";

function splitList(value) {
  return value
    .split(/\r?\n|,/)
    .map((v) => v.trim())
    .filter(Boolean);
}

// Helper function to normalize image URL from various formats
function normalizeImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image === "object" && image.url) return image.url;
  return String(image);
}

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    brand: "",
    stock: "",
    sku: "",
    isActive: true,
    instructions: "",

    // Specifications
    specSize: "",
    specVolume: "",
    specWeight: "",
    specIngredientsText: "",

    // Shipping
    shippingWeight: "",
    shippingLength: "",
    shippingWidth: "",
    shippingHeight: "",
    shippingEstimatedDays: "",
    shippingInfo: "",

    tagsText: "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    specifications: false,
    instructions: false,
    shipping: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Fetch product and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch categories
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);

        // Fetch product
        const product = await productService.getProductById(id);

        // Map existing images
        setExistingImages(product.images || []);

        // Parse tags
        const tagsText = (product.tags || []).join("\n");

        // Parse specifications
        const specs = product.specifications || {};
        const ingredients = (specs.ingredients || []).join("\n");

        // Parse shipping
        const shipping = product.shipping || {};
        const dimensions = shipping.dimensions || {};

        // Set form data
        setForm({
          name: product.name || "",
          description: product.description || "",
          price: String(product.price || ""),
          category: product.category?._id || "",
          subcategory: product.subcategory || "",
          brand: product.brand || "",
          stock: String(product.stock || ""),
          sku: product.sku || "",
          isActive: product.isActive !== false,
          instructions: product.instructions || "",
          specSize: specs.size || "",
          specVolume: specs.volume || "",
          specWeight: specs.weight || "",
          specIngredientsText: ingredients,
          shippingWeight: String(shipping.weight || ""),
          shippingLength: String(dimensions.length || ""),
          shippingWidth: String(dimensions.width || ""),
          shippingHeight: String(dimensions.height || ""),
          shippingEstimatedDays: shipping.estimatedDays || "",
          shippingInfo: shipping.info || "",
          tagsText,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setGeneralError("Failed to load product data");
      } finally {
        setIsLoading(false);
        setCategoriesLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (typeof url === "string" && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  const tags = useMemo(() => splitList(form.tagsText), [form.tagsText]);

  // Get subcategories for selected category
  const subcategories = useMemo(() => {
    const selectedCategory = categories.find((c) => c._id === form.category);
    return selectedCategory?.subcategories || [];
  }, [categories, form.category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // Reset subcategory when category changes
      ...(name === "category" && { subcategory: "" }),
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (generalError) setGeneralError("");
  };

  const handleSkuChange = (e) => {
    const next = e.target.value.toUpperCase();
    setForm((prev) => ({ ...prev, sku: next }));
    if (errors.sku) setErrors((prev) => ({ ...prev, sku: "" }));
    if (generalError) setGeneralError("");
  };

  const handleImagesChange = (e) => {
    const fileList = Array.from(e.target.files || []);
    if (fileList.length === 0) return;

    // Normalize existing images for proper counting
    const keptExisting = existingImages.filter((img) => {
      const imgUrl = normalizeImageUrl(img);
      return !imagesToRemove.includes(imgUrl);
    }).length;

    const totalImages = keptExisting + images.length + fileList.length;

    if (totalImages > 5) {
      setErrors((prev) => ({
        ...prev,
        images: `Maximum 5 images allowed (you have ${keptExisting} existing + ${images.length} new)`,
      }));
      return;
    }

    const nextFiles = [...images, ...fileList];

    previews.forEach((url) => URL.revokeObjectURL(url));
    const nextPreviews = nextFiles.map((f) => URL.createObjectURL(f));

    setImages(nextFiles);
    setPreviews(nextPreviews);
    if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));
    if (generalError) setGeneralError("");
  };

  const removeNewImage = (index) => {
    const nextFiles = images.filter((_, i) => i !== index);
    previews.forEach((url) => URL.revokeObjectURL(url));
    const nextPreviews = nextFiles.map((f) => URL.createObjectURL(f));
    setImages(nextFiles);
    setPreviews(nextPreviews);
  };

  const removeExistingImage = (image) => {
    // Normalize: extract URL from image object if needed
    const imageUrl = normalizeImageUrl(image);

    // Check if already marked for removal - if so, undo the removal
    if (imagesToRemove.includes(imageUrl)) {
      setImagesToRemove((prev) => prev.filter((url) => url !== imageUrl));
    } else {
      // Mark for removal
      setImagesToRemove((prev) => [...prev, imageUrl]);
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Product name is required";
    if (!form.description.trim())
      nextErrors.description = "Description is required";
    else if (form.description.trim().length < 10)
      nextErrors.description = "Description must be at least 10 characters";

    const priceNum = Number(form.price);
    if (!form.price) nextErrors.price = "Price is required";
    else if (Number.isNaN(priceNum) || priceNum <= 0)
      nextErrors.price = "Price must be a positive number";

    if (!form.brand.trim()) nextErrors.brand = "Brand is required";

    const stockNum = Number(form.stock);
    if (form.stock === "") nextErrors.stock = "Stock is required";
    else if (Number.isNaN(stockNum) || stockNum < 0)
      nextErrors.stock = "Stock must be 0 or more";

    if (!form.sku.trim()) nextErrors.sku = "SKU is required";

    // Check total images - properly normalize existing images
    const keptExisting = existingImages.filter((img) => {
      const imgUrl = normalizeImageUrl(img);
      return !imagesToRemove.includes(imgUrl);
    }).length;
    const totalImages = keptExisting + images.length;
    if (totalImages === 0)
      nextErrors.images = "Please keep at least 1 image or add new ones";

    return nextErrors;
  };

  const buildPayload = () => {
    const fd = new FormData();

    fd.append("name", form.name.trim());
    fd.append("description", form.description.trim());
    fd.append("price", String(Number(form.price)));
    fd.append("category", form.category);
    fd.append("subcategory", form.subcategory || "");
    fd.append("brand", form.brand.trim());
    fd.append("stock", String(Number(form.stock)));
    fd.append("sku", form.sku.trim().toUpperCase());
    fd.append("isActive", String(!!form.isActive));

    if (form.instructions.trim()) {
      fd.append("instructions", form.instructions.trim());
    }

    const specIngredients = splitList(form.specIngredientsText);
    const specifications = {
      ...(form.specSize.trim() && { size: form.specSize.trim() }),
      ...(form.specVolume.trim() && { volume: form.specVolume.trim() }),
      ...(form.specWeight.trim() && { weight: form.specWeight.trim() }),
      ...(specIngredients.length > 0 && { ingredients: specIngredients }),
    };
    if (Object.keys(specifications).length > 0) {
      fd.append("specifications", JSON.stringify(specifications));
    }

    const shipping = {
      ...(form.shippingWeight !== "" && {
        weight: Number(form.shippingWeight),
      }),
      ...(form.shippingEstimatedDays.trim() && {
        estimatedDays: form.shippingEstimatedDays.trim(),
      }),
      ...(form.shippingInfo.trim() && { info: form.shippingInfo.trim() }),
    };

    const dimensions = {
      ...(form.shippingLength !== "" && {
        length: Number(form.shippingLength),
      }),
      ...(form.shippingWidth !== "" && { width: Number(form.shippingWidth) }),
      ...(form.shippingHeight !== "" && {
        height: Number(form.shippingHeight),
      }),
    };
    if (Object.keys(dimensions).length > 0) {
      shipping.dimensions = dimensions;
    }

    if (Object.keys(shipping).length > 0) {
      fd.append("shipping", JSON.stringify(shipping));
    }

    if (tags.length > 0) {
      fd.append("tags", JSON.stringify(tags));
    }

    // Add only the existing images that are being kept (not removed)
    const keptImages = existingImages.filter((img) => {
      const imgUrl = normalizeImageUrl(img);
      return !imagesToRemove.includes(imgUrl);
    });

    if (keptImages.length > 0) {
      fd.append("existingImages", JSON.stringify(keptImages));
    }

    // Add images to remove (as URLs only)
    if (imagesToRemove.length > 0) {
      fd.append("imagesToRemove", JSON.stringify(imagesToRemove));
    }

    // Add new image files
    images.forEach((file) => fd.append("images", file));

    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      await productService.updateProduct(id, payload);
      router.push("/admin/products");
    } catch (error) {
      setGeneralError(error?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-gray-700" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-black">Edit Product</h1>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {generalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Product Name<span className="text-red-500"> *</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g. Hydrating Face Cream"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Description<span className="text-red-500"> *</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Describe benefits, texture, finish, etc."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Price<span className="text-red-500"> *</span>
                  </label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    inputMode="decimal"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g. 1999"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Stock<span className="text-red-500"> *</span>
                  </label>
                  <input
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    inputMode="numeric"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.stock ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g. 25"
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Category<span className="text-red-500"> *</span>
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={categoriesLoading}
                  >
                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : "Select a category"}
                    </option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Subcategory
                  </label>
                  <select
                    name="subcategory"
                    value={form.subcategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={!form.category || subcategories.length === 0}
                  >
                    <option value="">
                      {!form.category
                        ? "Select a category first"
                        : subcategories.length === 0
                          ? "No subcategories available"
                          : "Select a subcategory"}
                    </option>
                    {subcategories.map((sub, index) => (
                      <option key={index} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Brand<span className="text-red-500"> *</span>
                </label>
                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.brand ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g. Dr. Barbara"
                />
                {errors.brand && (
                  <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    SKU<span className="text-red-500"> *</span>
                  </label>
                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleSkuChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.sku ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g. HV-CR-001"
                  />
                  {errors.sku && (
                    <p className="text-red-500 text-sm mt-1">{errors.sku}</p>
                  )}
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-3 select-none">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      className="w-4 h-4 border border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Active (visible in store)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Images<span className="text-red-500"> *</span>{" "}
                  <span className="text-xs text-gray-500">(max 5)</span>
                </label>

                {/* Image Status Summary */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Existing</p>
                      <p className="font-semibold text-black">
                        {
                          existingImages.filter((img) => {
                            const imgUrl = normalizeImageUrl(img);
                            return !imagesToRemove.includes(imgUrl);
                          }).length
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">New</p>
                      <p className="font-semibold text-black">
                        {images.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">To Remove</p>
                      <p className="font-semibold text-red-600">
                        {imagesToRemove.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-6 ${
                    errors.images ? "border-red-400" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-700">
                        Upload JPG/PNG/WEBP images (up to 10MB each)
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        These will be uploaded to Cloudinary on submit.
                      </p>
                    </div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer text-sm font-medium">
                      <Upload className="w-4 h-4" />
                      Add Images
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImagesChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {errors.images && (
                    <p className="text-red-500 text-sm mt-3">{errors.images}</p>
                  )}

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mt-5">
                      <p className="text-xs font-semibold text-gray-700 mb-3">
                        Current Images (
                        {
                          existingImages.filter((img) => {
                            const imgUrl = normalizeImageUrl(img);
                            return !imagesToRemove.includes(imgUrl);
                          }).length
                        }{" "}
                        kept)
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {existingImages.map((src, idx) => {
                          const imageUrl = normalizeImageUrl(src);
                          const isRemoved = imagesToRemove.includes(imageUrl);
                          return (
                            <div
                              key={`existing-${idx}`}
                              className={`relative border rounded-lg overflow-hidden transition-opacity ${
                                isRemoved
                                  ? "border-red-300 bg-red-50 opacity-50"
                                  : "border-gray-200 bg-white"
                              }`}
                            >
                              <img
                                src={imageUrl}
                                alt="Existing"
                                className="w-full h-28 object-cover"
                              />
                              {isRemoved && (
                                <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
                                  <span className="text-xs font-semibold text-red-700 bg-white px-2 py-1 rounded">
                                    Removed
                                  </span>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => removeExistingImage(src)}
                                className={`absolute top-2 right-2 p-2 rounded-md transition-colors ${
                                  isRemoved
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-white/90 hover:bg-white border border-gray-200"
                                }`}
                                title={isRemoved ? "Undo removal" : "Remove"}
                              >
                                <Trash2
                                  className={`w-4 h-4 ${isRemoved ? "text-white" : "text-gray-700"}`}
                                />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* New Images */}
                  {previews.length > 0 && (
                    <div className="mt-5">
                      <p className="text-xs text-gray-600 mb-3">New images</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {previews.map((src, idx) => (
                          <div
                            key={`preview-${idx}`}
                            className="relative border border-blue-200 rounded-lg overflow-hidden bg-blue-50"
                          >
                            <img
                              src={src}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-28 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(idx)}
                              className="absolute top-2 right-2 p-2 rounded-md bg-white/90 hover:bg-white border border-gray-200"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Tags{" "}
                  <span className="text-xs text-gray-500">
                    (comma or newline separated)
                  </span>
                </label>
                <textarea
                  name="tagsText"
                  value={form.tagsText}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g. hydrating, sensitive skin, new"
                />
                {tags.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {tags.length} tag{tags.length === 1 ? "" : "s"} will be
                    saved
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => toggleSection("specifications")}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <h2 className="text-lg font-semibold text-black">
                Specifications (optional)
              </h2>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  expandedSections.specifications ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.specifications && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Size
                    </label>
                    <input
                      name="specSize"
                      value={form.specSize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="e.g. Travel / Full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Volume
                    </label>
                    <input
                      name="specVolume"
                      value={form.specVolume}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="e.g. 50ml"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Weight
                    </label>
                    <input
                      name="specWeight"
                      value={form.specWeight}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="e.g. 120g"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-black mb-2">
                    Ingredients{" "}
                    <span className="text-xs text-gray-500">
                      (comma or newline separated)
                    </span>
                  </label>
                  <textarea
                    name="specIngredientsText"
                    value={form.specIngredientsText}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g. Hyaluronic Acid, Niacinamide, ..."
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => toggleSection("instructions")}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <h2 className="text-lg font-semibold text-black">
                Instructions (optional)
              </h2>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  expandedSections.instructions ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.instructions && (
              <div className="mt-4">
                <textarea
                  name="instructions"
                  value={form.instructions}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="How to use the product..."
                />
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => toggleSection("shipping")}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <h2 className="text-lg font-semibold text-black">
                Shipping (optional)
              </h2>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  expandedSections.shipping ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.shipping && (
              <div className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Shipping Weight (kg)
                      </label>
                      <input
                        name="shippingWeight"
                        value={form.shippingWeight}
                        onChange={handleChange}
                        inputMode="decimal"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="e.g. 0.25"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Length
                        </label>
                        <input
                          name="shippingLength"
                          value={form.shippingLength}
                          onChange={handleChange}
                          inputMode="decimal"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="cm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Width
                        </label>
                        <input
                          name="shippingWidth"
                          value={form.shippingWidth}
                          onChange={handleChange}
                          inputMode="decimal"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="cm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Height
                        </label>
                        <input
                          name="shippingHeight"
                          value={form.shippingHeight}
                          onChange={handleChange}
                          inputMode="decimal"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="cm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Estimated Delivery Days
                      </label>
                      <input
                        name="shippingEstimatedDays"
                        value={form.shippingEstimatedDays}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="e.g. 2-4 business days"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Shipping Info
                      </label>
                      <textarea
                        name="shippingInfo"
                        value={form.shippingInfo}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Additional shipping info..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Link
              href="/admin/products"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
