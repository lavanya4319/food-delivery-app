const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Order = require("../models/Order");

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalRestaurants = await Restaurant.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    const deliveredOrders = await Order.countDocuments({
      status: "Delivered",
    });

    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalRestaurants,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Block / Unblock User
const toggleUserBlockStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin account cannot be blocked",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${
        user.isBlocked ? "blocked" : "unblocked"
      } successfully`,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Restaurants
const getAllRestaurantsAdmin = async (req, res) => {
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

// Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("restaurant", "restaurantName")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Assign restaurant to a manager account
const assignRestaurantToManager = async (req, res) => {
  try {
    const { managerId, restaurantId } = req.body;

    if (!managerId || !restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Manager ID and Restaurant ID are required",
      });
    }

    const manager = await User.findById(managerId);

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: "Manager not found",
      });
    }

    if (!['manager', 'restaurant'].includes(manager.role)) {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a restaurant manager",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    manager.assignedRestaurant = restaurantId;
    restaurant.owner = managerId;

    await Promise.all([manager.save(), restaurant.save()]);

    res.status(200).json({
      success: true,
      message: "Restaurant assigned to manager successfully",
      manager,
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

// Update Order Status (Admin)
const updateOrderStatusAdmin = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order,
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
  getDashboardStats,
  getAllUsers,
  toggleUserBlockStatus,
  getAllRestaurantsAdmin,
  getAllOrders,
  assignRestaurantToManager,
  updateOrderStatusAdmin,
};