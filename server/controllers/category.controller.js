const Category = require("../models/Category");
const Product = require("../models/Product");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const query = {};

    // Non-admin users only see active categories
    if (!req.user || req.user.role !== "admin") {
      query.isActive = true;
    }

    const categories = await Category.find(query).sort({ name: 1 });
    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching categories",
    });
  }
};

// Get single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching category",
    });
  }
};

// Get single category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Non-admin users can only see active categories
    if (!req.user || req.user.role !== "admin") {
      if (!category.isActive) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching category",
    });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;

    // Validate input
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "A category with this name already exists",
      });
    }

    // Process subcategories - trim and filter empty values
    const processedSubcategories = Array.isArray(subcategories)
      ? subcategories.map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const category = new Category({
      name: name.trim(),
      subcategories: processedSubcategories,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error creating category",
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, subcategories, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check for duplicate name if updating name
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        _id: { $ne: req.params.id },
        name: { $regex: `^${name.trim()}$`, $options: "i" },
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: "A category with this name already exists",
        });
      }
    }

    if (name) category.name = name.trim();
    if (subcategories !== undefined) {
      category.subcategories = Array.isArray(subcategories)
        ? subcategories.map(s => s.trim()).filter(s => s.length > 0)
        : [];
    }
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating category",
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category is in use
    const productCount = await Product.countDocuments({
      category: req.params.id,
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} product(s) assigned to it.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting category",
    });
  }
};

// Get category statistics
exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          isActive: 1,
          productCount: { $size: "$products" },
        },
      },
      {
        $sort: { name: 1 },
      },
    ]);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching category stats",
    });
  }
};
