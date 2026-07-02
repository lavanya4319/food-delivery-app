import "./Hero.css";

const Hero = () => {
  const scrollToRestaurants = () => {
    const section = document.getElementById("restaurants-section");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="hero">

      <div className="hero-content">

        <h1>
          Delicious Food,
          <br />
          Delivered To Your Door 🚀
        </h1>

        <p>
          Order from the best restaurants in your city.
          Fresh meals, fast delivery, and unforgettable taste.
        </p>

        <div className="hero-buttons">

          <button
            className="primary-btn"
            onClick={scrollToRestaurants}
          >
            🍔 Order Now
          </button>

          <button
            className="secondary-btn"
            onClick={scrollToRestaurants}
          >
            Explore Restaurants
          </button>

        </div>

        <div className="hero-stats">

          <div>
            <h2>5+</h2>
            <span>Restaurants</span>
          </div>

          <div>
            <h2>30+</h2>
            <span>Dishes</span>
          </div>

          <div>
            <h2>100+</h2>
            <span>Happy Customers</span>
          </div>

        </div>

      </div>

      <div className="hero-image">

        <img
          src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
          alt="Food"
        />

      </div>

    </section>
  );
};

export default Hero;