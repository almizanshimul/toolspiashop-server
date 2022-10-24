const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3500;

app.get("/", (req, res) => {
  res.send(`ToolsPiaShop server is running on port http://localhost:${port}`);
});

// mongo DB connect message 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hobaswv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
  try {
    await client.connect();
    // console.log("Database Connected");
    const toolsCollection = client.db("ToolsPiaShop").collection("tools");
   
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log("ToolsPiaShop Server is running on port", port);
});
