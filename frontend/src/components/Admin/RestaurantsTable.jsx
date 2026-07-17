import { useState } from "react";
import { toast } from "react-toastify";

import {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus,
  getMenuByRestaurant,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../../api/adminApi";
import {
  getCategoriesByRestaurant,
  createCategory,
} from "../../api/categoryApi";

import "./RestaurantsTable.css";

const emptyRestaurantForm = {
  restaurantName: "",
  description: "",
  cuisine: "",
  address: "",
  phone: "",
  email: "",
  openingTime: "09:00",
  closingTime: "22:00",
  deliveryTime: "30-45 mins",
  minimumOrder: 100,
  image: "",
  rating: 4.5,
};

const emptyMenuForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  preparationTime: "20 mins",
  isVeg: true,
};

const RestaurantsTable = ({
  restaurants,
  refreshRestaurants,
}) => {
  const [loadingId, setLoadingId] =
    useState(null);
  const [showForm, setShowForm] =
    useState(false);
  const [editingRestaurantId, setEditingRestaurantId] =
    useState(null);
  const [restaurantForm, setRestaurantForm] =
    useState(emptyRestaurantForm);
  const [menuManagerRestaurantId, setMenuManagerRestaurantId] =
    useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [menuForm, setMenuForm] =
    useState(emptyMenuForm);
  const [menuLoading, setMenuLoading] =
    useState(false);

  const resetRestaurantForm = () => {
    setRestaurantForm(emptyRestaurantForm);
    setEditingRestaurantId(null);
    setShowForm(false);
  };

  const handleRestaurantFieldChange = (e) => {
    const { name, value, type, checked } = e.target;

    setRestaurantForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...restaurantForm,
      cuisine: restaurantForm.cuisine
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      minimumOrder: Number(restaurantForm.minimumOrder),
      rating: Number(restaurantForm.rating),
    };

    const response = editingRestaurantId
      ? await updateRestaurant(editingRestaurantId, payload)
      : await createRestaurant(payload);

    if (response.success) {
      toast.success(response.message);
      resetRestaurantForm();
      refreshRestaurants();
    } else {
      toast.error(response.message);
    }
  };

  const handleEditRestaurant = (restaurant) => {
    setEditingRestaurantId(restaurant._id);
    setRestaurantForm({
      restaurantName: restaurant.restaurantName,
      description: restaurant.description,
      cuisine: restaurant.cuisine?.join(", ") || "",
      address: restaurant.address,
      phone: restaurant.phone,
      email: restaurant.email,
      openingTime: restaurant.openingTime,
      closingTime: restaurant.closingTime,
      deliveryTime: restaurant.deliveryTime,
      minimumOrder: restaurant.minimumOrder,
      image: restaurant.image || "",
      rating: restaurant.rating || 4.5,
    });
    setShowForm(true);
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    const confirmAction = window.confirm(
      "Are you sure you want to delete this restaurant?"
    );

    if (!confirmAction) return;

    const response = await deleteRestaurant(restaurantId);

    if (response.success) {
      toast.success(response.message);
      refreshRestaurants();
    } else {
      toast.error(response.message);
    }
  };

  const handleToggleStatus = async (
    restaurantId,
    isOpen
  ) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${
        isOpen ? "close" : "open"
      } this restaurant?`
    );

    if (!confirmAction) return;

    setLoadingId(restaurantId);

    const response =
      await toggleRestaurantStatus(
        restaurantId
      );

    if (response.success) {
      toast.success(response.message);
      refreshRestaurants();
    } else {
      toast.error(response.message);
    }

    setLoadingId(null);
  };

  const openMenuManager = async (restaurant) => {
    if (menuManagerRestaurantId === restaurant._id) {
      setMenuManagerRestaurantId(null);
      return;
    }

    setMenuManagerRestaurantId(restaurant._id);
    setMenuLoading(true);

    const menuResponse = await getMenuByRestaurant(
      restaurant._id
    );

    if (menuResponse.success) {
      setMenuItems(menuResponse.menuItems || []);
    }

    setMenuLoading(false);
  };

  const ensureRestaurantCategory = async (restaurant) => {
    const categoryResponse = await getCategoriesByRestaurant(
      restaurant._id
    );

    if (
      categoryResponse.success &&
      categoryResponse.categories?.length > 0
    ) {
      return categoryResponse.categories[0]._id;
    }

    const defaultCategoryName =
      restaurant.cuisine?.[0] || "General";

    const createResponse = await createCategory({
      name: defaultCategoryName,
      description: `Default ${defaultCategoryName} category`,
      restaurantId: restaurant._id,
    });

    if (createResponse.success) {
      return createResponse.category._id;
    }

    throw new Error(
      createResponse.message ||
        "Unable to create a default category for this restaurant"
    );
  };

  const handleCreateMenuItem = async (restaurant) => {
    try {
      setMenuLoading(true);

      const categoryId = await ensureRestaurantCategory(
        restaurant
      );

      const payload = {
        ...menuForm,
        price: Number(menuForm.price),
        restaurantId: restaurant._id,
        categoryId,
      };

      const response = await createMenuItem(payload);

      if (response.success) {
        toast.success(response.message);
        setMenuForm(emptyMenuForm);
        const refreshed = await getMenuByRestaurant(
          restaurant._id
        );
        if (refreshed.success) {
          setMenuItems(refreshed.menuItems || []);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleDeleteMenuItem = async (
    menuItemId,
    restaurantId
  ) => {
    const response = await deleteMenuItem(menuItemId);

    if (response.success) {
      toast.success(response.message);
      const refreshed = await getMenuByRestaurant(restaurantId);
      if (refreshed.success) {
        setMenuItems(refreshed.menuItems || []);
      }
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="restaurants-table-card">

      <div className="table-header">
        <h2>🍽 Restaurants Management</h2>

        <div className="header-actions">
          <span>
            {restaurants.length} Restaurants
          </span>
          <button
            className="primary-btn"
            onClick={() => {
              resetRestaurantForm();
              setShowForm(true);
            }}
          >
            + Add Restaurant
          </button>
        </div>
      </div>

      {showForm && (
        <form
          className="admin-form"
          onSubmit={handleRestaurantSubmit}
        >
          <div className="form-grid">
            <label className="form-field">
              Restaurant Name
              <input
                name="restaurantName"
                value={restaurantForm.restaurantName}
                onChange={handleRestaurantFieldChange}
                required
              />
            </label>

            <label className="form-field">
              Email
              <input
                type="email"
                name="email"
                value={restaurantForm.email}
                onChange={handleRestaurantFieldChange}
                required
              />
            </label>

            <label className="form-field">
              Phone
              <input
                name="phone"
                value={restaurantForm.phone}
                onChange={handleRestaurantFieldChange}
                required
              />
            </label>

            <label className="form-field">
              Cuisine
              <input
                name="cuisine"
                value={restaurantForm.cuisine}
                onChange={handleRestaurantFieldChange}
                placeholder="Italian, Pizza"
                required
              />
            </label>

            <label className="form-field">
              Address
              <input
                name="address"
                value={restaurantForm.address}
                onChange={handleRestaurantFieldChange}
                required
              />
            </label>

            <label className="form-field">
              Image URL
              <input
                name="image"
                value={restaurantForm.image}
                onChange={handleRestaurantFieldChange}
              />
            </label>

            <label className="form-field">
              Opening Time
              <input
                name="openingTime"
                value={restaurantForm.openingTime}
                onChange={handleRestaurantFieldChange}
                required
              />
            </label>

            <label className="form-field">
              Closing Time
              <input
                name="closingTime"
                value={restaurantForm.closingTime}
                onChange={handleRestaurantFieldChange}
                required
              />
            </label>

            <label className="form-field">
              Delivery Time
              <input
                name="deliveryTime"
                value={restaurantForm.deliveryTime}
                onChange={handleRestaurantFieldChange}
                required
              />
            </label>

            <label className="form-field">
              Minimum Order
              <input
                type="number"
                name="minimumOrder"
                value={restaurantForm.minimumOrder}
                onChange={handleRestaurantFieldChange}
                required
              />
            </label>

            <label className="form-field">
              Rating
              <input
                type="number"
                step="0.1"
                name="rating"
                value={restaurantForm.rating}
                onChange={handleRestaurantFieldChange}
              />
            </label>

            <label className="form-field full-width">
              Description
              <textarea
                name="description"
                value={restaurantForm.description}
                onChange={handleRestaurantFieldChange}
                rows="3"
                required
              />
            </label>
          </div>

          <div className="form-actions">
            <button className="primary-btn" type="submit">
              {editingRestaurantId
                ? "Save Changes"
                : "Create Restaurant"}
            </button>
            <button
              className="secondary-btn"
              type="button"
              onClick={resetRestaurantForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-responsive">

        <table className="restaurants-table">

          <thead>
            <tr>
              <th>Restaurant</th>
              <th>Owner</th>
              <th>Cuisine</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {restaurants.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="no-data"
                >
                  No Restaurants Found
                </td>
              </tr>
            ) : (
              restaurants.map(
                (restaurant) => (
                  <>
                    <tr
                      key={restaurant._id}
                    >
                      <td>

                        <div className="restaurant-info">

                          <img
                            src={
                              restaurant.image ||
                              "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
                            }
                            alt={
                              restaurant.restaurantName
                            }
                          />

                          <div>

                            <strong>
                              {
                                restaurant.restaurantName
                              }
                            </strong>

                            <p>
                              {
                                restaurant.address
                              }
                            </p>

                          </div>

                        </div>

                      </td>

                      <td>
                        {
                          restaurant.owner
                            ?.name
                        }
                      </td>

                      <td>
                        {restaurant.cuisine?.join(
                          ", "
                        )}
                      </td>

                      <td>

                        <span className="rating-badge">
                          ⭐ {restaurant.rating}
                        </span>

                      </td>

                      <td>

                        <span
                          className={
                            restaurant.isOpen
                              ? "status open"
                              : "status closed"
                          }
                        >
                          {restaurant.isOpen
                            ? "Open"
                            : "Closed"}
                        </span>

                      </td>

                      <td>
                        <div className="action-stack">
                          <button
                            className={
                              restaurant.isOpen
                                ? "close-btn"
                                : "open-btn"
                            }
                            disabled={
                              loadingId ===
                              restaurant._id
                            }
                            onClick={() =>
                              handleToggleStatus(
                                restaurant._id,
                                restaurant.isOpen
                              )
                            }
                          >
                            {loadingId ===
                            restaurant._id
                              ? "Updating..."
                              : restaurant.isOpen
                              ? "Close"
                              : "Open"}
                          </button>

                          <button
                            className="secondary-btn"
                            onClick={() =>
                              handleEditRestaurant(
                                restaurant
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="secondary-btn"
                            onClick={() =>
                              openMenuManager(
                                restaurant
                              )
                            }
                          >
                            {menuManagerRestaurantId ===
                            restaurant._id
                              ? "Hide Menu"
                              : "Manage Menu"}
                          </button>

                          <button
                            className="danger-btn"
                            onClick={() =>
                              handleDeleteRestaurant(
                                restaurant._id
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>

                    {menuManagerRestaurantId ===
                      restaurant._id && (
                      <tr>
                        <td colSpan="6">
                          <div className="menu-manager">
                            <div className="menu-manager-header">
                              <h3>
                                Menu for {restaurant.restaurantName}
                              </h3>
                            </div>

                            <div className="menu-manager-form">
                              <input
                                placeholder="Dish name"
                                value={menuForm.name}
                                onChange={(e) =>
                                  setMenuForm((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                              />

                              <input
                                placeholder="Description"
                                value={menuForm.description}
                                onChange={(e) =>
                                  setMenuForm((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                  }))
                                }
                              />

                              <input
                                type="number"
                                placeholder="Price"
                                value={menuForm.price}
                                onChange={(e) =>
                                  setMenuForm((prev) => ({
                                    ...prev,
                                    price: e.target.value,
                                  }))
                                }
                              />

                              <input
                                placeholder="Image URL"
                                value={menuForm.image}
                                onChange={(e) =>
                                  setMenuForm((prev) => ({
                                    ...prev,
                                    image: e.target.value,
                                  }))
                                }
                              />

                              <button
                                className="primary-btn"
                                onClick={() =>
                                  handleCreateMenuItem(
                                    restaurant
                                  )
                                }
                                disabled={menuLoading}
                              >
                                {menuLoading
                                  ? "Adding..."
                                  : "Add Menu Item"}
                              </button>
                            </div>

                            {menuItems.length === 0 ? (
                              <p className="no-menu-items">
                                No menu items added yet.
                              </p>
                            ) : (
                              <div className="menu-list">
                                {menuItems.map((item) => (
                                  <div
                                    key={item._id}
                                    className="menu-list-item"
                                  >
                                    <div>
                                      <strong>
                                        {item.name}
                                      </strong>
                                      <p>
                                        {item.description}
                                      </p>
                                      <small>
                                        ₹{item.price} • {item.preparationTime}
                                      </small>
                                    </div>

                                    <button
                                      className="danger-btn"
                                      onClick={() =>
                                        handleDeleteMenuItem(
                                          item._id,
                                          restaurant._id
                                        )
                                      }
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RestaurantsTable;