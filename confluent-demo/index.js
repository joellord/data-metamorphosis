const { Kafka } = require('kafkajs')
const express = require("express");
const expressWs = require('express-ws')
const mongodb = require("mongodb");

const KAFKA_BROKER = process.env.KAFKA_BROKER;
const KAFKA_KEY = process.env.KAFKA_KEY;
const KAFKA_SECRET = process.env.KAFKA_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

if (!KAFKA_BROKER || !KAFKA_KEY || !KAFKA_SECRET || !MONGODB_URI) process.exit(1);

const TOPIC_INCOMING = process.env.TOPIC_INCOMING || "incomingMessage";
const TOPIC_PROCESSED = process.env.TOPIC_PROCESSED || "demo.datameta.processedMessage";
const COLLECTION_INCOMING = process.env.COLLECTION_INCOMING || "incomingMessage";
const COLLECTION_PROCESSED = process.env.COLLECTION_PROCESSED || "processedMessage";
const PORT = process.env.PORT || 5000;
const app = express();

let eWs = expressWs(app);

const getMongoDB = async () => {
  const MongoClient = mongodb.MongoClient;
  let logConnString = MONGODB_URI.replace(/\/(.*:.*)@/, "//----:----@");
  console.log(`Connecting to database using ${logConnString}`);
  let db;
  try {
    const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    db = await client.db("datameta");
    DB_CONNECTED = true;  
  } catch (e) {
    console.log(e.toString());
  }
  return db;
}

getMongoDB().then(db => {
  let incomingChangeStream = db.collection(COLLECTION_INCOMING).watch()
  incomingChangeStream.on("change", e => {
    var ws = eWs.getWss('/echo');
    let message = {
      type: "mdbIncoming",
      message: `New document in incomingMessages with _id **${e.fullDocument._id.toString().substr(-4)} for name ${e.fullDocument.name}`
    };
    console.log(message.message);
    ws.clients.forEach(c => c.send(JSON.stringify(message)));
  });
  let verifiedChangeStream = db.collection(COLLECTION_PROCESSED).watch()
  verifiedChangeStream.on("change", e => {
    var ws = eWs.getWss('/echo');
    let message = {
      type: "mdbProcessed",
      message: `New document in verifiedEmails with _id **${e.fullDocument._id.toString().substr(-4)} for name ${e.fullDocument.name}`,
      color: e.fullDocument.color
    };
    console.log(message.message);
    ws.clients.forEach(c => c.send(JSON.stringify(message)));
  });

});


const kafka = new Kafka({
  clientId: 'nodeJsClient',
  brokers: [KAFKA_BROKER],  
  ssl: true,
  sasl: {
    mechanism: 'plain', // scram-sha-256 or scram-sha-512
    username: KAFKA_KEY,
    password: KAFKA_SECRET
  },
});

const send = async (message) => {
  const producer = kafka.producer()
  await producer.connect()
  await producer.send({
    topic: TOPIC_INCOMING,
    messages: [
      { value: JSON.stringify(message) },
    ],
  });
  console.log(`Message sent with name: ${message.name}`)
  await producer.disconnect()
};

const listenToIncoming = async () => {
  const consumer = kafka.consumer({ groupId: 'incomingListener' });
  await consumer.connect();
  await consumer.subscribe({topic: TOPIC_INCOMING });
  await consumer.subscribe({topic: TOPIC_PROCESSED });
  await consumer.run({
    eachMessage: async ({topic, partition, message}) => {
      console.log("GOT MESSAGE");
      message = JSON.parse(message.value.toString());
      if (!message) return false;
      let outgoingMsg = {};
      switch(topic) {
        case TOPIC_INCOMING: 
          outgoingMsg = {
            type: "confIncoming",
            message: `Received a new message in "incomingMessage for user: ${message.name}`
          };
          break;
        case TOPIC_PROCESSED: 
          if (!message.fullDocument) return false;
          outgoingMsg = {
            type: "confProcessed",
            message: `Received a new message in "processedMessage for user: ${message.fullDocument.name}`,
            color: message.fullDocument.color 
          };
          break;
        default:
          outgoingMsg = {
            type: "error",
            message: "Unknown topic"
          }
      }
      console.log(outgoingMsg.message);
      var ws = eWs.getWss('/echo');
      ws.clients.forEach(c => c.send(JSON.stringify(outgoingMsg)));
    }
  });
}
listenToIncoming();

app.use(express.static('public'))

app.get("/send/:name/:vote", (req, res) => {
  send(req.params);
  res.send(req.params).status(200);
});

app.ws('/echo', (ws, req) => {
  console.log("Incoming in /echo");
  ws.on('message', function(msg) {
    console.log("Sending through /echo");
    ws.send(msg);
  });
});

app.listen(PORT, () => console.log(`Started on ${PORT}`))