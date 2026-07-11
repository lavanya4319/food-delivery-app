import "./RestaurantsTable.css";

const RestaurantsTable = ({ restaurants }) => {
  return (
    <div className="restaurants-table-container">
      <h2>🍽 All Restaurants</h2>

      <table className="restaurants-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Restaurant</th>
            <th>Owner</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Delivery</th>
            <th>Min Order</th>
          </tr>
        </thead>

        <tbody>
          {restaurants.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">
                No Restaurants Found
              </td>
            </tr>
          ) : (
            restaurants.map((restaurant) => (
              <tr key={restaurant._id}>
                <td>
                  <img
                    className="restaurant-image"
                    src={restaurant.image}
                    alt={restaurant.restaurantName}
                  />
                </td>

                <td>{restaurant.restaurantName}</td>

                <td>{restaurant.owner?.name}</td>

                <td>⭐ {restaurant.rating || 0}</td>

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

                <td>{restaurant.deliveryTime}</td>

                <td>₹ {restaurant.minimumOrder}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantsTable;