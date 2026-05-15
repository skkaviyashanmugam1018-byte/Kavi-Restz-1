const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  state: { type: String, default: "WELCOME" },
  cart: { type: Array, default: [] },
  deliveryData: { type: Object, default: {} },
  deliveryStep: { type: String, default: null },
  lastActivity: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", sessionSchema);