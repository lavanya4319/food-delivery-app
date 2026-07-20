const Restaurant = require("../models/Restaurant");

const createRestaurant = async (req, res) => {
  try {
    const {
      restaurantName,
      description,
      cuisine,
      address,
      phone,
      email,
      openingTime,
      closingTime,
      deliveryTime,
      minimumOrder,
      image,
      rating,
    } = req.body;

    const isManagerScopedRole =
      req.user.role === "manager" || req.user.role === "restaurant";

    if (isManagerScopedRole) {
      const existingOwnedRestaurant = await Restaurant.findOne({
        owner: req.user.id,
      });

      if (existingOwnedRestaurant) {
        return res.status(403).json({
          success: false,
          message:
            "Restaurant manager can manage only one assigned restaurant.",
        });
      }
    }

    if (
      !restaurantName ||
      !description ||
      !cuisine ||
      !address ||
      !phone ||
      !email ||
      !openingTime ||
      !closingTime ||
      !deliveryTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const restaurant = await Restaurant.create({
      restaurantName,
      description,
      cuisine: Array.isArray(cuisine)
        ? cuisine
        : cuisine.split(",").map((item) => item.trim()),
      address,
      phone,
      email,
      openingTime,
      closingTime,
      deliveryTime,
      minimumOrder,
      image: image || "",
      rating: rating || 4.5,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getMyRestaurants = async (req, res) => {
  try {
    const isManagerScopedRole =
      req.user.role === "manager" || req.user.role === "restaurant";

    let scopedRestaurants = [];

    if (isManagerScopedRole && req.user.assignedRestaurant) {
      const assignedRestaurant = await Restaurant.findById(req.user.assignedRestaurant);

      if (assignedRestaurant) {
        scopedRestaurants = [assignedRestaurant];
      }
    } else {
      scopedRestaurants = await Restaurant.find({
        owner: req.user.id,
      }).sort({ createdAt: -1 });
    }

    if (isManagerScopedRole && scopedRestaurants.length === 0) {
      scopedRestaurants = await Restaurant.find({
        owner: req.user.id,
      }).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: scopedRestaurants.length,
      restaurants: scopedRestaurants,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate(
      "owner",
      "name email"
    );

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

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
        message: "You are not authorized to update this restaurant",
      });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        cuisine: req.body.cuisine
          ? Array.isArray(req.body.cuisine)
            ? req.body.cuisine
            : req.body.cuisine.split(",").map((item) => item.trim())
          : restaurant.cuisine,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

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
        message: "You are not authorized to delete this restaurant",
      });
    }

    await restaurant.deleteOne();

    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const toggleRestaurantStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

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
        message: "You are not authorized",
      });
    }

    restaurant.isOpen = !restaurant.isOpen;

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: `Restaurant is now ${
        restaurant.isOpen ? "Open" : "Closed"
      }`,
      restaurant,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createRestaurant,
  getMyRestaurants,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus,
};