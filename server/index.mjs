import { Kafka } from "kafkajs";
import { createServer } from "http";
import { Server } from "socket.io";
import * as dotenv from 'dotenv' 

dotenv.config();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 5000

const KAFKA_BROKER = process.env.KAFKA_BROKER || "kafka:9092";
const CLIENT_ID = "presentation";
const TOPIC = "data-metamorphosis";

let PRODUCE_DATA = false;

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: [KAFKA_BROKER],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_KEY,
    password: process.env.KAFKA_SECRET
  }
});

const consumer = kafka.consumer({ groupId: "consumer-1" });
await consumer.connect();
await consumer.subscribe({ topic: TOPIC, fromBeginning: true });
consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    sendMessageToSockets({topic, partition, message});
  }
});

const sendMessageToSockets = async (data) => {
  await io.sockets.emit("messageFromKafka", data);
}

const producer = kafka.producer();
producer.connect();

setInterval(() => {
  if (!PRODUCE_DATA) return;
  let value = "" + Math.round(Math.random()*10);
  producer.send({ topic: TOPIC, messages: [ { key: "automaticData", value } ] });
}, 5000)

io.on("connection", (socket) => {
  socket.on("messageFromClient", async (data) => {
    let event = { 
      topic: TOPIC, messages: [
        {key: (data.key ? data.key : null), value: data.value}
      ]
    };
    await producer.send(event);
  });

  socket.on("toggleDataProducer", _ => PRODUCE_DATA = !PRODUCE_DATA);
});

process.on("SIGINT", () => {
  producer.disconnect();
  consumer.disconnect();
});

httpServer.listen(PORT);
