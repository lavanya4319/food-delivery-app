import { useEffect, useMemo, useState } from "react";

import Hero from "../../components/Hero/Hero";
import CategorySection from "../../components/CategorySection/CategorySection";
import OfferBanner from "../../components/OfferBanner/OfferBanner";
import RestaurantCard from "../../components/RestaurantCard/RestaurantCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import CuisineFilter from "../../components/CuisineFilter/CuisineFilter";
import Footer from "../../components/Footer/Footer";

import { getRestaurants } from "../../api/restaurantApi";

import "./Home.css";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCuisine, setSelectedCuisine] =
    useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [showFavoritesOnly, setShowFavoritesOnly] =
    useState(false);
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await getRestaurants();

      if (data.success) {
        setRestaurants(data.restaurants);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = useMemo(() => {
    const favorites =
      JSON.parse(localStorage.getItem("favorites")) || [];

    return restaurants
      .filter((restaurant) => {
        const matchesSearch =
          restaurant.restaurantName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          restaurant.cuisine
            ?.join(" ")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          restaurant.address
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesCuisine =
          selectedCuisine === "All" ||
          restaurant.cuisine?.includes(selectedCuisine);

        const matchesFavorites =
          !showFavoritesOnly ||
          favorites.some((item) => item._id === restaurant._id);

        const matchesOpen =
          !showOpenOnly || restaurant.isOpen;

        return (
          matchesSearch &&
          matchesCuisine &&
          matchesFavorites &&
          matchesOpen
        );
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return (b.rating || 4.5) - (a.rating || 4.5);
        }

        if (sortBy === "delivery") {
          return (
            Number(a.deliveryTime?.split("-")[0]) -
            Number(b.deliveryTime?.split("-")[0])
          );
        }

        if (sortBy === "price") {
          return a.minimumOrder - b.minimumOrder;
        }

        return 0;
      });
  }, [
    restaurants,
    search,
    selectedCuisine,
    sortBy,
    showFavoritesOnly,
    showOpenOnly,
  ]);

  return (
    <>
      <Hero />

      <CategorySection />

      <OfferBanner />

      <section
        id="restaurants-section"
        className="home-page"
      >
        <div className="home-restaurant-section">
          <div className="home-restaurant-inner">
            <h2>🔥 Popular Restaurants</h2>

            <div className="discovery-panel">
              <div className="discovery-header">
                <p className="discovery-title">
                  Smart discovery powered by your preferences
                </p>
                <span className="discovery-summary">
                  {filteredRestaurants.length} result(s)
                </span>
              </div>

              <div className="discovery-controls">
                <SearchBar
                  search={search}
                  setSearch={setSearch}
                />

                <div className="control-group">
                  <label htmlFor="sortBy">Sort by</label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="rating">Top rated</option>
                    <option value="delivery">Fastest delivery</option>
                    <option value="price">Lowest minimum order</option>
                  </select>
                </div>

                <label className="toggle-pill">
                  <input
                    type="checkbox"
                    checked={showFavoritesOnly}
                    onChange={(e) =>
                      setShowFavoritesOnly(e.target.checked)
                    }
                  />
                  Favorites only
                </label>

                <label className="toggle-pill">
                  <input
                    type="checkbox"
                    checked={showOpenOnly}
                    onChange={(e) =>
                      setShowOpenOnly(e.target.checked)
                    }
                  />
                  Open now
                </label>
              </div>
            </div>

            <CuisineFilter
              selectedCuisine={selectedCuisine}
              setSelectedCuisine={setSelectedCuisine}
            />

            {loading ? (
              <h3 style={{ textAlign: "center" }}>
                Loading Restaurants...
              </h3>
            ) : filteredRestaurants.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "60px",
                }}
              >
                <h2>No restaurants found 🍽️</h2>
                <p>
                  Try a different search, cuisine, or discovery filter.
                </p>
              </div>
            ) : (
              <div className="results-grid">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;