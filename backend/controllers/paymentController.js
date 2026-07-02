const Order = require("../models/Order");

// SIMULATE PAYMENT
const processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // If COD → instantly success
    if (paymentMethod === "COD") {
      order.paymentMethod = "COD";
      order.paymentStatus = "Paid";
      order.status = "Confirmed";

      await order.save();

      return res.status(200).json({
        success: true,
        message: "COD payment successful",
        order,
      });
    }

    // ONLINE PAYMENT (SIMULATED)
    const isSuccess = Math.random() > 0.2; // 80% success rate simulation

    if (!isSuccess) {
      order.paymentMethod = "Online";
      order.paymentStatus = "Failed";

      await order.save();

      return res.status(400).json({
        success: false,
        message: "Payment failed. Try again.",
      });
    }

    order.paymentMethod = "Online";
    order.paymentStatus = "Paid";
    order.status = "Confirmed";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment successful",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  processPayment,
};