const Product = require("../models/Product");
const Review = require("../models/Review");
const { AppError } = require("../middleware/errorHandler");
const {
  sendSuccess,
  sendPaginatedResponse,
  getPaginationParams,
  buildFilter,
  buildSort,
  extractPublicIdFromUrl,
} = require("../utils/helpers");
const { deleteImageFromCloudinary } = require("../config/cloudinary");

// Get all products with filters, search, and pagination
const getProducts = async (req, res, next) => {
  try {
    const { limit, page, skip } = getPaginationParams(req.query);
    const filter = buildFilter(req.query);
    const sort = buildSort(req.query);

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-createdBy");

    const total = await Product.countDocuments(filter);

    sendPaginatedResponse(
      res,
      200,
      products,
      {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      "Products fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

// Get single product by ID
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate({
        path: "reviews",
        select: "rating title comment user images helpful unhelpful",
      });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    sendSuccess(res, 200, product, "Product fetched successfully");
  } catch (error) {
    next(error);
  }
};

// Create new product (Admin only)
const createProduct = async (req, res, next) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.userId,
    };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => {
        const url = file.secure_url || file.path;
        const publicId =
          file.public_id || file.filename || extractPublicIdFromUrl(url);

        return { url, publicId };
      });
    }

    const product = await Product.create(productData);
    sendSuccess(res, 201, product, "Product created successfully");
  } catch (error) {
    next(error);
  }
};

// Update product (Admin only)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    // Extract special image fields from request body
    const existingImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : [];
    const imagesToRemove = req.body.imagesToRemove
      ? JSON.parse(req.body.imagesToRemove)
      : [];

    // Remove these special fields from the update body
    delete req.body.existingImages;
    delete req.body.imagesToRemove;

    // Handle image removal from Cloudinary
    if (imagesToRemove && imagesToRemove.length > 0) {
      for (const imageUrl of imagesToRemove) {
        // Extract publicId from the URL or get it from the existing images
        const imageToDelete = product.images.find(
          (img) => img.url === imageUrl,
        );
        if (imageToDelete) {
          await deleteImageFromCloudinary(imageToDelete.publicId);
        }
      }
    }

    // Build the final images array
    let updatedImages = [];

    // Keep existing images that weren't removed
    if (existingImages && existingImages.length > 0) {
      updatedImages = product.images.filter((img) =>
        existingImages.some((existing) =>
          typeof existing === "string"
            ? existing === img.url
            : existing === img.url || existing === img,
        ),
      );
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => {
        const url = file.secure_url || file.path;
        const publicId =
          file.public_id || file.filename || extractPublicIdFromUrl(url);

        return { url, publicId };
      });
      updatedImages = [...updatedImages, ...newImages];
    }

    // Update images if there are any changes
    if (
      updatedImages.length > 0 ||
      existingImages.length > 0 ||
      imagesToRemove.length > 0
    ) {
      req.body.images = updatedImages;
    }

    product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    sendSuccess(res, 200, product, "Product updated successfully");
  } catch (error) {
    next(error);
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        await deleteImageFromCloudinary(image.publicId);
      }
    }

    await Product.findByIdAndDelete(id);
    sendSuccess(res, 200, {}, "Product deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Get product by category
const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit, page, skip } = getPaginationParams(req.query);
    const sort = buildSort(req.query);

    const products = await Product.find({ category })
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ category });

    sendPaginatedResponse(
      res,
      200,
      products,
      {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      "Products by category fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

// Get products by brand
const getProductsByBrand = async (req, res, next) => {
  try {
    const { brand } = req.params;
    const { limit, page, skip } = getPaginationParams(req.query);
    const sort = buildSort(req.query);

    const products = await Product.find({ brand })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ brand });

    sendPaginatedResponse(
      res,
      200,
      products,
      {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      "Products by brand fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

// Search products
const searchProducts = async (req, res, next) => {
  try {
    const { query } = req.query;
    const { limit, page, skip } = getPaginationParams(req.query);

    if (!query || query.length < 2) {
      throw new AppError(
        "Search query must be at least 2 characters long",
        400,
      );
    }

    const products = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limit);

    const total = await Product.find({
      $text: { $search: query },
    }).countDocuments();

    sendPaginatedResponse(
      res,
      200,
      products,
      {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      "Search results fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

// Get featured products
const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = 8;
    const products = await Product.find({ isActive: true })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(limit);

    sendSuccess(res, 200, products, "Featured products fetched successfully");
  } catch (error) {
    next(error);
  }
};

// Get distinct active brands
const getBrands = async (req, res, next) => {
  try {
    const brands = await Product.distinct("brand", { isActive: true });
    brands.sort((a, b) => String(a).localeCompare(String(b)));
    sendSuccess(res, 200, { brands }, "Brands fetched successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByBrand,
  searchProducts,
  getFeaturedProducts,
  getBrands,
};
