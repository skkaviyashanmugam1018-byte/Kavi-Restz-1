const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const webhookRoute = require("./routes/webhook");
const flowRoute = require("./routes/flow");

const app = express();
app.use(express.json());

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
app.use("/webhook", webhookRoute);
app.use("/flow", flowRoute);

app.get("/", (req, res) => res.send("🍛 Kavi Chettinadu Bot Running!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));