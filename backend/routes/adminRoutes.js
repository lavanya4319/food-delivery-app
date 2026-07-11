const express = require("express");

const {
  getDashboardStats,
  getAllUsers,
  toggleUserBlockStatus,
  getAllRestaurantsAdmin,
  getAllOrders,
  updateOrderStatusAdmin,
} = require("../controllers/adminController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(
  protect,
  authorizeRoles("admin")
);

router.get(
  "/dashboard",
  getDashboardStats
);

router.get(
  "/users",
  getAllUsers
);

router.patch(
  "/users/:id/block",
  toggleUserBlockStatus
);

router.get(
  "/restaurants",
  getAllRestaurantsAdmin
);

router.get(
  "/orders",
  getAllOrders
);

router.patch(
  "/orders/:id/status",
  updateOrderStatusAdmin
);

module.exports = router;