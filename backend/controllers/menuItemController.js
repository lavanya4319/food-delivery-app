const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");
const Category = require("../models/Category");

// CREATE MENU ITEM
const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      restaurantId,
      image,
      isVeg,
      preparationTime,
      isFeatured,
    } = req.body;

    if (!name || !description || !price || !categoryId || !restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (
      restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const exists = await MenuItem.findOne({
      restaurant: restaurantId,
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Menu item already exists",
      });
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      image: image || "",
      category: categoryId,
      restaurant: restaurantId,
      isVeg: isVeg ?? true,
      preparationTime: preparationTime || "20 mins",
      isFeatured: isFeatured ?? false,
    });

    return res.status(201).json({
      success: true,
      message: "Menu item created",
      menuItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET RESTAURANT MENU
const getRestaurantMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const menu = await MenuItem.find({ restaurant: restaurantId })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: menu.length,
      menuItems: menu,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET SINGLE ITEM
const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id)
      .populate("restaurant", "restaurantName")
      .populate("category", "name");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      menuItem: item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPDATE MENU ITEM
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const restaurant = await Restaurant.findById(item.restaurant);

    if (
      restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    Object.assign(item, req.body);

    await item.save();

    return res.status(200).json({
      success: true,
      message: "Menu item updated",
      menuItem: item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE MENU ITEM
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const restaurant = await Restaurant.findById(item.restaurant);

    if (
      restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Menu item deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// TOGGLE AVAILABILITY
const toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    item.isAvailable = !item.isAvailable;

    await item.save();

    return res.status(200).json({
      success: true,
      message: "Availability updated",
      isAvailable: item.isAvailable,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// TOGGLE FEATURED
const toggleFeatured = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    item.isFeatured = !item.isFeatured;

    await item.save();

    return res.status(200).json({
      success: true,
      message: "Featured status updated",
      isFeatured: item.isFeatured,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createMenuItem,
  getRestaurantMenu,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  toggleFeatured,
};