import { useEffect, useState } from "react";
import "./FavoriteButton.css";

const FavoriteButton = ({ restaurant }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites =
      JSON.parse(localStorage.getItem("favorites")) || [];

    const exists = favorites.some(
      (item) => item._id === restaurant._id
    );

    setIsFavorite(exists);
  }, [restaurant]);

  const toggleFavorite = (e) => {
    e.stopPropagation();

    let favorites =
      JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      favorites = favorites.filter(
        (item) => item._id !== restaurant._id
      );
    } else {
      favorites.push(restaurant);
    }

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );

    setIsFavorite(!isFavorite);
  };

  return (
    <button
      className={`favorite-btn ${
        isFavorite ? "active" : ""
      }`}
      onClick={toggleFavorite}
      title={
        isFavorite
          ? "Remove from Favorites"
          : "Add to Favorites"
      }
    >
      {isFavorite ? "❤️" : "🤍"}
    </button>
  );
};

export default FavoriteButton;