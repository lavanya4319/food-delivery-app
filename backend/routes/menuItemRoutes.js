const express = require("express");

const {
  createMenuItem,
  getRestaurantMenu,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  toggleFeatured,
} = require("../controllers/menuItemController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const ROLES = require("../constants/roles");

const router = express.Router();

router.post("/", protect, authorizeRoles(ROLES.MANAGER, ROLES.RESTAURANT, ROLES.ADMIN), createMenuItem);

router.get("/restaurant/:restaurantId", getRestaurantMenu);

router.get("/:id", getMenuItemById);

router.put("/:id", protect, authorizeRoles(ROLES.MANAGER, ROLES.RESTAURANT, ROLES.ADMIN), updateMenuItem);

router.delete("/:id", protect, authorizeRoles(ROLES.MANAGER, ROLES.RESTAURANT, ROLES.ADMIN), deleteMenuItem);

router.patch("/:id/availability", protect, authorizeRoles(ROLES.MANAGER, ROLES.RESTAURANT, ROLES.ADMIN), toggleAvailability);

router.patch("/:id/featured", protect, authorizeRoles(ROLES.MANAGER, ROLES.RESTAURANT, ROLES.ADMIN), toggleFeatured);

module.exports = router;