import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../api/cartApi";

import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
  });

  const [loading, setLoading] = useState(true);

  const [checkoutData, setCheckoutData] = useState({
    deliveryAddress: "",
    phone: "",
  });

  const fetchCart = async () => {
    setLoading(true);

    const response = await getCart();

    if (response.success) {
      setCart(response.cart);
    } else {
      toast.error(response.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increaseQuantity = async (item) => {
    const response = await updateCartItem(
      item.menuItem,
      item.quantity + 1
    );

    if (response.success) {
      setCart(response.cart);
    } else {
      toast.error(response.message);
    }
  };

  const decreaseQuantity = async (item) => {
    const response = await updateCartItem(
      item.menuItem,
      item.quantity - 1
    );

    if (response.success) {
      setCart(response.cart);
    } else {
      toast.error(response.message);
    }
  };

  const removeItem = async (menuItemId) => {
    const response = await removeCartItem(menuItemId);

    if (response.success) {
      toast.success("Item removed");
      setCart(response.cart);
    } else {
      toast.error(response.message);
    }
  };

  const handleClearCart = async () => {
    const response = await clearCart();

    if (response.success) {
      toast.success("Cart cleared");
      setCart(response.cart);
    } else {
      toast.error(response.message);
    }
  };

  const handleChange = (e) => {
    setCheckoutData({
      ...checkoutData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = () => {
    if (!checkoutData.deliveryAddress.trim()) {
      toast.error("Please enter delivery address.");
      return;
    }

    if (!checkoutData.phone.trim()) {
      toast.error("Please enter phone number.");
      return;
    }

    navigate("/payment", {
      state: checkoutData,
    });
  };

  if (loading) {
    return (
      <div className="cart-loading">
        Loading Cart...
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="cart-page">

        <h1>Your Cart</h1>

        {cart.items.length === 0 ? (
          <div className="empty-cart">

            <h2>🛒 Your Cart is Empty</h2>

            <p>Add delicious food from restaurants.</p>

          </div>
        ) : (
          <>
            <div className="cart-items">

              {cart.items.map((item) => (
                <div
                  key={item.menuItem}
                  className="cart-card"
                >
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"
                    }
                    alt={item.name}
                  />

                  <div className="cart-details">

                    <h3>{item.name}</h3>

                    <p>₹ {item.price}</p>

                    <div className="quantity-box">

                      <button
                        onClick={() =>
                          decreaseQuantity(item)
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          increaseQuantity(item)
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeItem(item.menuItem)
                    }
                  >
                    Remove
                  </button>

                </div>
              ))}

            </div>
                        <div className="cart-summary">

              <h2>Total : ₹ {cart.totalAmount}</h2>

              <input
                type="text"
                name="deliveryAddress"
                placeholder="Delivery Address"
                value={checkoutData.deliveryAddress}
                onChange={handleChange}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={checkoutData.phone}
                onChange={handleChange}
              />

              <button
                className="clear-btn"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>

              <button
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Proceed To Payment
              </button>

            </div>

          </>
        )}

      </div>

    </>
  );
};

export default Cart;