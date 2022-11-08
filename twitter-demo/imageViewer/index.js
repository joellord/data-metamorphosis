import dotenv from "dotenv";
import { Kafka } from "kafkajs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import terminalImage from 'terminal-image';


const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({path: __dirname + "/../.env"});

const KAFKA = {
  BROKER: process.env.KAFKA_BROKER,
  KEY: process.env.KAFKA_KEY,
  SECRET: process.env.KAFKA_SECRET,
  GROUP_ID: "imageViewer",
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

const processMessage = async ({ topic, partition, message }) => {
    let imagePath = message.value.toString();
    console.log(await terminalImage.file(imagePath, {width: 70, height: 50}));
}

const consumer = kafka.consumer({ groupId: KAFKA.GROUP_ID });
await consumer.connect();
await consumer.subscribe({ topic: KAFKA.TOPICS.BANNERBUILT, fromBeginning: true });
consumer.run({
  eachMessage: processMessage
});

