const { Kafka } = require("kafkajs");
const mongodb = require("mongodb");

const KAFKA_BROKER = process.env.KAFKA_BROKER || "kafka:9092";
const CLIENT_ID = process.env.CLIENT_ID || "clientID";
const GROUP_ID = process.env.GROUP_ID || "scoreGroup";
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

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: [KAFKA_BROKER]
});
const consumer = kafka.consumer({ groupId: GROUP_ID })

async function main() {
  await consumer.connect()
  await consumer.subscribe({ topic: 'score', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("SCORE: Message Received");
      let data = JSON.parse(message.value.toString());
      console.log(data);
      console.log(`Increment score for ${data.userId}`)
      let result = await db.collection("game").updateOne({_id: mongodb.ObjectId(data.userId)}, {$inc: {score: 1}});
      console.log(result);
    },
  });
}

main();