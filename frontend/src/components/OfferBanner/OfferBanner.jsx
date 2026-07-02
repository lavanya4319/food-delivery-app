import "./OfferBanner.css";

const OfferBanner = () => {
  return (
    <section className="offer-banner">
      <div className="offer-container">
        <div className="offer-content">
          <span className="offer-tag">
            🎉 Limited Time Offer
          </span>

          <h2>
            Get <span>30% OFF</span> on Your First Order
          </h2>

          <p>
            Order from your favourite restaurants and enjoy delicious meals
            delivered to your doorstep. Use the coupon below during checkout.
          </p>

          <div className="coupon-box">
            <span>Coupon Code</span>
            <h3>WELCOME30</h3>
          </div>

          <button className="offer-btn">
            Order Now
          </button>
        </div>

        <div className="offer-image">
          <div className="offer-circle">
            🍔🍕🥤
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;