const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

//code starts from atlas starts here

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cqegi56.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    //alls of collections are here
    const userCollection = client.db("gymFitnessDB").collection("users");
    const galleryCollection = client.db("gymFitnessDB").collection("gallery");
    const subscriberCollection = client
      .db("gymFitnessDB")
      .collection("subscribers");

    //user related api--posting user data
    app.post("/users", async (req, res) => {
      const user = req.body;
      //inert email if the user does not exist
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exist", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    //getting all user for showing in the dashboard
    app.get("/users", async (req, res) => {
      const result = await subscriberCollection.find().toArray();
      res.send(result);
    });

    //getting galleries items
    app.get("/gallery", async (req, res) => {
      const cursor = galleryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //posting all subscribers
    app.post("/subscribers", async (req, res) => {
      const subscriber = req.body;
      //inert email if the user does not exist
      const query = { email: subscriber.email }
      const existingSubscriber = await subscriberCollection.findOne(query);
      if (existingSubscriber) {
        return res.send({
          message: "Subscription already exist",
          insertedId: null,
        });
      }
      const result = await subscriberCollection.insertOne(subscriber);
      res.send(result);
    });

    //getting all subscriber for showing on dashboard page
    app.get("/subscribers", async (req, res) => {
      const cursor = subscriberCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
//code starts from atlas starts here

app.get("/", (req, res) => {
  res.send("The Gym server is running");
});
app.listen(port, () => {
  console.log(`Fitness Tracker is running on port: ${port}`);
});