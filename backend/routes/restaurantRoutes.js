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

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("restaurant", "admin"),
  createRestaurant
);

router.get("/", getAllRestaurants);

router.get(
  "/my-restaurants",
  protect,
  authorizeRoles("restaurant", "admin"),
  getMyRestaurants
);

router.get("/:id", getRestaurantById);

router.put(
  "/:id",
  protect,
  authorizeRoles("restaurant", "admin"),
  updateRestaurant
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("restaurant", "admin"),
  toggleRestaurantStatus
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("restaurant", "admin"),
  deleteRestaurant
);

module.exports = router;