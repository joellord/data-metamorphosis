import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Kafka } from "kafkajs";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({path: __dirname + "/../.env"});

const KAFKA = {
  BROKER: process.env.KAFKA_BROKER,
  KEY: process.env.KAFKA_KEY,
  SECRET: process.env.KAFKA_SECRET,
  GROUP_ID: "greeter",
  CLIENT_ID: "twitterDemo",
  TOPICS: {
    NEWFOLLOWER: "newfollower",
    NEWIMAGE: "newimage"
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
consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    let user = message.value.toString();
    console.log(`Hey there ${user}. Thanks for following me!`);
  }
});
