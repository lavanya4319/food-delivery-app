import { useEffect, useMemo, useState } from "react";

import Hero from "../../components/Hero/Hero";
import CategorySection from "../../components/CategorySection/CategorySection";
import OfferBanner from "../../components/OfferBanner/OfferBanner";
import RestaurantCard from "../../components/RestaurantCard/RestaurantCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import CuisineFilter from "../../components/CuisineFilter/CuisineFilter";
import Footer from "../../components/Footer/Footer";

import { getRestaurants } from "../../api/restaurantApi";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCuisine, setSelectedCuisine] =
    useState("All");

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
    return restaurants.filter((restaurant) => {
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

      return matchesSearch && matchesCuisine;
    });
  }, [
    restaurants,
    search,
    selectedCuisine,
  ]);

  return (
    <>
      <Hero />

      <CategorySection />

      <OfferBanner />

      <section
        id="restaurants-section"
        style={{
          background: "#fafafa",
          padding: "80px 8%",
        }}
      >
        <div
          style={{
            maxWidth: "1300px",
            margin: "auto",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "38px",
              marginBottom: "20px",
              color: "#1f2937",
            }}
          >
            🔥 Popular Restaurants
          </h2>

          <SearchBar
            search={search}
            setSearch={setSearch}
          />

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
                Try a different search or cuisine.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(320px,1fr))",
                gap: "30px",
              }}
            >
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;