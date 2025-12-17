const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("✅ Mongo connected");
}

// ROOT ROUTE
app.get("/api", async (req, res) => {
  await connectDB();
  res.send("API running 🚀");
});

// USERS ROUTE
app.use("/users", async (req, res, next) => {
  await connectDB();
  next();
});

app.use("/users", require("../routes/UsersRoutes"));

// Export as serverless handler
module.exports = (req, res) => {
  app(req, res);
};

