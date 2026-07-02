import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { placeOrder } from "../../api/orderApi";

import "./Payment.css";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const checkoutData = location.state;

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!checkoutData) {
      toast.error("Checkout information not found.");

      setTimeout(() => {
        navigate("/cart");
      }, 1500);
    }
  }, [checkoutData, navigate]);

  const handlePayment = async () => {
    if (!checkoutData) return;

    setLoading(true);

    const response = await placeOrder({
      ...checkoutData,
      paymentMethod,
    });

    setLoading(false);

    if (response.success) {
      toast.success("🎉 Payment Successful!");

      setTimeout(() => {
        navigate("/orders");
      }, 1800);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="payment-page">
        <div className="payment-card">
          <h1>💳 Payment</h1>

          <p>Select your preferred payment method.</p>

          <div className="payment-options">
            <label>
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash On Delivery
            </label>

            <label>
              <input
                type="radio"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI
            </label>

            <label>
              <input
                type="radio"
                value="Credit Card"
                checked={paymentMethod === "Credit Card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit Card
            </label>

            <label>
              <input
                type="radio"
                value="Debit Card"
                checked={paymentMethod === "Debit Card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Debit Card
            </label>
          </div>

          <button
            className="pay-btn"
            onClick={handlePayment}
            disabled={loading || !checkoutData}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Payment;