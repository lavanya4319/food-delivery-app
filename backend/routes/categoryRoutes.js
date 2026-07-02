const express = require("express");

const {
  createCategory,
  getCategoriesByRestaurant,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const ROLES = require("../constants/roles");

const router = express.Router();

// Create Category
router.post(
  "/",
  protect,
  authorizeRoles(ROLES.RESTAURANT, ROLES.ADMIN),
  createCategory
);

// Get Categories By Restaurant
router.get(
  "/restaurant/:restaurantId",
  getCategoriesByRestaurant
);

// Update Category
router.put(
  "/:id",
  protect,
  authorizeRoles(ROLES.RESTAURANT, ROLES.ADMIN),
  updateCategory
);

// Delete Category
router.delete(
  "/:id",
  protect,
  authorizeRoles(ROLES.RESTAURANT, ROLES.ADMIN),
  deleteCategory
);

module.exports = router;