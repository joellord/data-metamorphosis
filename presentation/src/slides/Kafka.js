import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import { Slide, Text, Columns, Subtitle } from "@sambego/diorama";

const socket = io("http://localhost:5000");
const MAX_MESSAGES = 5;

function Kafka() {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [latestMessages, setLatestMessages] = useState([]);

  const addMessage = useCallback(m => {
    let messages = [...latestMessages, m];
    if (messages.length > MAX_MESSAGES) messages = messages.splice(1);
    setLatestMessages(messages);
  });

  useEffect(() => {
    socket.on("connect", (s) => {
      // Socket connected
    });
    socket.on("messageFromKafka", m => {
      addMessage(m);
    });

    return () => {
      socket.off("connect");
      socket.off("messageFromKafka");
    };
  }, [addMessage]);

  const sendMessage = async () => {
    console.log("Sending message");
    await socket.emit("messageFromClient", {key, value});
  };

  const toggleAutoProducer = () => {
    socket.emit("toggleDataProducer", true);
  }

  let decoder = new TextDecoder();

  return(
    <Slide>
      <Subtitle>Kafka Demo</Subtitle>
      <Columns>
        <div>
          <Text>
            Key : <input type="text" value={key} onChange={e => setKey(e.target.value)} /><br/>
            Value: <input type="text" value={value} onChange={e => setValue(e.target.value)} /><br/>
            <button onClick={sendMessage}>Send</button><br/>
            <button onClick={toggleAutoProducer}>Toggle Auto Data Feed</button>
          </Text>
        </div>
        <div>
          {latestMessages.map((m, i) => {
            const key = decoder.decode(m.message.key || new ArrayBuffer());
            const value = decoder.decode(m.message.value);
            return(
              <p style={{textAlign: "left"}} key={i}>
                Topic: {m.topic}<br/>
                Partition: {m.partition}<br/>
                Key: {key}<br/>
                Value: {value}
              </p>
            )
          })}
        </div>
      </Columns>
    </Slide>
  )
}

export default Kafka;