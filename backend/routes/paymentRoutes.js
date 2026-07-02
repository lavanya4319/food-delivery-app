const express = require("express");

const { processPayment } = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Process Payment
router.post("/process", protect, processPayment);

module.exports = router;