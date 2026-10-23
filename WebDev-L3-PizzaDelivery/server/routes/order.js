
const express = require("express");
const router = express.Router();

const Order = require("../models/orderModel");
const { authenticateToken } = require("../middleware/auth");

// Create an order for the logged-in user
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      orderAmount,
    } = req.body;

    if (
      !Array.isArray(orderItems) ||
      orderItems.length === 0 ||
      !shippingAddress?.street?.trim() ||
      !shippingAddress?.city?.trim() ||
      !shippingAddress?.country?.trim() ||
      shippingAddress?.pincode == null ||
      String(shippingAddress.pincode).trim() === "" ||
      !Number.isFinite(Number(orderAmount)) ||
      Number(orderAmount) <= 0
    ) {
      return res.status(400).json({
        message: "Please provide valid order details.",
      });
    }

    const order = await Order.create({
      name: req.user.name,
      email: req.user.email,
      userId: String(req.user._id),
      orderItems,
      shippingAddress: {
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        country: shippingAddress.country.trim(),
        pincode: Number(shippingAddress.pincode),
      },
      orderAmount: Number(orderAmount),
      transactionId: `PENDING-${Date.now()}`,
      status: "Placed",
    });

    return res.status(201).json({
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error.message);

    return res.status(500).json({
      message: "Unable to create order.",
    });
  }
});

module.exports = router;
