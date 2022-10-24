const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3500;

app.get("/", (req, res) => {
  res.send(`ToolsPiaShop server is running on port http://localhost:${port}`);
});

app.listen(port, (req, res) => {
  console.log("ToolsPiaShop Server is running on port", port);
});
