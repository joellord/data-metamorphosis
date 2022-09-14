const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { Kafka } = require("kafkajs");

const PORT = process.env.PORT || 3001;
const KAFKA_BROKER = process.env.KAFKA_BROKER || "kafka:9092";
const CLIENT_ID = process.env.CLIENT_ID || "clientID";

const clientConfig = {
  AUTH_SERVER: process.env.AUTH_SERVER || "http://localhost:3003"
}

const kafka = new Kafka({ 
  clientId: CLIENT_ID,
  brokers: [KAFKA_BROKER]
});
const producer = kafka.producer();
app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on("orientation", async data => {
    console.log("Accelerometer message received, sending to Kafka");
    await producer.connect();
    let message = {
      value: JSON.stringify(data)
    };
    await producer.send({
      topic: "accelerometer-data",
      messages: [ message ]
    });
    await producer.disconnect();
  });
  socket.on("score", async data => {
    console.log("New score received, sending to Kafka for the scoring microservice");
    await producer.connect();
    let message = {
      value: JSON.stringify(data)
    };
    await producer.send({
      topic: "score",
      messages: [ message ]
    });
    await producer.disconnect();
  });
});

app.get("/config", (req, res) => {
  res.send(clientConfig).status(200);
});

http.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});