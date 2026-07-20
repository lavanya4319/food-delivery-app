const express = require("express");

const {
  placeOrder,
  getUserOrders,
  getRestaurantOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const ROLES = require("../constants/roles");

const router = express.Router();

// CUSTOMER
router.post("/", protect, placeOrder);
router.get("/", protect, getUserOrders);

// RESTAURANT
router.get(
  "/restaurant/:restaurantId",
  protect,
  authorizeRoles(ROLES.MANAGER, ROLES.RESTAURANT, ROLES.ADMIN),
  getRestaurantOrders
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles(ROLES.MANAGER, ROLES.RESTAURANT, ROLES.ADMIN),
  updateOrderStatus
);

module.exports = router;