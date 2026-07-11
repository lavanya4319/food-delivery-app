import { useState } from "react";
import { toast } from "react-toastify";

import {
  toggleRestaurantStatus,
} from "../../api/adminApi";

import "./RestaurantsTable.css";

const RestaurantsTable = ({
  restaurants,
  refreshRestaurants,
}) => {
  const [loadingId, setLoadingId] =
    useState(null);

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

  return (
    <div className="restaurants-table-card">

      <div className="table-header">
        <h2>🍽 Restaurants Management</h2>

        <span>
          {restaurants.length} Restaurants
        </span>
      </div>

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
                  <tr
                    key={restaurant._id}
                  >
                    <td>

                      <div className="restaurant-info">

                        <img
                          src={
                            restaurant.image
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

                    </td>

                  </tr>
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