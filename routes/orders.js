"use strict";

const express  = require("express");
const router   = express.Router();
const Order    = require("../models/Order");
const Session  = require("../models/Session");
const { sendOrderStatus } = require("../controllers/botController");

// ─────────────────────────────────────────────────────────────
// GET /orders — List all orders (newest first)
// ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { status, date, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (date) {
      const start = new Date(date);
      const end   = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.createdAt = { $gte: start, $lt: end };
    }
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /orders/:orderId — Single order details
// ─────────────────────────────────────────────────────────────
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PATCH /orders/:orderId/status — Update order status + notify customer
// Body: { status: "preparing" | "ready" | "out" | "delivered" | "cancelled", note: "" }
// ─────────────────────────────────────────────────────────────
router.patch("/:orderId/status", async (req, res) => {
  try {
    const { status, note = "" } = req.body;
    const VALID_STATUSES = ["confirmed", "preparing", "ready", "out", "delivered", "cancelled"];

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Use one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });

    order.status    = status;
    order.updatedAt = new Date();
    if (note) order.notes = note;
    await order.save();

    // Send WhatsApp notification to customer
    const customerPhone = "91" + order.phone.replace(/\D/g, "").slice(-10);
    await sendOrderStatus(customerPhone, order.orderId, status, note);

    console.log(`📦 Order ${order.orderId} → ${status} | Notified: ${customerPhone}`);
    res.json({ success: true, message: `Order ${status}. Customer notified.`, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /orders/stats/today — Today's summary
// ─────────────────────────────────────────────────────────────
router.get("/stats/today", async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const orders = await Order.find({ createdAt: { $gte: start } });
    const stats = {
      total:    orders.length,
      revenue:  orders.reduce((s, o) => s + (o.totalAmount || 0), 0),
      delivery: orders.filter(o => o.orderType === "delivery").length,
      takeaway: orders.filter(o => o.orderType === "takeaway").length,
      dine_in:  orders.filter(o => o.orderType === "dine_in").length,
      pending:  orders.filter(o => ["confirmed", "preparing"].includes(o.status)).length,
    };
    res.json({ success: true, date: start.toDateString(), stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
