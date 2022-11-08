import dotenv from "dotenv";
import { Kafka } from "kafkajs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import fs from "node:fs";
import terminalImage from 'terminal-image';


const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({path: __dirname + "/../.env"});

const KAFKA = {
  BROKER: process.env.KAFKA_BROKER,
  KEY: process.env.KAFKA_KEY,
  SECRET: process.env.KAFKA_SECRET,
  GROUP_ID: "bannerBuilder",
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

const producer = kafka.producer();
producer.connect();

let latest = fs.readFileSync(`${__dirname}/latest.txt`).toString();
latest = JSON.parse(latest);

const rect = new Buffer.from(
  '<svg><rect x="0" y="0" width="200" height="200" rx="100" ry="100"/></svg>'
);

const title = new Buffer.from(
  `<svg width="900px" height="100px">  
  <style>
  .title { fill: #000000; font-size: 70px; font-weight: bold;}
  </style>
  <text y="50%" class="title">Check out my new followers</text>
  </svg>`
);

const processMessage = async ({ topic, partition, message }) => {
  const {username} = JSON.parse(message.value.toString());
  console.log("Let's build a new image for this new follower");
  let newRecentFollowers = [username, ...latest].splice(0, 3);
  let svgs = [];

  for (let i = 0; i < newRecentFollowers.length; i++) {
    let username = newRecentFollowers[i];
    await sharp(`${__dirname}/../shared/${username}.jpg`)
      .resize(200, 200)
      .composite([{input: rect, blend: "dest-atop"}])
      .toFile(`${__dirname}/${i}.jpg`);
    svgs.push(new Buffer.from(`<svg width="200px" height="50px">
      <style>
      .text { fill: #000000; font-size: 36px; }
      </style>
      <text x="50%" y="50%" text-anchor="middle" class="text">@${username}</text>
      </svg>`));
  }

  await sharp(`${__dirname}/bg.png`)
    .composite([
      { input: title, top: 100, left: 100 },
      {
        input: `${__dirname}/0.jpg`,
        top: 400,
        left: 100
      },
      { input: svgs[0], top: 625, left: 100 },
      {
        input: `${__dirname}/1.jpg`,
        top: 400,
        left: 400
      },
      { input: svgs[1], top: 625, left: 400 },
      {
        input: `${__dirname}/2.jpg`,
        top: 400,
        left: 700
      },
      { input: svgs[2], top: 625, left: 700 },
    ])
    .toFile(`${__dirname}/newfollowers.png`);
    console.log(`New image is ready. Check it out! \n ${__dirname}/newfollowers.png`);
    console.log(await terminalImage.file(`${__dirname}/newfollowers.png`, {width: 70, height: 50}));
    fs.writeFileSync(`${__dirname}/latest.txt`, JSON.stringify(newRecentFollowers));
    latest = newRecentFollowers;

    let msg = {value: `${__dirname}/newfollowers.png`};
    producer.send({topic: KAFKA.TOPICS.BANNERBUILT, messages: [msg]});
}

const consumer = kafka.consumer({ groupId: KAFKA.GROUP_ID });
await consumer.connect();
await consumer.subscribe({ topic: KAFKA.TOPICS.NEWIMAGE, fromBeginning: true });
consumer.run({
  eachMessage: processMessage
});

