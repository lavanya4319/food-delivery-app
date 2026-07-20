const express = require("express");

const {
  createRestaurant,
  getMyRestaurants,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus,
} = require("../controllers/restaurantController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const ROLES = require("../constants/roles");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles(ROLES.MANAGER, ROLES.RESTAURANT, ROLES.ADMIN),
  createRestaurant
);

router.get("/", getAllRestaurants);

router.get(
  "/my-restaurants",
  protect,
  authorizeRoles(ROLES.MANAGER, ROLES.RESTAURANT, ROLES.ADMIN),
  getMyRestaurants
);

router.get("/:id", getRestaurantById);

router.put(
  "/:id",
  protect,
  authorizeRoles(ROLES.MANAGER, ROLES.RESTAURANT, ROLES.ADMIN),
  updateRestaurant
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles(ROLES.MANAGER, ROLES.RESTAURANT, ROLES.ADMIN),
  toggleRestaurantStatus
);

router.delete(
  "/:id",
  protect,
  authorizeRoles(ROLES.MANAGER, ROLES.RESTAURANT, ROLES.ADMIN),
  deleteRestaurant
);

module.exports = router;