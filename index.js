const { configDotenv } = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected MONGO");
  })
  .catch((err) => console.log("error", err));

app.use("/api/users", require('./routes/UsersRoutes'))


module.exports = app;