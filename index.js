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



// Verify JWT 
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send({ message: "Unauthorized Access" });
  } else {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_TOKEN, (error, decoded) => {
      if (error) {
        res.status(403).send({ message: "Forbidden Access" });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
};


async function run() {
  try {
    await client.connect();
    // console.log("Database Connected");
    const toolsCollection = client.db("ToolsPiaShop").collection("tools");

    // get all tools 
    app.get("/tools", async (req, res) => {
      const tools = await toolsCollection.find({}).toArray();
      res.send(tools);
    });

    app.get("/toolsByLimit", async (req, res) => {
      const limit = req.query.limit;
      const tools = await toolsCollection
        .find({})
        .limit(parseInt(limit))
        .toArray();
      res.send(tools);
    });

    app.get("/tools/:id", async (req, res) => {
      const id = req.params.id;
      const tool = await toolsCollection.findOne({ _id: ObjectId(id) });
      res.send(tool);
    });

    
    app.post("/tools", verifyJWT, async (req, res) => {
      const tool = req.body;
      const result = await toolsCollection.insertOne(tool);
      res.send(result);
    });
    
    app.delete('/tools/:id', async(req, res) => {
      const id = req.params.id;
      const result = await toolsCollection.deleteOne({_id: ObjectId(id)});
      res.send(result);
    })

    
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log("ToolsPiaShop Server is running on port", port);
});
