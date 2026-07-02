const Cart = require("../models/Cart");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

// PLACE ORDER (CUSTOMER)
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      deliveryAddress,
      phone,
      paymentMethod,
    } = req.body;

    if (!deliveryAddress || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "Delivery address and phone are required",
      });
    }

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const firstMenuItemId = cart.items[0].menuItem;

    const menuItem = await MenuItem.findById(
      firstMenuItemId
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const restaurantId = menuItem.restaurant;

    const orderItems = cart.items.map((item) => ({
      menuItem: item.menuItem,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const finalPaymentMethod =
      paymentMethod || "COD";

    const paymentStatus =
      finalPaymentMethod === "COD"
        ? "Pending"
        : "Paid";

    const status =
      finalPaymentMethod === "COD"
        ? "Pending"
        : "Confirmed";

    const order = await Order.create({
      user: userId,
      restaurant: restaurantId,
      items: orderItems,
      deliveryAddress,
      phone,
      totalAmount: cart.totalAmount,
      paymentMethod: finalPaymentMethod,
      paymentStatus,
      status,
    });

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET USER ORDERS (CUSTOMER)
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("restaurant", "restaurantName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// RESTAURANT: GET ORDERS
const getRestaurantOrders = async (
  req,
  res
) => {
  try {
    const restaurantId =
      req.params.restaurantId;

    const orders = await Order.find({
      restaurant: restaurantId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// RESTAURANT: UPDATE ORDER STATUS
const updateOrderStatus = async (
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

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getRestaurantOrders,
  updateOrderStatus,
};