const express = require("express");

const {
  getDashboardStats,
  getAllUsers,
  getAllRestaurantsAdmin,
  getAllOrders,
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

router.get(
  "/restaurants",
  getAllRestaurantsAdmin
);

router.get(
  "/orders",
  getAllOrders
);

module.exports = router;