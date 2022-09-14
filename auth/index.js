const express = require('express');
const cors = require("cors");
const mongodb = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3003;
const CONN_STR = process.env.CONN_STR || "mongodb+srv://blog:blog@cluster0.2grje.mongodb.net/test";
const DB = "data-metamorphosis";

const getMongoDB = async () => {
  const MongoClient = mongodb.MongoClient;
  let logConnString = CONN_STR.replace(/\/(.*:.*)@/, "//----:----@");
  console.log(`Connecting to database using ${logConnString}`);
  let db;
  try {
    const client = await MongoClient.connect(CONN_STR, { useNewUrlParser: true, useUnifiedTopology: true });
    db = await client.db(DB);
    DB_CONNECTED = true;  
  } catch (e) {
    console.log(e.toString());
  }
  return db;
}
let db;
getMongoDB().then(_db => db = _db);

app.get("/login/:id", async (req, res) => {
  // Login with id to retrieve user data
  let user = await db.collection("game").findOne({_id: mongodb.ObjectId(req.params.id)});
  console.log(`User ${user.name} logged back in.`);
  res.send(user).status(200);
});

app.get("/register/:name/:colour", async (req, res) => {
  // Create new account
  let { colour, name } = req.params;
  let score = 0;
  let result = await db.collection("game").insertOne({ colour, name, score });
  let id = result.insertedId.toString();
  res.send({colour, name, score, id}).status(200);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});