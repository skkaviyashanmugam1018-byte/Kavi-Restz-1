const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId:       { type: String, required: true, unique: true },
    phone:         { type: String, required: true },
    name:          { type: String, default: "Customer" },
    address:       { type: String, default: "" },
    items: [
      {
        name:     { type: String },
        price:    { type: Number },
        quantity: { type: Number },
      },
    ],
    totalAmount:   { type: Number, required: true },
    paymentMethod: { type: String, default: "COD" }, // ✅ No enum — accepts any string
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"],
      default: "confirmed",
    },
    orderType:     { type: String, default: "delivery" },
    notes:         { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);