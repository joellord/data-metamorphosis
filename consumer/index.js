const { Kafka } = require("kafkajs");

const KAFKA_BROKER = process.env.KAFKA_BROKER || "kafka:9092";
const CLIENT_ID = process.env.CLIENT_ID || "clientID";
const GROUP_ID = process.env.GROUP_ID || "groupId";

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: [KAFKA_BROKER]
});
const consumer = kafka.consumer({ groupId: GROUP_ID })

async function main() {
  await consumer.connect()
  await consumer.subscribe({ topic: 'accelerometer-data', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("CONSUMER: Message received");
      console.log(message.value.toString());
    },
  });
}

main();