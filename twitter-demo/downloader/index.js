import dotenv from "dotenv";
import { TwitterApi } from 'twitter-api-v2';
import { Kafka } from "kafkajs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "node:fs";
import https from "node:https";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({path: __dirname + "/../.env"});

const TWITTER_KEYS = {
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

const KAFKA = {
  BROKER: process.env.KAFKA_BROKER,
  KEY: process.env.KAFKA_KEY,
  SECRET: process.env.KAFKA_SECRET,
  GROUP_ID: "downloader",
  CLIENT_ID: "twitterDemo",
  TOPICS: {
    NEWFOLLOWER: "newfollower",
    NEWIMAGE: "newimage"
  }
}

const twitter = new TwitterApi(TWITTER_KEYS);
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

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

            }
        });
    });
}

const consumer = kafka.consumer({ groupId: KAFKA.GROUP_ID });
await consumer.connect();
await consumer.subscribe({ topic: KAFKA.TOPICS.NEWFOLLOWER, fromBeginning: true });
consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log("New follower... Getting ready to download profile picture.");
    let user = await twitter.v2.userByUsername(message.value, {"user.fields": "id,location,name,pinned_tweet_id,profile_image_url,public_metrics,url,username"});
    user = user.data;
    const originalProfileImage = TwitterApi.getProfileImageInSize(user.profile_image_url, 'original');
    const extension = originalProfileImage.substring(originalProfileImage.lastIndexOf("."));
    const imagePath = `${__dirname}/../shared/${message.value}${extension}`
    await downloadImage(originalProfileImage, imagePath);
    console.log(`Image downloaded as ${imagePath}`);
    producer.send({topic: KAFKA.TOPICS.NEWIMAGE, messages: [ {key: user.id, value: JSON.stringify({username: user.username, image: imagePath})} ]});
  }
});
