import { useNavigate } from "react-router-dom";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import "./RestaurantCard.css";

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  return (
    <div
      className="restaurant-card"
      onClick={() => navigate(`/menu/${restaurant._id}`)}
    >
      <div className="restaurant-image-container">
        <img
          src={
            restaurant.image && restaurant.image.trim() !== ""
              ? restaurant.image
              : "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
          }
          alt={restaurant.restaurantName}
        />

        <span className="status-badge">
          {restaurant.isOpen ? "🟢 Open" : "🔴 Closed"}
        </span>

        <span className="featured-badge">
          ⭐ Featured
        </span>

        <FavoriteButton restaurant={restaurant} />
      </div>

      <div className="restaurant-details">
        <h3>{restaurant.restaurantName}</h3>

        <p className="cuisine">
          {restaurant.cuisine.join(", ")}
        </p>

        <div className="restaurant-info">
          <span className="rating">
            ⭐ {restaurant.rating || 4.5}
          </span>

          <span>
            🚚 {restaurant.deliveryTime}
          </span>
        </div>

        <div className="restaurant-bottom">
          <span>
            💰 ₹{restaurant.minimumOrder} Min
          </span>
        </div>

        <p className="address">
          📍 {restaurant.address}
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;