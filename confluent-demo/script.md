# Script for the MongoDB Connector demo

Log in to Confluent
Create new environment
* Essentials
* AWS/Frankfurt

Create cluster
* Basic
* AWS/Frankfurt
* Launch

Open DO
squid-app
Actions -> Manage Env Vars

Confluent
Connect to cluster -> Node.js
Create Kafka API keys

Add KAFKA_BROKER
Add KAFKA_KEY and KAFKA_SECRET to DO env vars

Confluent
Download & Continue
Copy Bootstrap.server value

DO: Add KAFKA_BROKER
Save env vars
(Build triggered)

Confluent
Nav -> Connectors -> MongoDB Atlas Sink
Add new topic: incoming (1 partition)
Select "incoming" 
Continue
Generate & Download
Continue
Host: cluster0.w9sjahs.mongodb.net
User: data
Password: metamorphosis
DB Name: datameta
Collection: incomingMessage
Continue
JSON 
Continue
Continue
Continue

Create topic demo.datameta.processedMessage (1 part)
Rebuild DO app

Nav -> Connectors -> MongoDB Atlas Source
Prefix: demo
Global Access. Download & Continue
Host: cluster0.w9sjahs.mongodb.net
User: data
Password: metamorphosis
DB Name: datameta
Collection: processedMessage
Continue
Format: JSON
Continue
Continue
Continue



