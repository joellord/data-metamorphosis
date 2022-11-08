import dotenv from "dotenv";
import { TwitterApi } from 'twitter-api-v2';
import { Kafka } from "kafkajs";
import pause from "@joellord/pause";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { markAsUntransferable } from "worker_threads";

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
  GROUP_ID: "followerMonitor",
  CLIENT_ID: "twitterDemo",
  TOPICS: {
    NEWFOLLOWER: "newfollower"
  }
}

const client = new TwitterApi(TWITTER_KEYS);
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

const checkRateLimit = async (err) => {
  if (err?.rateLimit?.remaining === 0) {
    let currentTimestamp = (new Date()).getTime();
    currentTimestamp /= 1000;
    currentTimestamp = Math.floor(currentTimestamp);
    let secondsLeft = err.rateLimit.reset - currentTimestamp;
    console.log(`Rate limit reached. Pausing for ${secondsLeft} seconds.`);
    await pause(secondsLeft);
    return [];
  }
}

const CHECK_DELAY = 60;

let myFollowers = await client.v1.userFollowerIds().catch(checkRateLimit);
let myFollowerIds = myFollowers.ids;

console.log(`Starting Twitter follower monitoring. You currently have ${myFollowerIds.length} followers.`);

let quarterDelay = Math.round(CHECK_DELAY/4);
await pause(CHECK_DELAY/4);
console.log(`${quarterDelay * 3} seconds left`);
await pause(CHECK_DELAY/4);
console.log(`${quarterDelay * 2} seconds left`);
await pause(CHECK_DELAY/4);
console.log(`${quarterDelay * 1} seconds left`);
await pause(CHECK_DELAY/4);

do {
  // Check current follower count
  let followerCheck = await client.v1.userFollowerIds().catch(checkRateLimit);
  console.log(`Current followers count: ${followerCheck.ids.length} vs known count of ${myFollowerIds.length}`);

  // If new followers, find the ids
  if (followerCheck.ids.length > myFollowerIds.length) {
    let newFollowers = followerCheck.ids.filter(id => {
      return (myFollowerIds.indexOf(id) === -1);
    });

    //Get user data for new followers
    newFollowers.map(async id => {
      console.log(`Search for ${id}`); 
      let follower = await client.v2.users(id);
      let followerData = follower.data[0];
      console.log(`New follower: ${followerData.username} (${followerData.id})`);
      producer.send({topic: KAFKA.TOPICS.NEWFOLLOWER, messages: [ { key: followerData.id, value: followerData.username }]});
    });

  }
  
  myFollowerIds = [...followerCheck.ids];
  await pause(CHECK_DELAY);
} while(true);

