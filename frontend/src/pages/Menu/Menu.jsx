import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getMenuByRestaurant } from "../../api/menuApi";
import { addToCart } from "../../api/cartApi";

import "./Menu.css";

const Menu = () => {
  const { id } = useParams();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      const response = await getMenuByRestaurant(id);

      if (response.success) {
        setMenuItems(response.menuItems);
      } else {
        toast.error("Failed to load menu");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMenu();
  }, [id]);

  const handleAddToCart = async (menuItemId) => {
    const response = await addToCart(menuItemId, 1);

    if (response.success) {
      toast.success("Item added to cart");
    } else {
      toast.error(response.message);
    }
  };

  if (loading) {
    return (
      <div className="menu-loading">
        Loading Menu...
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="menu-page">

        <h1 className="menu-title">
          🍕 Restaurant Menu
        </h1>

        {menuItems.length === 0 ? (
          <div className="empty-menu">
            <h2>No Menu Items Found</h2>
            <p>This restaurant hasn't added any food yet.</p>
          </div>
        ) : (
          <div className="menu-grid">

            {menuItems.map((item) => (
              <div
                className="menu-card"
                key={item._id}
              >
                <img
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"
                  }
                  alt={item.name}
                />

                <div className="menu-content">

                  <div className="menu-top">

                    <h2>{item.name}</h2>

                    <span
                      className={
                        item.isVeg
                          ? "veg"
                          : "nonveg"
                      }
                    >
                      {item.isVeg
                        ? "🌱 Veg"
                        : "🍗 Non-Veg"}
                    </span>

                  </div>

                  <p className="description">
                    {item.description}
                  </p>

                  <div className="price-row">

                    <h3>
                      ₹ {item.price}
                    </h3>

                    {item.isFeatured && (
                      <span className="featured">
                        ⭐ Featured
                      </span>
                    )}

                  </div>

                  <p className="prep-time">
                    ⏱ {item.preparationTime}
                  </p>

                  <button
                    className="add-cart-btn"
                    onClick={() =>
                      handleAddToCart(item._id)
                    }
                  >
                    Add To Cart
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </>
  );
};

export default Menu;