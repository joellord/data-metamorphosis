import dotenv from "dotenv";
import { Kafka } from "kafkajs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({path: __dirname + "/../.env"});

const KAFKA = {
  BROKER: process.env.KAFKA_BROKER,
  KEY: process.env.KAFKA_KEY,
  SECRET: process.env.KAFKA_SECRET,
  GROUP_ID: "logger",
  CLIENT_ID: "twitterDemo",
  TOPICS: {
    NEWFOLLOWER: "newfollower",
    NEWIMAGE: "newimage",
    BANNERBUILT: "bannerbuilt"
  }
}

const kafka = new Kafka({
  clientId: KAFKA.CLIENT_ID,
  brokers: [KAFKA.BROKER],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: KAFKA.KEY,
    password: KAFKA.SECRET
  }
});

const consumer = kafka.consumer({ groupId: KAFKA.GROUP_ID });
await consumer.connect();
await consumer.subscribe({ topic: KAFKA.TOPICS.NEWFOLLOWER, fromBeginning: true });
await consumer.subscribe({ topic: KAFKA.TOPICS.NEWIMAGE, fromBeginning: true });
await consumer.subscribe({ topic: KAFKA.TOPICS.BANNERBUILT, fromBeginning: true });
consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log(`Incoming message on topic ${topic}, partition: ${partition}`);
    console.log(`Message key: ${message.key}`);
    console.log(`Message value: ${message.value}`);
  }
});

