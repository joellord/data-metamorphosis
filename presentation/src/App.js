import { Deck, Slide, Footer, Title, Subtitle, Image, List, Text, Browser, Video } from "@sambego/diorama";
import ImageWithTitle from "./components/ImageWithTitle";
import Multistep from "./components/Multistep";
import CodeSlide from "./components/CodeSlide";
import About from "./slides/About";
import ThankYou from "./slides/ThankYou";
import Kafka from "./slides/Kafka";

import ImgBugs from "./assets/bugs.jpg";
import ImgDataEverywhere1 from "./assets/kafka-data-everywhere-1.png";
import ImgDataEverywhere2 from "./assets/kafka-data-everywhere-2.png";
import ImgDataEverywhere3 from "./assets/kafka-data-everywhere-3.png";
import ImgDataEverywhere4 from "./assets/kafka-data-everywhere-4.png";
import ImgDataEverywhere5 from "./assets/kafka-data-everywhere-5.png";
import ImgDataEverywhere6 from "./assets/kafka-data-everywhere-6.png";
import ImgDataEverywhereFinal from "./assets/kafka-data-everywhere-final.png";
import ImgDataEverywhere from "./assets/kafka-data-everywhere.png";
import ImgEventStream from "./assets/kafka-event-stream.png";
import ImgEventStream2 from "./assets/kafka-event-stream-2.png";
import ImgDemoDiagram from "./assets/demo-diagram.png";
import ImgTopics from "./assets/topics.png";
import ImgPartitions from "./assets/partitions.png";
import ImgPartitions1 from "./assets/partitions-1.png";
import ImgPartitions2 from "./assets/partitions-2.png";
import ImgPartitions3 from "./assets/partitions-3.png";
import ImgPartitions4 from "./assets/partitions-4.png";
import ImgPartitions5 from "./assets/partitions-5.png";
import ImgPartitions6 from "./assets/partitions-6.png";
import ImgPartitions7 from "./assets/partitions-7.png";
import ImgShowCode from "./assets/show-me-the-code.jpg";
import ImgMindBlown from "./assets/mindblown.gif";
import ImgDemoDiagram2 from "./assets/demo-diagram-2.png";

import './App.css';

const SHOW_NOTES = true;

const talkProps = {
  title: "Data Metamorphosis with KafkaJS",
  conference: "Prairie Dev Con - Regina",
  conferenceHashTag: "#PrairieDevCon",
  date: "October, 2022",
  moreInfoUrl: "http://mdb.link/kafka"
}

const footer = <Footer left={`@joel__lord ${talkProps.conferenceHashTag}`} right={`${talkProps.moreInfoUrl}`} />


function App() {
  return (
    <Deck swipeToChange={false} footer={footer} presenterNotes={SHOW_NOTES}>
      <ImageWithTitle 
        title={talkProps.title}
        img={ ImgBugs } 
        notes="."
        />

      <Slide notes={`It's no secret that data is at the center of most applications nowadays. `}>
        <Title>Data</Title>
      </Slide>

      <Slide>
        <Subtitle>Most modern applications are GUI for databases</Subtitle>
      </Slide>

      <Slide>
        <Image src={ImgDataEverywhere1} />
      </Slide>

      <Slide>
        <Image src={ImgDataEverywhere2} />
      </Slide>

      <Slide>
        <Image src={ImgDataEverywhere3} />
      </Slide>

      <Slide>
        <Image src={ImgDataEverywhere4} />
      </Slide>

      <Slide>
        <Image src={ImgDataEverywhere5} />
      </Slide>

      <Slide>
        <Image src={ImgDataEverywhere6} />
      </Slide>

      <Slide>
        <Image src={ImgDataEverywhereFinal} />
      </Slide>

      <Slide>
        <Image src={ImgDataEverywhere} />
      </Slide>

      <About />

      <Slide>
        <Title>Agenda</Title>
        <List>
          <li>What is Kafka 🤔</li>
          <li>Using Kafka with Node.js (KafkaJS) 👷‍♂️</li>
          <li>Connectors 🤝</li>
        </List>
      </Slide>

      <Slide>
        <Title>What is Kafka</Title>
        <Text>Apache Kafka® is an event streaming platform that lets you read and write, store, and process streams of event. And all this functionality is provided in a distributed, highly scalable, elastic, fault-tolerant, and secure manner.</Text>        
      </Slide>

      <Slide>
        <Title>What is Kafka</Title>
        <Text>Database for events</Text>        
      </Slide>

      <Slide>
        <Subtitle>What's an event?</Subtitle>
        <Text>Something happened</Text>
      </Slide>

      <Multistep>
        <Subtitle>Events</Subtitle>
        <List>
          <li>IoT sensor</li>
          <li>Business process</li>
          <li>User interaction</li>
          <li>Microservice output</li>
        </List>
      </Multistep>

      <Slide>
        <Subtitle>Events</Subtitle>
        <Image src={ImgEventStream} />
      </Slide>

      <Slide>
        <Subtitle>Events</Subtitle>
        <Image src={ImgEventStream2} />
      </Slide>

      <Slide>
        <Subtitle>Events</Subtitle>
        <List>
          <li>What (state)</li>
          <li>When (timestamp)</li>
        </List>
      </Slide>

      <Slide>
        <Subtitle>Events</Subtitle>
        <List>
          <li>key &lt;Bytes []&gt;</li>
          <li>value &lt;Bytes []&gt;</li>
        </List>
      </Slide>

      <CodeSlide title="Events">
{`key.toString(); // '12322'
key.toString(); // 'user-123'
key.toString(); // '{"_id": 123, "user": "user-123"}'

value = JSON.parse(value.toString()); 
  // { _id: 123, data: "Hello World"}
`}
      </CodeSlide>

      <Slide>
        <Subtitle>Events</Subtitle>
        <List>
          <li>key &lt;Bytes []&gt;</li>
          <li>value &lt;Bytes []&gt;</li>
        </List>
      </Slide>

      <Slide>
        <Subtitle>Kafka Demo</Subtitle>
        <Image src={ImgDemoDiagram} />
      </Slide>

      <Kafka />

      <Slide>
        <Subtitle>Topics</Subtitle>
        <Image src={ImgEventStream2} />
      </Slide>

      <Slide>
        <Subtitle>Topics</Subtitle>
        <Image src={ImgTopics} />
      </Slide>

      <Slide>
        <Subtitle>Topics</Subtitle>
        <Text>Topics are to Kafka what Collections are to MongoDB (or tables to MySQL)</Text>
      </Slide>

      <Slide>
        <Subtitle>Topics</Subtitle>
        <Text>Topics are durable unindexed logs of events</Text>
      </Slide>

      <Slide>
        <Subtitle>Topics</Subtitle>
        <Text>Kafka events are immutable (just like in real life!)</Text>
      </Slide>

      <Slide>
        <Subtitle>Topics vs Queues</Subtitle>
        <Text>Topics are durable for as long as desired</Text>
      </Slide>

      <Slide>
        <Subtitle>Topics</Subtitle>
        <Text>Producers will write to a topic, and consumers will subscribe to them.</Text>
      </Slide>

      <Kafka />

      <Slide>
        <Subtitle>Partitions</Subtitle>
        <Image src={ImgPartitions} />
      </Slide>

      <Slide>
        <Subtitle>Partitions</Subtitle>
        <Text>Distribute events in a single topics across partitions that can live on separate nodes.</Text>
      </Slide>

      <Slide>
        <Subtitle>Partition Distribution</Subtitle>
        <List>
          <li>Round-robin with blank key</li>
        </List>
      </Slide>

      <Slide>
        <Subtitle>Partition Distribution</Subtitle>
        <Image src={ImgPartitions1} />
      </Slide>

      <Slide>
        <Subtitle>Partition Distribution</Subtitle>
        <Image src={ImgPartitions2} />
      </Slide>

      <Slide>
        <Subtitle>Partition Distribution</Subtitle>
        <Image src={ImgPartitions3} />
      </Slide>

      <Slide>
        <Subtitle>Partition Distribution</Subtitle>
        <Image src={ImgPartitions4} />
      </Slide>

      <Kafka />

      <Slide>
        <Subtitle>Partition Distribution</Subtitle>
        <List>
          <li>Round-robin with blank key</li>
          <li>Using hash of the key</li>
        </List>
      </Slide>

      <Slide>
        <Subtitle>Partition Distribution</Subtitle>
        <Image src={ImgPartitions5} />
      </Slide>

      <Slide>
        <Subtitle>Partition Distribution</Subtitle>
        <Image src={ImgPartitions6} />
      </Slide>

      <Slide>
        <Subtitle>Partition Distribution</Subtitle>
        <Image src={ImgPartitions7} />
      </Slide>

      <Slide>
        <Subtitle>Partitions</Subtitle>
        <Text>The order in which the events can be consumed is guaranteed _per partition_, but not across the topics.</Text>
      </Slide>

      <Kafka />

      <Slide>
        <Subtitle>Brokers and replication</Subtitle>
        <Text>Brokers are machines running the Kakfa process. Partitions are replicated across those brokers.</Text>
      </Slide>

      <Slide>
        <Subtitle>Brokers and replication</Subtitle>
        <Text>Data is stored to, and retrieved from leader partition, the replicated on follower partitions.</Text>
      </Slide>

      <Slide>
        <Image src={ImgShowCode} full />
      </Slide>

      <Slide>
        <Subtitle>Create a Kafka Cluster</Subtitle>
        <List>
          <li>Using containers (bitnami/zookeeper and bitname/kafka)</li>
          <li>Aiven (<a href="http://aiven.io">http://aiven.io</a>)</li>
          <li>Confluent (<a href="http://aiven.io">http://confluent.cloud</a>)</li>
        </List>
      </Slide>

      <Slide>
        <Subtitle>Kafka API</Subtitle>
        <List>
          <li>producer.send</li>
          <li>consumer.subscribe</li>
        </List>
      </Slide>

      <Slide>
        <Image src={ImgDataEverywhere} />
      </Slide>

      <Slide>
        <Subtitle>Introducing KafkaJS</Subtitle>
        <Text>KafkaJS, a modern Apache Kafka Client for Node.js</Text>
        <Text><a href="#">http://kafka.js.org</a></Text>
      </Slide>

      <CodeSlide lang="bash" title="KafkaJS">
{`npm install kafkajs
`}
      </CodeSlide>

      <CodeSlide title="KafkaJS">
{`import { Kafka } from "kafkajs";
`}
      </CodeSlide>

      <CodeSlide title="KafkaJS (Local w/ containers)">
{`const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: ["localhost:9092]
});
`}
      </CodeSlide>

      <CodeSlide title="KafkaJS (Aiven)">
{`const kafka = new Kafka({
  clientId: "weather-sensor-demo",
  brokers: ["mykafka-XXXX.aivencloud.com:19794"], 
  ssl: {
    rejectUnauthorized: true,
    ca: [fs.readFileSync("./ssl/ca.pem", "utf-8")],
    key: fs.readFileSync("./ssl/service.key", "utf-8"),
    cert: fs.readFileSync("./ssl/service.cert", "utf-8")
  }
});
`}
      </CodeSlide>

      <CodeSlide title="KafkaJS (Confluent)">
{`const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: ["XXX.northamerica-northeast1.gcp.confluent.cloud:9092"],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_KEY,
    password: process.env.KAFKA_SECRET
  }
});
`}
      </CodeSlide>

      <CodeSlide title="Producer">
{`const producer = kafka.producer();
await producer.connect();

producer.send({ 
  topic: TOPIC, 
  messages: [ { key, value } ] 
});
`}
      </CodeSlide>

      <CodeSlide title="Consumer">
{`const consumer = kafka.consumer({ groupId: GROUP_ID });
await consumer.connect();
await consumer.subscribe({ topic: TOPIC });

consumer.run({
  eachMessage: ({ topic, partition, message }) => {
    console.log({topic, partition, message});
  }
});
`}
      </CodeSlide>

      <Slide>
        <Subtitle>Groups</Subtitle>
        <Text>Let's you scale your consumers, or have multiple processes consuming the same events.</Text>
      </Slide>

      <Slide>
        <Image src={ImgMindBlown} full />
      </Slide>

      <Slide>
        <Subtitle>What? This talk could have been only 2 minutes long!</Subtitle>
      </Slide>

      <Slide>
        <Subtitle>¯\_(ツ)_/¯</Subtitle>
      </Slide>

      <Slide>
        <Subtitle>Connectors</Subtitle>
        <Image src={ImgDemoDiagram2} />
      </Slide>

      <Slide>
        <Subtitle>Live demo?</Subtitle>
      </Slide>

      <Slide>
        <Title>Recap</Title>
        <List>
          <li>What is Kafka 🤔</li>
          <li>Using Kafka with Node.js (KafkaJS) 👷‍♂️</li>
          <li>Connectors 🤝</li>
        </List>
      </Slide>

      <ThankYou 
        title={talkProps.title}
        conference={talkProps.conference}
        date={talkProps.date}
        moreInfoUrl={talkProps.moreInfoUrl}
      />
    </Deck>
  );
}

export default App;
