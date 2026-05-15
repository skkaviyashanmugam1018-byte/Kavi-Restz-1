const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/endpoint", async (req, res) => {
  try {
    const { flow_token, data, action } = req.body;

    // Meta ping check
    if (action === "ping") {
      return res.json({ data: { status: "active" } });
    }

    const phone = flow_token.split("_")[1];

    // Delivery screen → Payment screen
    if (data?.screen === "DELIVERY_SCREEN") {
      return res.json({
        screen: "PAYMENT_SCREEN",
        data: {
          name: data.name,
          address: data.address,
          pincode: data.pincode,
          phone_number: data.phone_number,
        },
      });
    }

    // Payment screen → Save order
    if (data?.screen === "PAYMENT_SCREEN") {
      const orderId = "KAV" + Date.now();

      const newOrder = new Order({
        orderId,
        phone,
        name: data.name,
        address: `${data.address}, ${data.pincode}`,
        paymentMethod: data.payment_method,
        status: "confirmed",
      });

      await newOrder.save();

      return res.json({
        screen: "SUCCESS",
        data: { order_id: orderId },
      });
    }

    res.json({ data: { status: "ok" } });
  } catch (err) {
    console.error("Flow Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;