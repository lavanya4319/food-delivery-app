const Category = require("../models/Category");
const Restaurant = require("../models/Restaurant");

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name, description, restaurantId } = req.body;

    if (!name || !restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Category name and restaurant ID are required.",
      });
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    // Only restaurant owner or admin can create categories
    if (
      restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create categories for this restaurant.",
      });
    }

    // Prevent duplicate category names within the same restaurant
    const existingCategory = await Category.findOne({
      restaurant: restaurantId,
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists for this restaurant.",
      });
    }

    const category = await Category.create({
      name,
      description,
      restaurant: restaurantId,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Categories by Restaurant
const getCategoriesByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const categories = await Category.find({
      restaurant: restaurantId,
    }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    const category = await Category.findById(req.params.id).populate(
      "restaurant"
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Authorization
    if (
      category.restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this category.",
      });
    }

    // Check duplicate name
    if (name && name.toLowerCase() !== category.name.toLowerCase()) {
      const duplicate = await Category.findOne({
        restaurant: category.restaurant._id,
        name: { $regex: new RegExp(`^${name}$`, "i") },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Category name already exists.",
        });
      }

      category.name = name;
    }

    if (description !== undefined) {
      category.description = description;
    }

    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "restaurant"
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Authorization
    if (
      category.restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this category.",
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createCategory,
  getCategoriesByRestaurant,
  updateCategory,
  deleteCategory,
};